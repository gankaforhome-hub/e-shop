import { JWT_REFRESH_TOKEN_EXP } from '@common/constants';
import { convertToSecondsUtil } from '@common/utils';
import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  E_OneTimeTokenPurpose,
  OneTimeToken,
  Prisma,
  Token,
} from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { v4 } from 'uuid';
import { IAuthUser } from '../interfaces';

//COMMENT several tabs can refresh at once with the same token
const REFRESH_REUSE_GRACE_MS = 10_000;

//COMMENT refresh tokens are long and random, so a plain SHA-256 is enough to make a DB leak useless
const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

const generateToken = () => randomBytes(32).toString('base64url');

//COMMENT atomic: of two concurrent requests with one token, only one gets true
const consumeOneTimeToken = async (
  tx: Prisma.TransactionClient,
  { hash }: OneTimeToken,
  now: Date,
) => {
  const { count } = await tx.oneTimeToken.updateMany({
    where: { hash, consumedAt: null, expires: { gt: now } },
    data: { consumedAt: now },
  });
  return count === 1;
};

export type EmailChangeResult = 'invalid' | 'pending' | 'conflict' | 'applied';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    private readonly db: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getRefreshTokenExpires() {
    const lifetime = convertToSecondsUtil(
      this.configService.get(JWT_REFRESH_TOKEN_EXP) || '1M',
    );
    return new Date(Date.now() + lifetime * 1000);
  }

  //COMMENT every sign-in is its own session; the returned `token` is the raw value for the cookie
  async setRefreshToken(
    userId: string,
    userAgent?: string,
  ): Promise<Token | null> {
    const token = generateToken();

    return await this.db
      .$transaction(async tx => {
        await tx.token.deleteMany({
          where: { userId, expires: { lt: new Date() } },
        });
        const created = await tx.token.create({
          data: {
            token: hashToken(token),
            familyId: v4(),
            expires: this.getRefreshTokenExpires(),
            userId,
            userAgent,
          },
        });
        return { ...created, token };
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  /**
   * Replaces a refresh token with the next one of its family.
   * A token used again after the grace window has leaked, so the whole family is revoked.
   */
  async rotateRefreshToken(
    refreshToken: string,
    userAgent?: string,
  ): Promise<Token | null> {
    const current = await this.findRefreshToken(refreshToken);
    const now = new Date();

    if (!current || current.expires <= now) {
      return null;
    }

    if (
      current.rotatedAt &&
      now.getTime() - current.rotatedAt.getTime() > REFRESH_REUSE_GRACE_MS
    ) {
      this.logger.warn(
        `Refresh token reuse: revoked a session of user ${current.userId}`,
      );
      await this.deleteRefreshTokenFamily(current.familyId);
      return null;
    }

    const token = generateToken();

    return await this.db
      .$transaction(async tx => {
        await tx.token.updateMany({
          where: { id: current.id, rotatedAt: null },
          data: { rotatedAt: now },
        });
        await tx.token.deleteMany({
          where: { userId: current.userId, expires: { lt: now } },
        });
        const next = await tx.token.create({
          data: {
            token: hashToken(token),
            familyId: current.familyId,
            audience: current.audience,
            aal: current.aal,
            expires: this.getRefreshTokenExpires(),
            userId: current.userId,
            userAgent,
          },
        });
        return { ...next, token };
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  async getRefreshToken(refreshToken: string): Promise<Token | null> {
    if (typeof refreshToken !== 'string') {
      return null;
    }
    return await this.db.token
      .findUnique({ where: { token: hashToken(refreshToken) } })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  async findRefreshToken(refreshToken: string): Promise<Token | null> {
    //COMMENT cookie-parser turns "j:{...}" values into objects
    if (typeof refreshToken !== 'string') {
      return null;
    }
    return await this.db.token.findFirst({
      where: { token: hashToken(refreshToken) },
    });
  }

  async findSessionByUserIdAndUserAgent(
    userId: string,
    userAgent: string,
  ): Promise<Token | null> {
    return await this.db.token.findFirst({
      where: { userId, userAgent },
    });
  }

  //COMMENT the user of a live session, or null: a rotated token can't keep a session alive
  async findSessionUser(
    familyId: string,
    userId: string,
  ): Promise<Omit<IAuthUser, 'sid'> | null> {
    //COMMENT Prisma skips undefined filters: without the ids this would match any session
    if (!familyId || !userId) {
      return null;
    }
    const session = await this.db.token.findFirst({
      where: {
        familyId,
        userId,
        rotatedAt: null,
        expires: { gt: new Date() },
      },
      select: { user: { select: { id: true, email: true, roles: true } } },
    });
    return session?.user ?? null;
  }

  //COMMENT ends the whole session the token belongs to
  async deleteRefreshToken(refreshToken: string): Promise<Token | null> {
    const token = await this.findRefreshToken(refreshToken);
    if (!token) {
      return null;
    }
    await this.deleteRefreshTokenFamily(token.familyId);
    return token;
  }

  async deleteRefreshTokenFamily(
    familyId: string,
  ): Promise<{ count: number } | null> {
    //COMMENT Prisma skips undefined filters: without an id this would delete every session
    if (!familyId) {
      return null;
    }
    return await this.db.token
      .deleteMany({
        where: { familyId },
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  async deleteAllRefreshTokens(
    userId: string,
  ): Promise<{ count: number } | null> {
    //COMMENT Prisma skips undefined filters: without an id this would delete every session
    if (!userId) {
      return null;
    }
    return await this.db.token
      .deleteMany({
        where: { userId },
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  //COMMENT a new token replaces the earlier ones of this purpose; returns the raw value for the email
  async createOneTimeToken(
    userId: string,
    purpose: E_OneTimeTokenPurpose,
    lifetimeMs: number,
    newEmail?: string,
  ): Promise<string> {
    const token = generateToken();
    const now = Date.now();

    await this.db.$transaction([
      this.db.oneTimeToken.deleteMany({
        where: {
          userId,
          OR: [{ purpose }, { expires: { lt: new Date(now) } }],
        },
      }),
      this.db.oneTimeToken.create({
        data: {
          hash: hashToken(token),
          purpose,
          newEmail,
          expires: new Date(now + lifetimeMs),
          userId,
        },
      }),
    ]);

    return token;
  }

  async findOneTimeToken(
    token: string,
    purpose: E_OneTimeTokenPurpose,
  ): Promise<OneTimeToken | null> {
    return await this.db.oneTimeToken.findFirst({
      where: {
        hash: hashToken(token),
        purpose,
        consumedAt: null,
        expires: { gt: new Date() },
      },
    });
  }

  async deleteEmailChangeTokens(userId: string): Promise<void> {
    await this.db.oneTimeToken.deleteMany({
      where: {
        userId,
        purpose: {
          in: [
            E_OneTimeTokenPurpose.EMAIL_CHANGE_OLD,
            E_OneTimeTokenPurpose.EMAIL_CHANGE_NEW,
          ],
        },
      },
    });
  }

  async completeEmailVerification(token: OneTimeToken): Promise<boolean> {
    const now = new Date();

    return await this.db.$transaction(async tx => {
      if (!(await consumeOneTimeToken(tx, token, now))) {
        return false;
      }
      await tx.user.update({
        where: { id: token.userId },
        data: { emailVerifiedAt: now },
      });
      return true;
    });
  }

  /**
   * Sets the new password and ends every session and pending one-time token.
   * The reset proves ownership of the mailbox, so the email counts as verified. It must
   * never touch hardware keys or staff rights: a mailbox alone can't grant those.
   */
  async completePasswordReset(
    token: OneTimeToken,
    passwordHash: string,
  ): Promise<boolean> {
    const now = new Date();
    const { userId } = token;

    return await this.db.$transaction(async tx => {
      if (!(await consumeOneTimeToken(tx, token, now))) {
        return false;
      }
      await tx.user.updateMany({
        where: { id: userId, emailVerifiedAt: null },
        data: { emailVerifiedAt: now },
      });
      await tx.user.update({
        where: { id: userId },
        data: { password: passwordHash },
      });
      await tx.token.deleteMany({ where: { userId } });
      await tx.oneTimeToken.deleteMany({ where: { userId } });
      return true;
    });
  }

  //COMMENT ends every other session and pending one-time token of the user
  async changePassword(
    userId: string,
    passwordHash: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.user.update({
        where: { id: userId },
        data: { password: passwordHash },
      }),
      this.db.token.deleteMany({
        where: { userId, familyId: { not: currentSessionId } },
      }),
      this.db.oneTimeToken.deleteMany({ where: { userId } }),
    ]);
  }

  /**
   * Records one confirmation; the change applies once both addresses have confirmed.
   * Serializable: two confirmations at the same moment must not both miss each other.
   * The one that loses fails with nothing changed, so its link still works on a retry.
   */
  async confirmEmailChange(token: OneTimeToken): Promise<EmailChangeResult> {
    const { userId, newEmail, purpose } = token;
    const now = new Date();

    if (!newEmail) {
      return 'invalid';
    }

    return await this.db
      .$transaction(
        async tx => {
          if (!(await consumeOneTimeToken(tx, token, now))) {
            return 'invalid';
          }

          const other = await tx.oneTimeToken.findFirst({
            where: {
              userId,
              newEmail,
              expires: { gt: now },
              purpose:
                purpose === E_OneTimeTokenPurpose.EMAIL_CHANGE_OLD
                  ? E_OneTimeTokenPurpose.EMAIL_CHANGE_NEW
                  : E_OneTimeTokenPurpose.EMAIL_CHANGE_OLD,
            },
          });
          if (!other?.consumedAt) {
            return 'pending';
          }

          await tx.oneTimeToken.deleteMany({
            where: {
              userId,
              purpose: {
                in: [
                  E_OneTimeTokenPurpose.EMAIL_CHANGE_OLD,
                  E_OneTimeTokenPurpose.EMAIL_CHANGE_NEW,
                ],
              },
            },
          });

          //COMMENT the address could have been taken since the request
          const owner = await tx.user.findUnique({
            where: { email: newEmail },
            select: { id: true },
          });
          if (owner) {
            return 'conflict';
          }

          await tx.user.update({
            where: { id: userId },
            data: { email: newEmail, emailVerifiedAt: now },
          });
          await tx.token.deleteMany({ where: { userId } });
          return 'applied';
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      )
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return 'invalid' as const;
      });
  }
}

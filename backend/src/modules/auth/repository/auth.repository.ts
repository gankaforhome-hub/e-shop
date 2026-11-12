import { JWT_REFRESH_TOKEN_EXP, TERMS_VERSION } from '@common/constants';
import {
  convertToSecondsUtil,
  generateToken,
  hashToken,
  normalizeEmail,
} from '@common/utils';
import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  E_AuthAudience,
  E_OneTimeTokenPurpose,
  OneTimeToken,
  Prisma,
  Token,
  User,
} from '@prisma/client';
import { v4 } from 'uuid';
import { IAuthUser } from '../interfaces';

//COMMENT several tabs can refresh at once with the same token
const REFRESH_REUSE_GRACE_MS = 10_000;

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
    audience: E_AuthAudience = E_AuthAudience.STOREFRONT,
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
            audience,
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
    userAgent: string | undefined,
    audience: E_AuthAudience,
  ): Promise<Token | null> {
    const current = await this.findRefreshToken(refreshToken);
    const now = new Date();

    //COMMENT a token only works on the refresh route of its own app
    if (!current || current.audience !== audience || current.expires <= now) {
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
            credentialId: current.credentialId,
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
      select: {
        audience: true,
        aal: true,
        credentialId: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            staffAccount: {
              select: { role: true, revokedAt: true },
            },
            _count: { select: { webAuthnCredentials: true } },
          },
        },
      },
    });
    if (!session) {
      return null;
    }
    const { user, audience, aal, credentialId } = session;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      aud: audience,
      aal,
      credentialId,
      hasKey: user._count.webAuthnCredentials > 0,
      staff: user.staffAccount,
    };
  }

  //COMMENT every row of the family, so a token rotated earlier can't bring the old level back
  async elevateSession(familyId: string, credentialId: string): Promise<void> {
    await this.db.token.updateMany({
      where: { familyId },
      data: { aal: 2, credentialId },
    });
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

  /**
   * One user per address: a Google sign-in lands on the account with the same email, and Google
   * wins. The caller has checked that Google verified the email.
   * - known Google id → that user;
   * - same email, already verified → link (the same mailbox owner signed up with a password);
   * - same email, NOT verified → it may be a stranger who signed up with this address: link,
   *   mark the email verified, drop the password and phone, end every session and pending link;
   * - no account → create one, verified, without a password ("Forgot password" sets one); the
   *   Google button carries the terms notice, so the acceptance is recorded with TERMS_VERSION.
   * Names from Google only fill empty fields (Google may send none; the storefront then asks).
   * Staff rights live in `staff_accounts` and are never touched here.
   */
  async linkGoogleAccount(
    googleSub: string,
    rawEmail: string,
    names: { firstName?: string; lastName?: string },
  ): Promise<User> {
    const email = normalizeEmail(rawEmail);
    const now = new Date();

    return await this.db.$transaction(async tx => {
      //COMMENT never overwrite what the user typed
      const fillNames = (user: Pick<User, 'firstName' | 'lastName'>) => ({
        ...(!user.firstName && names.firstName && { firstName: names.firstName }),
        ...(!user.lastName && names.lastName && { lastName: names.lastName }),
      });

      const linked = await tx.user.findUnique({ where: { googleSub } });
      if (linked) {
        const data = fillNames(linked);
        return Object.keys(data).length
          ? tx.user.update({ where: { id: linked.id }, data })
          : linked;
      }

      const existing = await tx.user.findUnique({ where: { email } });
      if (!existing) {
        return tx.user.create({
          data: {
            email,
            googleSub,
            emailVerifiedAt: now,
            password: null,
            firstName: names.firstName,
            lastName: names.lastName,
            termsAcceptedAt: now,
            termsVersion: TERMS_VERSION,
          },
        });
      }

      if (existing.emailVerifiedAt) {
        return tx.user.update({
          where: { id: existing.id },
          data: { googleSub, ...fillNames(existing) },
        });
      }

      await tx.token.deleteMany({ where: { userId: existing.id } });
      await tx.oneTimeToken.deleteMany({ where: { userId: existing.id } });
      return tx.user.update({
        where: { id: existing.id },
        //COMMENT everything the possible squatter typed goes; the owner accepts the terms anew
        data: {
          googleSub,
          emailVerifiedAt: now,
          password: null,
          phone: null,
          phoneVerifiedAt: null,
          firstName: names.firstName ?? null,
          lastName: names.lastName ?? null,
          marketingConsentAt: null,
          termsAcceptedAt: now,
          termsVersion: TERMS_VERSION,
        },
      });
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

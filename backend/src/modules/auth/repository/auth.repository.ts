import { JWT_REFRESH_TOKEN_EXP } from '@common/constants';
import { convertToSecondsUtil } from '@common/utils';
import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Token } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { v4 } from 'uuid';
import { IAuthUser } from '../interfaces';

//COMMENT several tabs can refresh at once with the same token
const REFRESH_REUSE_GRACE_MS = 10_000;

//COMMENT refresh tokens are long and random, so a plain SHA-256 is enough to make a DB leak useless
const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

const generateToken = () => randomBytes(32).toString('base64url');

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
}

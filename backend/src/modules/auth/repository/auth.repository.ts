import {
  JWT_REFRESH_TOKEN_EXP,
  TERMS_VERSION,
  AuthAudience,
} from '@common/constants';
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
  Customer,
  CustomerToken,
  E_ConsentSource,
  E_ConsentType,
  E_CustomerTokenPurpose,
  E_IdentityProvider,
  Prisma,
  StaffSession,
} from '@prisma/client';
import { v4 } from 'uuid';
import { IAuthUser } from '../interfaces';

//COMMENT several tabs can refresh at once with the same token
const REFRESH_REUSE_GRACE_MS = 10_000;

//COMMENT staff and customer sessions have the same columns, so one type serves both
export type SessionToken = StaffSession;

type Db = PrismaService | Prisma.TransactionClient;

type SessionWhere = {
  id?: string;
  token?: string;
  familyId?: string | { not: string };
  userId?: string;
  userAgent?: string;
  rotatedAt?: null;
  expires?: { gt?: Date; lt?: Date };
};

type SessionData = {
  token: string;
  familyId: string;
  aal?: number;
  credentialId?: string | null;
  expires: Date;
  userId: string;
  userAgent?: string | null;
};

//COMMENT the two session tables behind one narrow interface; each app only ever sees its own
interface SessionTable {
  findFirst(where: SessionWhere): Promise<SessionToken | null>;
  create(data: SessionData): Promise<SessionToken>;
  updateMany(
    where: SessionWhere,
    data: Partial<SessionData> & { rotatedAt?: Date },
  ): Promise<{ count: number }>;
  deleteMany(where: SessionWhere): Promise<{ count: number }>;
}

const sessionTable = (db: Db, audience: AuthAudience): SessionTable =>
  audience === AuthAudience.CMS
    ? {
        findFirst: where => db.staffSession.findFirst({ where }),
        create: data => db.staffSession.create({ data }),
        updateMany: (where, data) =>
          db.staffSession.updateMany({ where, data }),
        deleteMany: where => db.staffSession.deleteMany({ where }),
      }
    : {
        findFirst: where => db.customerSession.findFirst({ where }),
        create: data => db.customerSession.create({ data }),
        updateMany: (where, data) =>
          db.customerSession.updateMany({ where, data }),
        deleteMany: where => db.customerSession.deleteMany({ where }),
      };

//COMMENT atomic: of two concurrent requests with one token, only one gets true
const consumeCustomerToken = async (
  tx: Prisma.TransactionClient,
  { hash }: CustomerToken,
  now: Date,
) => {
  const { count } = await tx.customerToken.updateMany({
    where: { hash, consumedAt: null, expires: { gt: now } },
    data: { consumedAt: now },
  });
  return count === 1;
};

export type EmailChangeResult = 'invalid' | 'pending' | 'conflict' | 'applied';

/**
 * Sessions of both apps (each in its own table, chosen by the audience) and the one-time
 * links of customers. Staff links live in `StaffRepository`.
 */
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
    userAgent: string | undefined,
    audience: AuthAudience,
  ): Promise<SessionToken | null> {
    const token = generateToken();

    return await this.db
      .$transaction(async tx => {
        const sessions = sessionTable(tx, audience);
        await sessions.deleteMany({ userId, expires: { lt: new Date() } });
        const created = await sessions.create({
          token: hashToken(token),
          familyId: v4(),
          expires: this.getRefreshTokenExpires(),
          userId,
          userAgent,
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
   * A token only exists in its own app's table, so it never works on the other refresh route.
   */
  async rotateRefreshToken(
    refreshToken: string,
    userAgent: string | undefined,
    audience: AuthAudience,
  ): Promise<SessionToken | null> {
    const current = await this.findRefreshToken(refreshToken, audience);
    const now = new Date();

    if (!current || current.expires <= now) {
      return null;
    }

    if (
      current.rotatedAt &&
      now.getTime() - current.rotatedAt.getTime() > REFRESH_REUSE_GRACE_MS
    ) {
      this.logger.warn(
        `Refresh token reuse: revoked a ${audience} session of user ${current.userId}`,
      );
      await this.deleteRefreshTokenFamily(current.familyId, audience);
      return null;
    }

    const token = generateToken();

    return await this.db
      .$transaction(async tx => {
        const sessions = sessionTable(tx, audience);
        await sessions.updateMany(
          { id: current.id, rotatedAt: null },
          { rotatedAt: now },
        );
        await sessions.deleteMany({
          userId: current.userId,
          expires: { lt: now },
        });
        const next = await sessions.create({
          token: hashToken(token),
          familyId: current.familyId,
          aal: current.aal,
          credentialId: current.credentialId,
          expires: this.getRefreshTokenExpires(),
          userId: current.userId,
          userAgent,
        });
        return { ...next, token };
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  async findRefreshToken(
    refreshToken: string,
    audience: AuthAudience,
  ): Promise<SessionToken | null> {
    //COMMENT cookie-parser turns "j:{...}" values into objects
    if (typeof refreshToken !== 'string') {
      return null;
    }
    return await sessionTable(this.db, audience).findFirst({
      token: hashToken(refreshToken),
    });
  }

  async findSessionByUserIdAndUserAgent(
    userId: string,
    userAgent: string,
    audience: AuthAudience = AuthAudience.STOREFRONT,
  ): Promise<SessionToken | null> {
    return await sessionTable(this.db, audience).findFirst({
      userId,
      userAgent,
    });
  }

  //COMMENT the user of a live session, or null: a rotated token can't keep a session alive
  async findSessionUser(
    familyId: string,
    userId: string,
    audience: AuthAudience,
  ): Promise<Omit<IAuthUser, 'sid'> | null> {
    //COMMENT Prisma skips undefined filters: without the ids this would match any session
    if (!familyId || !userId) {
      return null;
    }
    const where = {
      familyId,
      userId,
      rotatedAt: null,
      expires: { gt: new Date() },
    };

    if (audience === AuthAudience.CMS) {
      const session = await this.db.staffSession.findFirst({
        where,
        select: {
          aal: true,
          credentialId: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              revokedAt: true,
              _count: { select: { webAuthnCredentials: true } },
            },
          },
        },
      });
      if (!session) {
        return null;
      }
      const { user, aal, credentialId } = session;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        aud: AuthAudience.CMS,
        aal,
        credentialId,
        hasKey: user._count.webAuthnCredentials > 0,
        staff: { role: user.role, revokedAt: user.revokedAt },
      };
    }

    const session = await this.db.customerSession.findFirst({
      where,
      select: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
    if (!session) {
      return null;
    }
    const { user } = session;
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    return {
      id: user.id,
      email: user.email,
      name: name || null,
      aud: AuthAudience.STOREFRONT,
      aal: 1,
      credentialId: null,
      hasKey: false,
      staff: null,
    };
  }

  //COMMENT every row of the family, so a token rotated earlier can't bring the old level back
  async elevateSession(familyId: string, credentialId: string): Promise<void> {
    await this.db.staffSession.updateMany({
      where: { familyId },
      data: { aal: 2, credentialId },
    });
  }

  //COMMENT ends the whole session the token belongs to
  async deleteRefreshToken(
    refreshToken: string,
    audience: AuthAudience,
  ): Promise<SessionToken | null> {
    const token = await this.findRefreshToken(refreshToken, audience);
    if (!token) {
      return null;
    }
    await this.deleteRefreshTokenFamily(token.familyId, audience);
    return token;
  }

  async deleteRefreshTokenFamily(
    familyId: string,
    audience: AuthAudience,
  ): Promise<{ count: number } | null> {
    //COMMENT Prisma skips undefined filters: without an id this would delete every session
    if (!familyId) {
      return null;
    }
    return await sessionTable(this.db, audience)
      .deleteMany({ familyId })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  async deleteAllRefreshTokens(
    userId: string,
    audience: AuthAudience,
  ): Promise<{ count: number } | null> {
    //COMMENT Prisma skips undefined filters: without an id this would delete every session
    if (!userId) {
      return null;
    }
    return await sessionTable(this.db, audience)
      .deleteMany({ userId })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  // ─── Customer one-time links ──────────────────────────────────────────────

  //COMMENT a new token replaces the earlier ones of this purpose; returns the raw value for the email
  async createOneTimeToken(
    userId: string,
    purpose: E_CustomerTokenPurpose,
    lifetimeMs: number,
    newEmail?: string,
  ): Promise<string> {
    const token = generateToken();
    const now = Date.now();

    await this.db.$transaction([
      this.db.customerToken.deleteMany({
        where: {
          userId,
          OR: [{ purpose }, { expires: { lt: new Date(now) } }],
        },
      }),
      this.db.customerToken.create({
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
    purpose: E_CustomerTokenPurpose,
  ): Promise<CustomerToken | null> {
    return await this.db.customerToken.findFirst({
      where: {
        hash: hashToken(token),
        purpose,
        consumedAt: null,
        expires: { gt: new Date() },
      },
    });
  }

  async deleteEmailChangeTokens(userId: string): Promise<void> {
    await this.db.customerToken.deleteMany({
      where: {
        userId,
        purpose: {
          in: [
            E_CustomerTokenPurpose.EMAIL_CHANGE_OLD,
            E_CustomerTokenPurpose.EMAIL_CHANGE_NEW,
          ],
        },
      },
    });
  }

  /**
   * One customer per address: a Google sign-in lands on the account with the same email, and
   * Google wins. The caller has checked that Google verified the email.
   * - known Google identity → that customer;
   * - same email, already verified → link (the same mailbox owner signed up with a password);
   * - same email, NOT verified → it may be a stranger who signed up with this address: link,
   *   mark the email verified, drop the password, phone, names and marketing choice, end every
   *   session and pending link, and record the terms anew;
   * - no account → create one, verified, without a password ("Forgot password" sets one); the
   *   Google button carries the terms notice, so the acceptance is recorded with TERMS_VERSION.
   * Names from Google only fill empty fields (Google may send none; the storefront then asks).
   */
  async linkGoogleAccount(
    googleSub: string,
    rawEmail: string,
    names: { firstName?: string; lastName?: string },
  ): Promise<Customer> {
    const email = normalizeEmail(rawEmail);
    const now = new Date();
    const identity = {
      provider: E_IdentityProvider.GOOGLE,
      providerUserId: googleSub,
    };
    const termsConsents = (customerId: string) =>
      [E_ConsentType.TERMS, E_ConsentType.PRIVACY].map(type => ({
        customerId,
        type,
        granted: true,
        version: TERMS_VERSION,
        source: E_ConsentSource.GOOGLE,
        createdAt: now,
      }));

    return await this.db.$transaction(async tx => {
      //COMMENT never overwrite what the customer typed
      const fillNames = (c: Pick<Customer, 'firstName' | 'lastName'>) => ({
        ...(!c.firstName && names.firstName && { firstName: names.firstName }),
        ...(!c.lastName && names.lastName && { lastName: names.lastName }),
      });

      const linked = await tx.customerIdentity.findUnique({
        where: { provider_providerUserId: identity },
        include: { customer: true },
      });
      if (linked) {
        await tx.customerIdentity.update({
          where: { id: linked.id },
          data: { lastUsedAt: now },
        });
        const data = fillNames(linked.customer);
        return Object.keys(data).length
          ? tx.customer.update({ where: { id: linked.customerId }, data })
          : linked.customer;
      }

      const existing = await tx.customer.findUnique({ where: { email } });
      if (!existing) {
        const created = await tx.customer.create({
          data: {
            email,
            emailVerifiedAt: now,
            password: null,
            firstName: names.firstName,
            lastName: names.lastName,
            identities: { create: { ...identity, email, lastUsedAt: now } },
          },
        });
        await tx.customerConsent.createMany({
          data: termsConsents(created.id),
        });
        return created;
      }

      if (existing.emailVerifiedAt) {
        await tx.customerIdentity.create({
          data: {
            ...identity,
            email,
            lastUsedAt: now,
            customerId: existing.id,
          },
        });
        return tx.customer.update({
          where: { id: existing.id },
          data: fillNames(existing),
        });
      }

      await tx.customerSession.deleteMany({ where: { userId: existing.id } });
      await tx.customerToken.deleteMany({ where: { userId: existing.id } });
      await tx.customerIdentity.create({
        data: { ...identity, email, lastUsedAt: now, customerId: existing.id },
      });
      await tx.customerConsent.createMany({
        data: [
          ...termsConsents(existing.id),
          ...(existing.marketingEmail
            ? [
                {
                  customerId: existing.id,
                  type: E_ConsentType.MARKETING_EMAIL,
                  granted: false,
                  source: E_ConsentSource.GOOGLE,
                  createdAt: now,
                },
              ]
            : []),
        ],
      });
      return tx.customer.update({
        where: { id: existing.id },
        //COMMENT everything the possible squatter typed goes
        data: {
          emailVerifiedAt: now,
          password: null,
          phone: null,
          phoneVerifiedAt: null,
          firstName: names.firstName ?? null,
          lastName: names.lastName ?? null,
          marketingEmail: false,
          marketingSms: false,
        },
      });
    });
  }

  async completeEmailVerification(token: CustomerToken): Promise<boolean> {
    const now = new Date();

    return await this.db.$transaction(async tx => {
      if (!(await consumeCustomerToken(tx, token, now))) {
        return false;
      }
      await tx.customer.update({
        where: { id: token.userId },
        data: { emailVerifiedAt: now },
      });
      return true;
    });
  }

  /**
   * Sets the new password and ends every session and pending one-time token.
   * The reset proves ownership of the mailbox, so the email counts as verified.
   */
  async completePasswordReset(
    token: CustomerToken,
    passwordHash: string,
  ): Promise<boolean> {
    const now = new Date();
    const { userId } = token;

    return await this.db.$transaction(async tx => {
      if (!(await consumeCustomerToken(tx, token, now))) {
        return false;
      }
      await tx.customer.updateMany({
        where: { id: userId, emailVerifiedAt: null },
        data: { emailVerifiedAt: now },
      });
      await tx.customer.update({
        where: { id: userId },
        data: { password: passwordHash },
      });
      await tx.customerSession.deleteMany({ where: { userId } });
      await tx.customerToken.deleteMany({ where: { userId } });
      return true;
    });
  }

  //COMMENT ends every other session and pending one-time token of the customer
  async changePassword(
    userId: string,
    passwordHash: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.customer.update({
        where: { id: userId },
        data: { password: passwordHash },
      }),
      this.db.customerSession.deleteMany({
        where: { userId, familyId: { not: currentSessionId } },
      }),
      this.db.customerToken.deleteMany({ where: { userId } }),
    ]);
  }

  /**
   * Records one confirmation; the change applies once both addresses have confirmed.
   * Serializable: two confirmations at the same moment must not both miss each other.
   * The one that loses fails with nothing changed, so its link still works on a retry.
   */
  async confirmEmailChange(token: CustomerToken): Promise<EmailChangeResult> {
    const { userId, newEmail, purpose } = token;
    const now = new Date();

    if (!newEmail) {
      return 'invalid';
    }

    return await this.db
      .$transaction(
        async tx => {
          if (!(await consumeCustomerToken(tx, token, now))) {
            return 'invalid';
          }

          const other = await tx.customerToken.findFirst({
            where: {
              userId,
              newEmail,
              expires: { gt: now },
              purpose:
                purpose === E_CustomerTokenPurpose.EMAIL_CHANGE_OLD
                  ? E_CustomerTokenPurpose.EMAIL_CHANGE_NEW
                  : E_CustomerTokenPurpose.EMAIL_CHANGE_OLD,
            },
          });
          if (!other?.consumedAt) {
            return 'pending';
          }

          await tx.customerToken.deleteMany({
            where: {
              userId,
              purpose: {
                in: [
                  E_CustomerTokenPurpose.EMAIL_CHANGE_OLD,
                  E_CustomerTokenPurpose.EMAIL_CHANGE_NEW,
                ],
              },
            },
          });

          //COMMENT the address could have been taken since the request
          const owner = await tx.customer.findUnique({
            where: { email: newEmail },
            select: { id: true },
          });
          if (owner) {
            return 'conflict';
          }

          await tx.customer.update({
            where: { id: userId },
            data: { email: newEmail, emailVerifiedAt: now },
          });
          await tx.customerSession.deleteMany({ where: { userId } });
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

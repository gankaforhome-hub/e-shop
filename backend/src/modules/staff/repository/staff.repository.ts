import { generateToken, hashToken } from '@common/utils';
import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  E_StaffRole,
  E_StaffTokenPurpose,
  E_WebAuthnChallengePurpose,
  Prisma,
  StaffToken,
  StaffUser,
  WebAuthnCredential,
} from '@prisma/client';

const CHALLENGE_LIFETIME_MS = 5 * 60 * 1000;

export interface IAuditEntry {
  actorId?: string;
  action: string;
  targetId?: string;
  ip?: string;
  meta?: Prisma.InputJsonValue;
}

export type NewCredential = Omit<
  Prisma.WebAuthnCredentialUncheckedCreateInput,
  'createdAt' | 'lastUsedAt'
>;

@Injectable()
export class StaffRepository {
  private readonly logger = new Logger(StaffRepository.name);

  constructor(private readonly db: PrismaService) {}

  findStaffUser(id: string): Promise<StaffUser | null> {
    return this.db.staffUser.findUnique({ where: { id } });
  }

  //COMMENT the caller normalizes the email
  findStaffUserByEmail(email: string): Promise<StaffUser | null> {
    return this.db.staffUser.findUnique({ where: { email } });
  }

  findCredentials(userId: string): Promise<WebAuthnCredential[]> {
    return this.db.webAuthnCredential.findMany({ where: { userId } });
  }

  findCredential(
    id: string,
    userId: string,
  ): Promise<WebAuthnCredential | null> {
    return this.db.webAuthnCredential.findFirst({ where: { id, userId } });
  }

  async updateCredentialCounter(id: string, counter: number): Promise<void> {
    await this.db.webAuthnCredential.update({
      where: { id },
      data: { counter, lastUsedAt: new Date() },
    });
  }

  //COMMENT only the latest challenge of a kind is valid
  async saveChallenge(
    userId: string,
    purpose: E_WebAuthnChallengePurpose,
    challenge: string,
    action?: string,
  ): Promise<void> {
    const now = Date.now();

    await this.db.$transaction([
      this.db.webAuthnChallenge.deleteMany({
        where: {
          userId,
          OR: [
            { purpose, action: action ?? null },
            { expires: { lt: new Date(now) } },
          ],
        },
      }),
      this.db.webAuthnChallenge.create({
        data: {
          userId,
          purpose,
          challenge,
          action,
          expires: new Date(now + CHALLENGE_LIFETIME_MS),
        },
      }),
    ]);
  }

  //COMMENT atomic and single use, even when the signature check fails afterwards
  async consumeChallenge(
    userId: string,
    purpose: E_WebAuthnChallengePurpose,
    action?: string,
  ): Promise<string | null> {
    const record = await this.db.webAuthnChallenge.findFirst({
      where: {
        userId,
        purpose,
        action: action ?? null,
        expires: { gt: new Date() },
      },
    });
    if (!record) {
      return null;
    }
    const { count } = await this.db.webAuthnChallenge.deleteMany({
      where: { id: record.id },
    });
    return count === 1 ? record.challenge : null;
  }

  //COMMENT saves a key together with its audit record; false when the key is already registered
  async addCredential(
    credential: NewCredential,
    audit: IAuditEntry,
  ): Promise<boolean> {
    return await this.db
      .$transaction(async tx => {
        await tx.webAuthnCredential.create({ data: credential });
        await tx.auditLog.create({ data: audit });
        return true;
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return false;
      });
  }

  async recordAudit(entry: IAuditEntry): Promise<void> {
    await this.db.auditLog.create({ data: entry });
  }

  //COMMENT a root grant for an existing staff account: the role, and access back if revoked
  async grant(
    userId: string,
    role: E_StaffRole,
    audit: IAuditEntry,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.staffUser.update({
        where: { id: userId },
        data: { role, revokedAt: null },
      }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  //COMMENT every staff member, newest first; the password hash never leaves this method
  async listTeam() {
    const users = await this.db.staffUser.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { webAuthnCredentials: true } } },
    });

    return users.map(user => ({
      userId: user.id,
      role: user.role,
      revokedAt: user.revokedAt,
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      hasPassword: user.password !== null,
      emailVerified: user.emailVerifiedAt !== null,
      hasKey: user._count.webAuthnCredentials > 0,
    }));
  }

  /**
   * Creates the staff account when the address is new, gives the role and returns a one-time
   * link token. Accepting it sets the password and confirms the email; the access works at once.
   */
  async invite(
    email: string,
    role: E_StaffRole,
    lifetimeMs: number,
    audit: Omit<IAuditEntry, 'targetId'> & { actorId: string },
  ): Promise<{ userId: string; token: string }> {
    const token = generateToken();
    const now = new Date();

    const userId = await this.db.$transaction(async tx => {
      const { id } = await tx.staffUser.upsert({
        where: { email },
        create: { email, role, invitedById: audit.actorId },
        update: { role, revokedAt: null },
        select: { id: true },
      });
      await tx.staffToken.deleteMany({
        where: { userId: id, purpose: E_StaffTokenPurpose.INVITE },
      });
      await tx.staffToken.create({
        data: {
          hash: hashToken(token),
          userId: id,
          purpose: E_StaffTokenPurpose.INVITE,
          expires: new Date(now.getTime() + lifetimeMs),
        },
      });
      await tx.auditLog.create({ data: { ...audit, targetId: id } });
      return id;
    });

    return { userId, token };
  }

  async changeRole(
    userId: string,
    role: E_StaffRole,
    audit: IAuditEntry,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.staffUser.update({ where: { id: userId }, data: { role } }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  //COMMENT for a lost or stolen device: every key and session goes; the password still works
  async resetKeys(userId: string, audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      this.db.webAuthnCredential.deleteMany({ where: { userId } }),
      this.db.webAuthnChallenge.deleteMany({ where: { userId } }),
      this.db.staffSession.deleteMany({ where: { userId } }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  //COMMENT access ends at once: every session and the pending links of the user go too
  async revoke(userId: string, audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      this.db.staffUser.update({
        where: { id: userId },
        data: { revokedAt: new Date() },
      }),
      this.db.staffSession.deleteMany({ where: { userId } }),
      this.db.staffToken.deleteMany({ where: { userId } }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  // ─── Staff one-time links (invitation, password reset) ───────────────────

  //COMMENT a new link replaces the earlier ones of this purpose; returns the raw value for the email
  async createToken(
    userId: string,
    purpose: E_StaffTokenPurpose,
    lifetimeMs: number,
  ): Promise<string> {
    const token = generateToken();
    const now = Date.now();

    await this.db.$transaction([
      this.db.staffToken.deleteMany({
        where: {
          userId,
          OR: [{ purpose }, { expires: { lt: new Date(now) } }],
        },
      }),
      this.db.staffToken.create({
        data: {
          hash: hashToken(token),
          purpose,
          expires: new Date(now + lifetimeMs),
          userId,
        },
      }),
    ]);

    return token;
  }

  findToken(
    token: string,
    purpose: E_StaffTokenPurpose,
  ): Promise<StaffToken | null> {
    return this.db.staffToken.findFirst({
      where: {
        hash: hashToken(token),
        purpose,
        consumedAt: null,
        expires: { gt: new Date() },
      },
    });
  }

  /**
   * Accepting an invitation or a reset: spends the link, sets the password, confirms the email
   * (the link proves the mailbox) and ends every session and pending link. Never touches keys
   * or the role: a mailbox alone can't grant those. False when the link was already spent.
   */
  async setPasswordWithToken(
    { hash, userId }: StaffToken,
    passwordHash: string,
  ): Promise<boolean> {
    const now = new Date();

    return this.db.$transaction(async tx => {
      const { count } = await tx.staffToken.updateMany({
        where: { hash, consumedAt: null, expires: { gt: now } },
        data: { consumedAt: now },
      });
      if (count !== 1) {
        return false;
      }
      await tx.staffUser.updateMany({
        where: { id: userId, emailVerifiedAt: null },
        data: { emailVerifiedAt: now },
      });
      await tx.staffUser.update({
        where: { id: userId },
        data: { password: passwordHash },
      });
      await tx.staffSession.deleteMany({ where: { userId } });
      await tx.staffToken.deleteMany({ where: { userId } });
      return true;
    });
  }

  //COMMENT ends every other session and pending link of the staff member
  async changePassword(
    userId: string,
    passwordHash: string,
    currentSessionId: string,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.staffUser.update({
        where: { id: userId },
        data: { password: passwordHash },
      }),
      this.db.staffSession.deleteMany({
        where: { userId, familyId: { not: currentSessionId } },
      }),
      this.db.staffToken.deleteMany({ where: { userId } }),
    ]);
  }
}

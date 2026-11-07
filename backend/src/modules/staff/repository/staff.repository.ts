import { generateToken, hashToken } from '@common/utils';
import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  E_OneTimeTokenPurpose,
  E_StaffRole,
  E_WebAuthnChallengePurpose,
  OneTimeToken,
  Prisma,
  StaffAccount,
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

  findStaffAccount(userId: string): Promise<StaffAccount | null> {
    return this.db.staffAccount.findUnique({ where: { userId } });
  }

  findUserWithStaff(userId: string) {
    return this.db.user.findUnique({
      where: { id: userId },
      select: { emailVerifiedAt: true, staffAccount: true },
    });
  }

  countCredentials(userId: string): Promise<number> {
    return this.db.webAuthnCredential.count({ where: { userId } });
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

  findEnrollmentCode(
    code: string,
    userId: string,
  ): Promise<OneTimeToken | null> {
    return this.db.oneTimeToken.findFirst({
      where: {
        hash: hashToken(code),
        userId,
        purpose: E_OneTimeTokenPurpose.STAFF_ENROLLMENT,
        consumedAt: null,
        expires: { gt: new Date() },
      },
    });
  }

  /**
   * Saves a key together with its audit record. With a code, the code is spent in the same
   * transaction, so one code can't register two keys. False when the code is already spent
   * or the key is already registered.
   */
  async addCredential(
    credential: NewCredential,
    audit: IAuditEntry,
    enrollmentCode?: string,
  ): Promise<boolean> {
    const now = new Date();

    return await this.db
      .$transaction(async tx => {
        if (enrollmentCode) {
          const { count } = await tx.oneTimeToken.updateMany({
            where: {
              hash: hashToken(enrollmentCode),
              userId: credential.userId,
              purpose: E_OneTimeTokenPurpose.STAFF_ENROLLMENT,
              consumedAt: null,
              expires: { gt: now },
            },
            data: { consumedAt: now },
          });
          if (count !== 1) {
            return false;
          }
        }
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

  //COMMENT a new grant always starts as pending; a pending email change must not survive it
  async grant(
    userId: string,
    role: E_StaffRole,
    audit: IAuditEntry,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.staffAccount.upsert({
        where: { userId },
        create: { userId, role },
        update: { role, approvedAt: null, approvedById: null, revokedAt: null },
      }),
      this.db.oneTimeToken.deleteMany({
        where: {
          userId,
          purpose: {
            in: [
              E_OneTimeTokenPurpose.EMAIL_CHANGE_OLD,
              E_OneTimeTokenPurpose.EMAIL_CHANGE_NEW,
            ],
          },
        },
      }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  async createEnrollmentCode(
    userId: string,
    lifetimeMs: number,
    audit: IAuditEntry,
  ): Promise<string> {
    const code = generateToken();

    await this.db.$transaction([
      this.db.oneTimeToken.deleteMany({
        where: { userId, purpose: E_OneTimeTokenPurpose.STAFF_ENROLLMENT },
      }),
      this.db.oneTimeToken.create({
        data: {
          hash: hashToken(code),
          userId,
          purpose: E_OneTimeTokenPurpose.STAFF_ENROLLMENT,
          expires: new Date(Date.now() + lifetimeMs),
        },
      }),
      this.db.auditLog.create({ data: audit }),
    ]);

    return code;
  }

  async approve(
    userId: string,
    approvedById: string,
    audit: IAuditEntry,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.staffAccount.update({
        where: { userId },
        data: { approvedAt: new Date(), approvedById },
      }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  //COMMENT access ends at once: every session and pending enrollment of the user goes too
  async revoke(userId: string, audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      this.db.staffAccount.update({
        where: { userId },
        data: { revokedAt: new Date() },
      }),
      this.db.token.deleteMany({ where: { userId } }),
      this.db.oneTimeToken.deleteMany({
        where: { userId, purpose: E_OneTimeTokenPurpose.STAFF_ENROLLMENT },
      }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }
}

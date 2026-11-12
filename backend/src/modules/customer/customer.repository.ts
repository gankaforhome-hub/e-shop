import { TERMS_VERSION } from '@common/constants';
import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  Customer,
  E_ConsentSource,
  E_ConsentType,
  Prisma,
} from '@prisma/client';

export type NewCustomer = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  marketingEmail: boolean;
};

//COMMENT where a consent came from, kept with each journal row as proof
export type ConsentContext = {
  source: E_ConsentSource;
  ip?: string;
  userAgent?: string;
};

export type ProfileChange = {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  marketingEmail?: boolean;
};

@Injectable()
export class CustomerRepository {
  constructor(private readonly db: PrismaService) {}

  findById(id: string): Promise<Customer | null> {
    return this.db.customer.findUnique({ where: { id } });
  }

  //COMMENT the caller normalizes the email
  findByEmail(email: string): Promise<Customer | null> {
    return this.db.customer.findUnique({ where: { email } });
  }

  async isPhoneTaken(phone: string): Promise<boolean> {
    return (await this.db.customer.count({ where: { phone } })) > 0;
  }

  /**
   * A new account with its consent journal in one transaction: the terms and the privacy policy
   * (accepted at sign-up, TERMS_VERSION) and the separate news-and-offers opt-in when ticked.
   * Null when the email or phone was taken in the meantime.
   */
  async create(
    { passwordHash, marketingEmail, ...profile }: NewCustomer,
    { source, ip, userAgent }: ConsentContext,
  ): Promise<Customer | null> {
    const consent = (type: E_ConsentType, version?: string) => ({
      type,
      granted: true,
      version,
      source,
      ip,
      userAgent,
    });

    return this.db.customer
      .create({
        data: {
          ...profile,
          password: passwordHash,
          marketingEmail,
          consents: {
            create: [
              consent(E_ConsentType.TERMS, TERMS_VERSION),
              consent(E_ConsentType.PRIVACY, TERMS_VERSION),
              ...(marketingEmail
                ? [consent(E_ConsentType.MARKETING_EMAIL)]
                : []),
            ],
          },
        },
      })
      .catch((err: unknown) => {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          return null;
        }
        throw err;
      });
  }

  /**
   * Own profile fields only, never email, password or rights. A changed marketing choice is
   * also written to the consent journal; a new phone is not verified yet.
   */
  async updateProfile(
    current: Customer,
    { marketingEmail, phone, ...names }: ProfileChange,
    context: ConsentContext,
  ): Promise<Customer> {
    const isNewPhone = phone !== undefined && phone !== current.phone;
    const isNewMarketing =
      marketingEmail !== undefined && marketingEmail !== current.marketingEmail;

    return this.db.$transaction(async tx => {
      if (isNewMarketing) {
        await tx.customerConsent.create({
          data: {
            customerId: current.id,
            type: E_ConsentType.MARKETING_EMAIL,
            granted: marketingEmail,
            source: context.source,
            ip: context.ip,
            userAgent: context.userAgent,
          },
        });
      }
      return tx.customer.update({
        where: { id: current.id },
        data: {
          ...names,
          ...(isNewPhone && { phone, phoneVerifiedAt: null }),
          ...(isNewMarketing && { marketingEmail }),
        },
      });
    });
  }
}

import { PrismaService } from '@database/prisma/prisma.service';
import { PasswordService } from '@modules/password/password.service';
import { CreateUserDto, UpdateUserDto } from '@modules/user/dto';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

export type CustomerProfileData = {
  firstName?: string;
  lastName?: string;
  termsAcceptedAt?: Date;
  termsVersion?: string;
  marketingConsentAt?: Date | null;
};

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    private readonly db: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  //COMMENT createUser; customer sign-up adds the profile and the consents
  async createUser(
    data: CreateUserDto & CustomerProfileData,
  ): Promise<User | null> {
    const hashedPassword = await this.passwordService.getHashPassword(
      data.password,
    );
    return this.db.user
      .create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          termsAcceptedAt: data.termsAcceptedAt,
          termsVersion: data.termsVersion,
          marketingConsentAt: data.marketingConsentAt,
        },
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  //COMMENT get all user
  async getUsers(): Promise<User[] | null> {
    return await this.db.user.findMany().catch(err => {
      //TODO Add Logger
      this.logger.error(err);
      return null;
    });
  }

  //COMMENT get user by id
  async getUserById(id: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { id } }).catch(err => {
      //TODO Add Logger
      this.logger.error(err);
      return null;
    });
  }

  //COMMENT get user by id or email
  async getUserByIdOrEmail(idOrEmail: string): Promise<User | null> {
    const user = await this.db.user
      .findFirst({
        where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
    return user;
  }

  //COMMENT whether a phone (E.164) already belongs to an account
  async isPhoneTaken(phone: string): Promise<boolean> {
    return (await this.db.user.count({ where: { phone } })) > 0;
  }

  //COMMENT get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.db.user
      .findFirst({
        where: { email },
      })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }

  //COMMENT update user by id
  //COMMENT the customer's own profile fields only; never email, password or rights
  async updateProfile(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      marketingConsentAt?: Date | null;
    },
  ): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: {
        ...data,
        //COMMENT a new number is not verified yet
        ...(data.phone !== undefined && { phoneVerifiedAt: null }),
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User | null> {
    return await this.db.user.update({ where: { id }, data }).catch(err => {
      //TODO Add Logger
      this.logger.error(err);
      return null;
    });
  }

  //COMMENT delete user by id
  async deleteUser(id: string): Promise<{ id: string } | null> {
    return await this.db.user
      .delete({ where: { id }, select: { id: true } })
      .catch(err => {
        //TODO Add Logger
        this.logger.error(err);
        return null;
      });
  }
}

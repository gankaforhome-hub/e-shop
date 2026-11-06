import { PrismaService } from '@database/prisma/prisma.service';
import { PasswordService } from '@modules/password/password.service';
import { CreateUserDto, UpdateUserDto } from '@modules/user/dto';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    private readonly db: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  //COMMENT createUser
  async createUser(data: CreateUserDto): Promise<User | null> {
    const hashedPassword = await this.passwordService.getHashPassword(
      data.password,
    );
    return this.db.user
      .create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          roles: ['USER'],
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

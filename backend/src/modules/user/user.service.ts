import { JWT_ACCESS_TOKEN_EXP } from '@common/constants';
import { convertToSecondsUtil } from '@common/utils';
import { IJwtPayload } from '@modules/auth/interfaces';
import { CreateUserDto, UpdateUserDto } from '@modules/user/dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { E_UserRole, User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.createUser(createUserDto);
    return user;
  }

  findAll() {
    return this.userRepository.getUsers();
  }

  //COMMENT function with caching
  async findOneByIdOrEmail(idOrEmail: string, isReset = false) {
    //COMMENT check if user login again
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }
    const user = await this.cacheManager.get<User>(idOrEmail);
    if (!user) {
      const user = await this.userRepository.getUserByIdOrEmail(idOrEmail);
      if (!user) {
        throw new NotFoundException(`User not found`);
        // return null;
      }
      const ttl = convertToSecondsUtil(
        await this.configService.get(JWT_ACCESS_TOKEN_EXP)!,
      );
      //INFO If using cache-manager v4, provide ttl in seconds
      //INFO If using cache-manager v5, provide ttl in milliseconds
      await this.cacheManager.set(idOrEmail, user, ttl * 1000);
      return user;
    }
    this.logger.log('[Cache] Get from cash...');
    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  async remove(id: string, user: IJwtPayload) {
    //COMMENT delete only own user and with status user role ADMIN
    const isAdmin = user.roles ? user.roles.includes(E_UserRole.ADMIN) : false;
    if (id !== user.id && !isAdmin) {
      throw new ForbiddenException();
    }
    await Promise.all([
      await this.cacheManager.del(id),
      await this.cacheManager.del(user.email),
    ]);
    return this.userRepository.deleteUser(id);
  }
}

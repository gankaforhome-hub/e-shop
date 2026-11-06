import { JWT_ACCESS_TOKEN_EXP } from '@common/constants';
import { convertToSecondsUtil, normalizeEmail } from '@common/utils';
import { IAuthUser } from '@modules/auth/interfaces';
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

  //COMMENT only the account owner and ADMIN can access a user
  private assertCanAccess(id: string, actor: IAuthUser) {
    const isAdmin = actor.roles
      ? actor.roles.includes(E_UserRole.ADMIN)
      : false;
    if (id !== actor.id && !isAdmin) {
      throw new ForbiddenException();
    }
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.createUser({
      ...createUserDto,
      email: normalizeEmail(createUserDto.email),
    });
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
      //COMMENT the password hash never goes to the cache
      await this.cacheManager.set(
        idOrEmail,
        { ...user, password: null },
        ttl * 1000,
      );
      return user;
    }
    this.logger.log('[Cache] Get from cash...');
    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.getUserByEmail(normalizeEmail(email));
  }

  //COMMENT without the cache, for data that must be current
  findById(id: string) {
    return this.userRepository.getUserById(id);
  }

  async clearCache(id: string) {
    await this.cacheManager.del(id);
  }

  findOne(id: string, actor: IAuthUser) {
    this.assertCanAccess(id, actor);
    return this.findOneByIdOrEmail(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto, actor: IAuthUser) {
    this.assertCanAccess(id, actor);
    await this.cacheManager.del(id);
    return this.userRepository.updateUser(id, updateUserDto);
  }

  async remove(id: string, actor: IAuthUser) {
    this.assertCanAccess(id, actor);
    const target = await this.userRepository.getUserByIdOrEmail(id);
    await this.cacheManager.del(id);
    if (target) {
      await this.cacheManager.del(target.email);
    }
    return this.userRepository.deleteUser(id);
  }
}

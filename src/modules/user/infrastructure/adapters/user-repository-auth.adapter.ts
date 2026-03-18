import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { AuthUserRepository } from 'src/modules/auth/application/ports/auth-user-repository.port';

@Injectable()
export class UserRepositoryAuthAdapter implements AuthUserRepository {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepo: UserRepository,
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    return await this._userRepo.findByEmail(email);
  }

  async create(user: User): Promise<User> {
    return await this._userRepo.create(user);
  }

  async update(id: string, userDetails: Partial<User>): Promise<User | null> {
    return await this._userRepo.update(id, userDetails);
  }

  async findById(id: string): Promise<User | null> {
    return await this._userRepo.findById(id);
  }
}

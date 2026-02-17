import { Injectable } from '@nestjs/common';
import { AuthUserRepository } from 'src/auth/application/ports/auth-user-repository.port';
import { User } from 'src/user/domain/entities/user.entity';
import { UserRepository } from 'src/user/domain/repositories/user.repository';

@Injectable()
export class UserRepositoryAuthAdapter implements AuthUserRepository {
  constructor(private readonly _userRepo: UserRepository) {}
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

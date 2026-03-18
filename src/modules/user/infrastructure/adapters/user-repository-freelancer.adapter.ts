import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { FreelancerUserRepository } from 'src/modules/freelancer/application/ports/freelancer-user.repository.port';

@Injectable()
export class UserRepositoryFreelancerAdapter implements FreelancerUserRepository {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepo: UserRepository,
  ) {}

  findById(id: string): Promise<User | null> {
    return this._userRepo.findById(id);
  }

  update(id: string, entity: Partial<User>): Promise<User | null> {
    return this._userRepo.update(id, entity);
  }
}

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { FreelancerUserRepository } from 'src/modules/freelancer/application/ports/freelancer-user.repository.port';

@Injectable()
export class UserRepositoryFreelancerAdapter implements FreelancerUserRepository {
  constructor(private readonly _userRepo: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return await this._userRepo.findById(id);
  }
}

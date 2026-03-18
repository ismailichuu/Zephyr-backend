import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { ClientUserRepository } from 'src/modules/client/application/ports/client-user.respository.port';

@Injectable()
export class UserRepositoryClientAdapter implements ClientUserRepository {
  constructor(private readonly _userRepo: UserRepository) {}

  findById(id: string): Promise<User | null> {
    return this._userRepo.findById(id);
  }

  update(id: string, entity: Partial<User>): Promise<User | null> {
    return this._userRepo.update(id, entity);
  }
}

import { AdminUserRepositoryPort } from 'src/modules/admin/application/ports/admin-user-repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryAdminAdapter implements AdminUserRepositoryPort {
  constructor(private readonly _userRepo: UserRepository) {}

  countDocument(): Promise<number> {
    return this._userRepo.countDocument();
  }

  findPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    data: User[];
    total: number;
    totalPages: number;
  }> {
    return this._userRepo.findPaginated(page, limit, search);
  }

  findById(userId: string): Promise<User | null> {
    return this._userRepo.findById(userId);
  }

  update(userId: string, entity: Partial<User>): Promise<User | null> {
    return this._userRepo.update(userId, entity);
  }
}

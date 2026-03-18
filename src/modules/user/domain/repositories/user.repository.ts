import { BaseRepository } from 'src/modules/shared/repositories/base.repository';
import { User } from '../entities/user.entity';

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    data: User[];
    total: number;
    totalPages: number;
  }>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

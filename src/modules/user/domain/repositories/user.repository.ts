import { BaseRepository } from 'src/modules/shared/repositories/base.repository';
import { User } from '../entities/user.entity';

export abstract class UserRepository implements BaseRepository<User> {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(entity: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: string, entity: Partial<User>): Promise<User | null>;
  abstract findPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    data: User[];
    total: number;
    totalPages: number;
  }>;
  abstract countDocument(): Promise<number>;
}

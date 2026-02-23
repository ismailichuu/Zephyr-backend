import { User } from 'src/modules/user/domain/entities/user.entity';

export interface AdminUserRepositoryPort {
  findPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    data: User[];
    total: number;
    totalPages: number;
  }>;
  findById(userId: string): Promise<User | null>;
  update(userId: string, entity: Partial<User>): Promise<User | null>;
  countDocument(): Promise<number>;
}

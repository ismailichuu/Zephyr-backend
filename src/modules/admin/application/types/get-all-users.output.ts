import { User } from 'src/modules/user/domain/entities/user.entity';

export interface GetAllUsersOutput {
  users: Partial<User>[];
  totalPages: number;
  totalUsers: number;
}

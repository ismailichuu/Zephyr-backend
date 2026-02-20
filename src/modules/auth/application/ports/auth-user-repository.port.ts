import { User } from 'src/modules/user/domain/entities/user.entity';

export interface AuthUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, userDetails: Partial<User>): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

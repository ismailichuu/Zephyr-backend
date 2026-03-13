import { User } from 'src/modules/user/domain/entities/user.entity';

export interface FreelancerUserRepository {
  findById(id: string): Promise<User | null>;
  update(id: string, entity: Partial<User>): Promise<User | null>;
}

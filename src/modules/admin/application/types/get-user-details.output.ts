import { User } from 'src/modules/user/domain/entities/user.entity';

export interface GetUserDetailsOutput {
  user: Partial<User>;
}

import { User } from 'src/modules/user/domain/entities/user.entity';

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  user: Partial<User>;
}

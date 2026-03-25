import { User } from 'src/modules/user/domain/entities/user.entity';

export interface SignupOtpVerifyOutput {
  accessToken: string;
  refreshToken: string;
  user: Partial<User>;
}

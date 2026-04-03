import { GoogleLoginInput } from '../../types/google-login.input';
import { GoogleLoginOutput } from '../../types/google-login.output';
export interface IGoogleLoginUsecase {
  execute(dto: GoogleLoginInput): Promise<GoogleLoginOutput>;
}

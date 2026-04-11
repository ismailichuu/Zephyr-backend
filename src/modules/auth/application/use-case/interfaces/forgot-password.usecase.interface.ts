import { ForgotPasswordInput } from '../../types/forgot-password.input';
import { ForgotPasswordOutput } from '../../types/forgot-password.output';
export interface IForgotPasswordUsecase {
  execute(dto: ForgotPasswordInput): Promise<ForgotPasswordOutput>;
}

import { SignupOtpVerifyInput } from '../../types/signup-otp-verify.input';
import { SignupOtpVerifyOutput } from '../../types/signup-otp-verify.output';

export interface ISignupOtpVerifyUsecase {
  execute(dto: SignupOtpVerifyInput): Promise<SignupOtpVerifyOutput>;
}

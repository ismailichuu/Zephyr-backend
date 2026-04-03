import { ForgotOtpVerifyInput } from '../../types/forgot-otp-verify.input';
import { ForgotOtpVerifyOutput } from '../../types/forgot-otp-verify.output';
export interface IForgotOtpVerifyUsecase {
  execute(dto: ForgotOtpVerifyInput): Promise<ForgotOtpVerifyOutput>;
}

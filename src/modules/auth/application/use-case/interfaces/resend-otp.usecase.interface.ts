import { ResendOtpInput } from '../../types/resend-otp.input';
export interface IResendOtpUsecase {
  execute(dto: ResendOtpInput): Promise<void>;
}

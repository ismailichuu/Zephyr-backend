import { EmailService } from '../ports/email.service.port';
import { OtpService } from '../ports/otp.service.port';

export class ResendOtpUsecase {
  constructor(
    private readonly _otpService: OtpService,
    private readonly _emailService: EmailService,
  ) {}

  async execute(sessionId: string) {
    const { otp, email } = await this._otpService.resend(sessionId);

    await this._emailService.sendEmailSignup(email, otp);

    return {
      emailSent: true,
      readyToVerify: true,
    };
  }
}

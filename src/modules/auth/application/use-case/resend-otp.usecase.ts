import { Inject, Injectable } from '@nestjs/common';
import type { EmailService } from '../ports/email.service.port';
import type { OtpService } from '../ports/otp.service.port';
import { EMAIL_SERVICE, OTP_SERVICE } from '../ports/auth.token';

@Injectable()
export class ResendOtpUsecase {
  constructor(
    @Inject(OTP_SERVICE)
    private readonly _otpService: OtpService,
    @Inject(EMAIL_SERVICE)
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

import { Inject, Injectable } from '@nestjs/common';
import type { EmailService } from '../../ports/email.service.port';
import type { OtpService } from '../../ports/otp.service.port';
import { EMAIL_SERVICE, OTP_SERVICE } from '../../ports/auth.token';
import { ResendOtpInput } from '../../types/resend-otp.input';
import { IResendOtpUsecase } from '../interfaces/resend-otp.usecase.interface';

@Injectable()
export class ResendOtpUsecase implements IResendOtpUsecase {
  constructor(
    @Inject(OTP_SERVICE)
    private readonly _otpService: OtpService,
    @Inject(EMAIL_SERVICE)
    private readonly _emailService: EmailService,
  ) {}

  async execute(dto: ResendOtpInput): Promise<void> {
    const { otp, email } = await this._otpService.resend(dto.sessionId);

    await this._emailService.sendEmailSignup(email, otp);
  }
}

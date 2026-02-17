import { BadRequestException } from '@nestjs/common';
import type { OtpService } from '../ports/otp.service.port';
import type { EmailService } from '../ports/email.service.port';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';

export class ForgotPasswordUsecase {
  constructor(
    private readonly _otpService: OtpService,
    private readonly _authRepo: AuthUserRepository,
    private readonly _emailService: EmailService,
  ) {}

  async execute(email: string) {
    const user = await this._authRepo.findByEmail(email);
    if (!user) throw new BadRequestException('Email not regitered');

    const { otp, sessionId } = await this._otpService.generate(
      user.userId,
      user.email,
      'forgot',
    );
    await this._emailService.sendEmailForgot(user.email, otp);
    return {
      sessionId,
    };
  }
}

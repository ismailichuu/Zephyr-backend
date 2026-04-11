import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { OtpService } from '../../ports/otp.service.port';
import type { EmailService } from '../../ports/email.service.port';
import type { AuthUserRepository } from '../../ports/auth-user-repository.port';
import {
  AUTH_USER_REPOSITORY,
  EMAIL_SERVICE,
  OTP_SERVICE,
} from '../../ports/auth.token';
import { NOT_REGISTERED } from '../../constants/error-message.const';
import { ForgotPasswordInput } from '../../types/forgot-password.input';
import { ForgotPasswordOutput } from '../../types/forgot-password.output';
import { IForgotPasswordUsecase } from '../interfaces/forgot-password.usecase.interface';

@Injectable()
export class ForgotPasswordUsecase implements IForgotPasswordUsecase {
  constructor(
    @Inject(OTP_SERVICE)
    private readonly _otpService: OtpService,
    @Inject(AUTH_USER_REPOSITORY)
    private readonly _authRepo: AuthUserRepository,
    @Inject(EMAIL_SERVICE)
    private readonly _emailService: EmailService,
  ) {}

  async execute({ email }: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    const user = await this._authRepo.findByEmail(email);
    if (!user) throw new BadRequestException(NOT_REGISTERED);

    const { otp, sessionId } = await this._otpService.generate(
      user.userId,
      user.email,
      'forgot',
    );
    await this._emailService.sendEmailForgot(user.email, otp);
    return {
      otpSessionId: sessionId,
    };
  }
}

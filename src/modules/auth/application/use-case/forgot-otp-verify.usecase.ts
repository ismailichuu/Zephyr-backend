import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { OtpService } from '../ports/otp.service.port';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { TokenService } from '../ports/token.service.port';
import {
  AUTH_USER_REPOSITORY,
  OTP_SERVICE,
  TOKEN_SERVICE,
} from '../ports/auth.token';
import { NOT_FOUND } from '../constants/error-message.const';
import { ForgotOtpVerifyInput } from '../types/forgot-otp-verify.input';
import { ForgotOtpVerifyOutput } from '../types/forgot-otp-verify.output';
import { IForgotOtpVerifyUsecase } from './forgot-otp-verify.usecase.interface';

@Injectable()
export class ForgotOtpVerifyUsecase implements IForgotOtpVerifyUsecase {
  constructor(
    @Inject(OTP_SERVICE)
    private readonly _otpService: OtpService,
    @Inject(AUTH_USER_REPOSITORY)
    private readonly _authRepo: AuthUserRepository,
    @Inject(TOKEN_SERVICE)
    private readonly _tokeService: TokenService,
  ) {}

  async execute({
    otp,
    sessionId,
  }: ForgotOtpVerifyInput): Promise<ForgotOtpVerifyOutput> {
    const email = await this._otpService.verify(sessionId, otp, 'signup');

    const user = await this._authRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException(NOT_FOUND);

    const payload = { userId: user.userId, role: user.role };

    const resetPayload = { type: 'password-reset', ...payload };
    const resetToken = await this._tokeService.signResetToken(resetPayload);

    return {
      resetToken,
    };
  }
}

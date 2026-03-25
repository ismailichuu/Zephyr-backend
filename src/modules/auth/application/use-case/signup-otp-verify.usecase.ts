import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AUTH_USER_REPOSITORY,
  OTP_SERVICE,
  TOKEN_SERVICE,
} from '../ports/auth.token';
import type { OtpService } from '../ports/otp.service.port';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { TokenService } from '../ports/token.service.port';
import { NOT_FOUND } from '../constants/error-message.const';
import { SignupOtpVerifyInput } from '../types/signup-otp-verify.input';
import { SignupOtpVerifyOutput } from '../types/signup-otp-verify.output';
import { ISignupOtpVerifyUsecase } from './signup-otp-verify.usecase.interface';

@Injectable()
export class SignupOtpVerifyUsecase implements ISignupOtpVerifyUsecase {
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
  }: SignupOtpVerifyInput): Promise<SignupOtpVerifyOutput> {
    const email = await this._otpService.verify(sessionId, otp, 'signup');

    let user = await this._authRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException(NOT_FOUND);

    const payload = { userId: user.userId, role: user.role };

    user = await this._authRepo.update(user.userId, {
      isOtpVerified: true,
    });
    if (!user) throw new UnauthorizedException(NOT_FOUND);
    const refreshToken = await this._tokeService.signRefreshToken(payload);
    const accessToken = await this._tokeService.signAccessToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        role: user.role,
      },
    };
  }
}

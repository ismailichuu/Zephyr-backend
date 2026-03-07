import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { OtpService } from '../ports/otp.service.port';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { TokenService } from '../ports/token.service.port';
import {
  AUTH_USER_REPOSITORY,
  OTP_SERVICE,
  TOKEN_SERVICE,
} from '../ports/auth.token';
import { Response } from 'express';
import {
  OTP_VERIFICATION_FORGOT_SUCCESS,
  OTP_VERIFICATION_SUCCESS,
} from '../constants/success-message.const';
import { NOT_FOUND } from '../constants/error-message.const';

@Injectable()
export class OtpVerifyUsecase {
  constructor(
    @Inject(OTP_SERVICE)
    private readonly _otpService: OtpService,
    @Inject(AUTH_USER_REPOSITORY)
    private readonly _authRepo: AuthUserRepository,
    @Inject(TOKEN_SERVICE)
    private readonly _tokeService: TokenService,
  ) {}

  async execute(otp: string, sessionId: string, type: string, res: Response) {
    const email = await this._otpService.verify(sessionId, otp, 'signup');

    let user = await this._authRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException(NOT_FOUND);

    const payload = { userId: user.userId, role: user.role };

    if (type === 'signup') {
      user = await this._authRepo.update(user.userId, {
        isOtpVerified: true,
      });
      if (!user) throw new UnauthorizedException(NOT_FOUND);
      const refreshToken = await this._tokeService.signRefreshToken(payload);
      const accessToken = await this._tokeService.signAccessToken(payload);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      return {
        message: OTP_VERIFICATION_SUCCESS,
        user: {
          role: user.role,
        },
      };
    }

    const resetPayload = { type: 'password-reset', ...payload };
    const resetToken = await this._tokeService.signResetToken(resetPayload);

    res.cookie('resetToken', resetToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/change-password',
      maxAge: 10 * 60 * 10000,
    });

    return {
      message: OTP_VERIFICATION_FORGOT_SUCCESS,
      readyToChange: true,
    };
  }
}

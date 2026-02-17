import { UnauthorizedException } from '@nestjs/common';
import type { OtpService } from '../ports/otp.service.port';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { TokenService } from '../ports/token.service.port';

export class OtpVerifyUsecase {
  constructor(
    private readonly _otpService: OtpService,
    private readonly _authRepo: AuthUserRepository,
    private readonly _tokeService: TokenService,
  ) {}

  async execute(otp: string, sessionId: string, type: string) {
    const email = await this._otpService.verify(sessionId, otp, 'signup');

    let user = await this._authRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('user not found');

    const payload = { userId: user.userId, role: user.role };

    if (type === 'signup') {
      user = await this._authRepo.update(user.userId, { isVerified: true });
      if (!user) throw new UnauthorizedException('User Not found');
      const refreshToken = await this._tokeService.signRefreshToken(payload);
      const accessToken = await this._tokeService.signAccessToken(payload);

      return {
        type: 'SIGNUP_SUCCESS',
        user: {
          role: user.role,
        },
        refreshToken,
        accessToken,
      };
    }
    const resetPayload = { type: 'password-reset', ...payload };
    const resetToken = await this._tokeService.signResetToken(resetPayload);
    return {
      type: 'FORGOT_SUCCESS',
      readyToLogin: true,
      userId: user.userId,
      resetToken,
    };
  }
}

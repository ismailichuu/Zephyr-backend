import { UnauthorizedException } from '@nestjs/common';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { PasswordService } from '../ports/password.service.port';
import type { TokenService } from '../ports/token.service.port';
import {
  INVALID_CREDENTIALS,
  NOT_REGISTERED,
  NOT_VERIFIED,
} from '../constants/error-message.const';

export class LoginUseCase {
  constructor(
    private _authRepo: AuthUserRepository,
    private _passwordService: PasswordService,
    private _tokenService: TokenService,
  ) {}

  async execute(email: string, pass: string) {
    const user = await this._authRepo.findByEmail(email);

    if (user === null) throw new UnauthorizedException(NOT_REGISTERED);
    if (!user.isVerified) throw new UnauthorizedException(NOT_VERIFIED);
    if (user.provider === 'GOOGLE')
      throw new UnauthorizedException('User Google Login Instead');
    const isValid = await this._passwordService.compare(pass, user.password);
    if (!isValid) throw new UnauthorizedException(INVALID_CREDENTIALS);
    const payload = { userId: user.userId, role: user.role };
    const accessToken = await this._tokenService.signAccessToken(payload);
    const refreshToken = await this._tokenService.signRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
      user: {
        role: user.role,
      },
    };
  }
}

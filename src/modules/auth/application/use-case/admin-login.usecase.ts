import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { INVALID_CREDENTIALS } from '../constants/error-message.const';
import type { PasswordService } from '../ports/password.service.port';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { TokenService } from '../ports/token.service.port';
import {
  AUTH_USER_REPOSITORY,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../ports/auth.token';
import { LOGIN_SUCCESS } from '../constants/success-message.const';

@Injectable()
export class AdminLoginUsecase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly _userRepo: AuthUserRepository,
    @Inject(PASSWORD_SERVICE)
    private readonly _passwordService: PasswordService,
    @Inject(TOKEN_SERVICE)
    private readonly _tokenService: TokenService,
  ) {}

  async execute(email: string, password: string, res: Response) {
    const admin = await this._userRepo.findByEmail(email);
    if (!admin) throw new UnauthorizedException(INVALID_CREDENTIALS);
    const isValid = await this._passwordService.compare(
      password,
      admin.password,
    );
    if (!isValid) throw new UnauthorizedException(INVALID_CREDENTIALS);

    const payload = { userId: admin.userId, role: admin.role };
    const accessToken = await this._tokenService.signAccessToken(payload);
    const refreshToken = await this._tokenService.signRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
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
      message: LOGIN_SUCCESS,
      user: {
        role: admin.role,
      },
    };
  }
}

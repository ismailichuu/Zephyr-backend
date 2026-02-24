import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { NOT_FOUND, SESSION_EXPIRED } from '../constants/error-message.const';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { PasswordService } from '../ports/password.service.port';
import type { TokenService } from '../ports/token.service.port';
import {
  AUTH_USER_REPOSITORY,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../ports/auth.token';
import { Request, Response } from 'express';
import { PASSWORD_RESET_SUCCESS } from '../constants/success-message.const';

@Injectable()
export class ChangePasswordUsecase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly _userRepo: AuthUserRepository,
    @Inject(PASSWORD_SERVICE)
    private readonly _passwordService: PasswordService,
    @Inject(TOKEN_SERVICE)
    private readonly _tokenService: TokenService,
  ) {}

  async execute(req: Request, res: Response, password: string) {
    const token = req.cookies.resetToken as string | undefined;
    if (!token) throw new UnauthorizedException(SESSION_EXPIRED);

    const payload = await this._tokenService.verifyResetToken(token);
    if (!payload) throw new UnauthorizedException(SESSION_EXPIRED);
    const user = await this._userRepo.findById(payload.userId);

    if (!user) throw new UnauthorizedException(NOT_FOUND);

    const hashedPassword = await this._passwordService.hash(password);

    await this._userRepo.update(payload.userId, { password: hashedPassword });

    res.clearCookie('resetToken', {
      path: '/auth/change-password',
    });

    return {
      message: PASSWORD_RESET_SUCCESS,
      readyToLogin: true,
    };
  }
}

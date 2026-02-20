import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { NOT_FOUND, TOKEN_EXPIRED } from '../constants/error-message.const';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { PasswordService } from '../ports/password.service.port';
import type { TokenService } from '../ports/token.service.port';
import {
  AUTH_USER_REPOSITORY,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../ports/auth.token';

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

  async execute(password: string, token: string) {
    const payload = await this._tokenService.verifyResetToken(token);
    if (!payload) throw new UnauthorizedException(TOKEN_EXPIRED);
    const user = await this._userRepo.findById(payload.userId);

    if (!user) throw new UnauthorizedException(NOT_FOUND);

    const hashedPassword = await this._passwordService.hash(password);

    await this._userRepo.update(payload.userId, { password: hashedPassword });

    return {
      readyToLogin: true,
    };
  }
}

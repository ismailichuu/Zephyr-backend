import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { INVALID_CREDENTIALS } from '../../constants/error-message.const';
import type { PasswordService } from '../../ports/password.service.port';
import type { AuthUserRepository } from '../../ports/auth-user-repository.port';
import type { TokenService } from '../../ports/token.service.port';
import {
  AUTH_USER_REPOSITORY,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../../ports/auth.token';
import { LoginInput } from '../../types/login.input';
import { LoginOutput } from '../../types/login.output';
import { IAdminLoginUseCase } from '../interfaces/admin-login.usecase.interface';

@Injectable()
export class AdminLoginUsecase implements IAdminLoginUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly _userRepo: AuthUserRepository,
    @Inject(PASSWORD_SERVICE)
    private readonly _passwordService: PasswordService,
    @Inject(TOKEN_SERVICE)
    private readonly _tokenService: TokenService,
  ) {}

  async execute({ email, password }: LoginInput): Promise<LoginOutput> {
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

    return {
      accessToken,
      refreshToken,
      user: {
        role: admin.role,
      },
    };
  }
}

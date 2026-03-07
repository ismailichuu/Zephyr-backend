import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { PasswordService } from '../ports/password.service.port';
import type { TokenService } from '../ports/token.service.port';
import {
  GOOGLE_LOGIN_INSTEAD,
  INVALID_CREDENTIALS,
  NOT_VERIFIED,
  USER_BLOCKED,
} from '../constants/error-message.const';
import {
  AUTH_USER_REPOSITORY,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../ports/auth.token';
import { Response } from 'express';
import { LOGIN_SUCCESS } from '../constants/success-message.const';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';
import { UserRole } from 'src/modules/user/domain/enums/role.enum';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private _authRepo: AuthUserRepository,
    @Inject(PASSWORD_SERVICE)
    private _passwordService: PasswordService,
    @Inject(TOKEN_SERVICE)
    private _tokenService: TokenService,
  ) {}

  async execute(email: string, pass: string, res: Response) {
    const user = await this._authRepo.findByEmail(email);

    if (user === null) throw new UnauthorizedException(INVALID_CREDENTIALS);
    if (user.role === UserRole.ADMIN)
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    if (!user.isOtpVerified) throw new UnauthorizedException(NOT_VERIFIED);
    if (user.provider === 'GOOGLE')
      throw new UnauthorizedException(GOOGLE_LOGIN_INSTEAD);
    if (user.status === UserStatus.BLOCKED)
      throw new BadRequestException(USER_BLOCKED);
    const isValid = await this._passwordService.compare(pass, user.password);
    if (!isValid) throw new UnauthorizedException(INVALID_CREDENTIALS);
    const payload = { userId: user.userId, role: user.role };
    const accessToken = await this._tokenService.signAccessToken(payload);
    const refreshToken = await this._tokenService.signRefreshToken(payload);

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
      message: LOGIN_SUCCESS,
      user: {
        role: user.role,
      },
    };
  }
}

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
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';
import { UserRole } from 'src/modules/user/domain/enums/role.enum';
import { ILoginUsecase } from './login.usecase.interface';
import { LoginInput } from '../types/login.input';
import { LoginOutput } from '../types/login.output';

@Injectable()
export class LoginUseCase implements ILoginUsecase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private _authRepo: AuthUserRepository,
    @Inject(PASSWORD_SERVICE)
    private _passwordService: PasswordService,
    @Inject(TOKEN_SERVICE)
    private _tokenService: TokenService,
  ) {}

  async execute({ email, password }: LoginInput): Promise<LoginOutput> {
    const user = await this._authRepo.findByEmail(email);

    if (user === null) throw new UnauthorizedException(INVALID_CREDENTIALS);
    if (user.role === UserRole.ADMIN)
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    if (!user.isOtpVerified) throw new UnauthorizedException(NOT_VERIFIED);
    if (user.provider === 'GOOGLE')
      throw new UnauthorizedException(GOOGLE_LOGIN_INSTEAD);
    if (user.status === UserStatus.BLOCKED)
      throw new BadRequestException(USER_BLOCKED);
    const isValid = await this._passwordService.compare(
      password,
      user.password,
    );
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

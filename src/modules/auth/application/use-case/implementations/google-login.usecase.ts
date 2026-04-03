import type { AuthUserRepository } from '../../ports/auth-user-repository.port';
import type { GoogleAuthPort } from '../../ports/google-auth.port';
import type { IdGenerator } from '../../ports/id-generator.port';
import type { TokenService } from '../../ports/token.service.port';
import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_USER_REPOSITORY,
  GOOGLE_AUTH_GATEWAY,
  ID_GENERATOR,
  TOKEN_SERVICE,
} from '../../ports/auth.token';
import { UserRole } from 'src/modules/user/domain/enums/role.enum';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';
import { GoogleLoginInput } from '../../types/google-login.input';
import { GoogleLoginOutput } from '../../types/google-login.output';
import { IGoogleLoginUsecase } from './google-login.usecase.interface';

@Injectable()
export class GoogleLoginUseCase implements IGoogleLoginUsecase {
  constructor(
    @Inject(GOOGLE_AUTH_GATEWAY)
    private readonly _googleAuthService: GoogleAuthPort,
    @Inject(AUTH_USER_REPOSITORY)
    private readonly _userRepo: AuthUserRepository,
    @Inject(ID_GENERATOR)
    private readonly _idGenerator: IdGenerator,
    @Inject(TOKEN_SERVICE)
    private readonly _tokenService: TokenService,
  ) {}

  async execute({ code, role }: GoogleLoginInput): Promise<GoogleLoginOutput> {
    const allowedRoles = [UserRole.CLIENT, UserRole.FREELANCER];

    if (!allowedRoles.includes(role)) {
      throw new Error('Invalid role');
    }

    const googleUser = await this._googleAuthService.getUserFromCode(code);

    let user = await this._userRepo.findByEmail(googleUser.email);

    if (!user) {
      const id = this._idGenerator.generateForRole(role);

      user = User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: '',
        role,
        userId: id,
        isPremium: false,
        isOtpVerified: true,
        subscriptionId: null,
        status: UserStatus.ACTIVE,
        provider: 'GOOGLE',
        joinedAt: null,
        isAdminApproved: role === UserRole.FREELANCER ? true : false,
      });

      await this._userRepo.create(user);
    } else {
      if (user.role !== role) {
        return {
          url: `${process.env.CLIENT_URL}/signin?authErrorCode=ROLE_MISMATCH`,
          isError: true,
        };
      }
    }

    const payload = {
      userId: user.userId,
      role: user.role,
    };

    const accessToken = await this._tokenService.signAccessToken(payload);

    const refreshToken = await this._tokenService.signRefreshToken(payload);

    return {
      url: `${process.env.CLIENT_URL + user?.role.toLowerCase()}`,
      isError: false,
      accessToken,
      refreshToken,
    };
  }
}

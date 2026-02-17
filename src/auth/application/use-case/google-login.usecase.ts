import { UserRole } from 'src/user/domain/enums/role.enum';
import { User } from 'src/user/domain/entities/user.entity';
import { AuthUserRepository } from '../ports/auth-user-repository.port';
import { GoogleAuthPort } from '../ports/google-auth.port';
import { IdGenerator } from '../ports/id-generator.port';
import { TokenService } from '../ports/token.service.port';
import { UserStatus } from 'src/user/domain/enums/userStatus.enum';
import { Response } from 'express';

export class GoogleLoginUseCase {
  constructor(
    private readonly _googleAuthService: GoogleAuthPort,
    private readonly _userRepo: AuthUserRepository,
    private readonly _idGenerator: IdGenerator,
    private readonly _tokenService: TokenService,
  ) {}

  async execute(code: string, role: UserRole, res: Response) {
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
        isVerified: true,
        subscriptionId: null,
        status: UserStatus.ACTIVE,
        provider: 'GOOGLE',
      });

      await this._userRepo.create(user);
    } else {
      if (user.role !== role) {
        return res.redirect(
          `${process.env.CLIENT_URL}/signin?authErrorCode=ROLE_MISMATCH`,
        );
      }
    }

    const payload = {
      userId: user.userId,
      role: user.role,
    };

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

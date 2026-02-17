import { UnauthorizedException } from '@nestjs/common';
import type { TokenService } from '../ports/token.service.port';

export class refreshTokenUseCase {
  constructor(private readonly _tokenService: TokenService) {}

  async execute(oldToken: string) {
    const payload = await this._tokenService.verifyRefreshToken(oldToken);

    if (!payload) throw new UnauthorizedException('Token Expired');

    const refreshToken = await this._tokenService.signRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });
    const accessToken = await this._tokenService.signAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    return {
      refreshToken,
      accessToken,
    };
  }
}

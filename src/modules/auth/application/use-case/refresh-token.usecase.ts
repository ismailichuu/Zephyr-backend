import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { TokenService } from '../ports/token.service.port';
import { TOKEN_SERVICE } from '../ports/auth.token';
import { TOKEN_EXPIRED } from '../constants/error-message.const';
import { RefreshTokenInput } from '../types/refresh-token.input';
import { RefreshTokenOutput } from '../types/refresh-token.output';
import { IRefreshTokenUsecase } from './refresh-token.usecase.interface';

@Injectable()
export class RefreshTokenUseCase implements IRefreshTokenUsecase {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly _tokenService: TokenService,
  ) {}

  async execute({
    oldRefreshToken,
  }: RefreshTokenInput): Promise<RefreshTokenOutput> {
    if (!oldRefreshToken) throw new BadRequestException(TOKEN_EXPIRED);

    const payload =
      await this._tokenService.verifyRefreshToken(oldRefreshToken);

    if (!payload) throw new UnauthorizedException(TOKEN_EXPIRED);

    const refreshToken = await this._tokenService.signRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });
    const accessToken = await this._tokenService.signAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

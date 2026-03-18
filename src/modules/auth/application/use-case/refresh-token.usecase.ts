import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { TokenService } from '../ports/token.service.port';
import { TOKEN_SERVICE } from '../ports/auth.token';
import { Request, Response } from 'express';
import { REFRESH_SUCCESS } from '../constants/success-message.const';
import { TOKEN_EXPIRED } from '../constants/error-message.const';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly _tokenService: TokenService,
  ) {}

  async execute(req: Request, res: Response) {
    const oldRefreshToken = req?.cookies?.refreshToken as string | undefined;
    console.log('refresh:', oldRefreshToken);

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
      message: REFRESH_SUCCESS,
    };
  }
}

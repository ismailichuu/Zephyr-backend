import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'google-auth-library';
import { StringValue } from 'ms';
import { TokenService } from 'src/modules/auth/application/ports/token.service.port';
import { ResetTokenPayload } from 'src/modules/auth/application/types/tokenPayload.type';
import { TokenVerifier } from 'src/modules/freelancer/application/ports/token-verifier.port';

export type JwtPayload = TokenPayload & {};

export class JwtTokenService implements TokenService, TokenVerifier {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: {
      accessSecret: string;
      refreshSecret: string;
      resetSecret: string;
      accessExpiry: StringValue | number;
      refreshExpiry: StringValue | number;
      resetExpiry: StringValue | number;
    },
  ) {}
  async signResetToken(payload: object): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.resetSecret,
      expiresIn: this.config.resetExpiry,
    });
  }
  async verifyResetToken(token: string): Promise<ResetTokenPayload> {
    return this.jwt.verifyAsync<ResetTokenPayload>(token, {
      secret: this.config.resetSecret,
    });
  }

  async signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.accessSecret,
      expiresIn: this.config.accessExpiry,
    });
  }

  async verifyAccessToken<jwtPayload extends object>(
    token: string,
  ): Promise<jwtPayload> {
    return this.jwt.verifyAsync<jwtPayload>(token, {
      secret: this.config.accessSecret,
    });
  }

  async signRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.refreshSecret,
      expiresIn: this.config.refreshExpiry,
    });
  }

  async verifyRefreshToken<jwtPayload extends object>(
    token: string,
  ): Promise<jwtPayload> {
    return this.jwt.verifyAsync<jwtPayload>(token, {
      secret: this.config.refreshSecret,
    });
  }
}

import { ResetTokenPayload, TokenPayload } from '../types/tokenPayload.type';

export interface TokenService {
  signAccessToken(payload: object): Promise<string>;
  signRefreshToken(payload: object): Promise<string>;
  signResetToken(payload: object): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  verifyRefreshToken(token: string): Promise<TokenPayload>;
  verifyResetToken(token: string): Promise<ResetTokenPayload>;
}

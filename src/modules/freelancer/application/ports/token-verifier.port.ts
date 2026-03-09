export interface TokenVerifier {
  verifyAccessToken(token: string): Promise<{ userId: string; role: string }>;
}

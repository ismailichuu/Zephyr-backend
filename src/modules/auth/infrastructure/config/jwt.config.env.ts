import type { StringValue } from 'ms';

export type JwtConfig = {
  accessSecret: string;
  refreshSecret: string;
  resetSecret: string;
  resetExpiry: StringValue | number;
  accessExpiry: StringValue | number;
  refreshExpiry: StringValue | number;
};

export function loadJwtConfig(): JwtConfig {
  const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    RESET_TOKEN_SECRET,
    RESET_TOKEN_EXPIRY,
  } = process.env;

  if (
    !ACCESS_TOKEN_EXPIRY ||
    !REFRESH_TOKEN_EXPIRY ||
    !ACCESS_TOKEN_SECRET ||
    !REFRESH_TOKEN_SECRET ||
    !RESET_TOKEN_SECRET ||
    !RESET_TOKEN_EXPIRY
  ) {
    throw new Error('JWT .env files are missing');
  }

  return {
    accessExpiry: ACCESS_TOKEN_EXPIRY as StringValue,
    refreshExpiry: REFRESH_TOKEN_EXPIRY as StringValue,
    resetExpiry: RESET_TOKEN_EXPIRY as StringValue,
    accessSecret: ACCESS_TOKEN_SECRET,
    refreshSecret: REFRESH_TOKEN_SECRET,
    resetSecret: RESET_TOKEN_SECRET,
  };
}

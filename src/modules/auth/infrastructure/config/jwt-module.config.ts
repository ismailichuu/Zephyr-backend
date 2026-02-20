import { JwtModuleOptions } from '@nestjs/jwt';
import { loadJwtConfig } from './jwt.config.env';

export function loadJwtModuleOptions(): JwtModuleOptions {
  const jwt = loadJwtConfig();

  return {
    secret: jwt.accessSecret,
    signOptions: {
      expiresIn: jwt.accessExpiry,
    },
  };
}

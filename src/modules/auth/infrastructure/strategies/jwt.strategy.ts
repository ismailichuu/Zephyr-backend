import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

type jwtPayload = {
  userId: string;
  role: string;
};

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    const token = req.cookies['accessToken'] as string | undefined;
    return typeof token === 'string' ? token : null;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
    });
  }

  validate(payload: jwtPayload) {
    return { userId: payload.userId, role: payload.role };
  }
}

import { randomInt, randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { redis } from './redis.client';
import { UnauthorizedException } from '@nestjs/common';
import { OtpService } from 'src/modules/auth/application/ports/otp.service.port';
import {
  INVALID_OTP_ATTEMPT,
  INVALID_SESSION,
  OTP_SESSION_EXPIRED,
  TOO_MANY_ATTEMPTS,
  WAIT_BEFORE_RESEND,
} from 'src/modules/auth/application/constants/error-message.const';

type OtpType = 'signup' | 'forgot';

interface OtpSession {
  userId: string;
  email: string;
  type: OtpType;
  resendCount: number;
}

interface OtpData {
  hash: string;
  attempts: number;
}

export class RedisOtpService implements OtpService {
  private readonly OTP_TTL = 300;
  private readonly SESSION_TTL = 900;
  private readonly COOLDOWN_TTL = 60;
  private readonly MAX_ATTEMPTS = 5;
  private readonly MAX_RESENDS = 5;

  private sessionKey(sessionId: string): string {
    return `otp:session:${sessionId}`;
  }

  private dataKey(sessionId: string): string {
    return `otp:data:${sessionId}`;
  }

  private cooldownKey(userId: string): string {
    return `otp:cooldown:${userId}`;
  }

  private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  private parseJSON<T>(value: string | null): T {
    if (!value) {
      throw new UnauthorizedException(OTP_SESSION_EXPIRED);
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      throw new UnauthorizedException(INVALID_SESSION);
    }
  }

  async generate(
    userId: string,
    email: string,
    type: OtpType,
  ): Promise<{ sessionId: string; otp: string }> {
    const sessionId = randomUUID();
    const otp = this.generateOtp();
    const hash = await bcrypt.hash(otp, 10);

    const session: OtpSession = {
      userId,
      email,
      type,
      resendCount: 0,
    };

    const data: OtpData = {
      hash,
      attempts: 0,
    };

    await redis.set(
      this.sessionKey(sessionId),
      JSON.stringify(session),
      'EX',
      this.SESSION_TTL,
    );

    await redis.set(
      this.dataKey(sessionId),
      JSON.stringify(data),
      'EX',
      this.OTP_TTL,
    );

    return { sessionId, otp };
  }

  async verify(sessionId: string, otp: string): Promise<string> {
    const sessionRaw = await redis.get(this.sessionKey(sessionId));
    const dataRaw = await redis.get(this.dataKey(sessionId));

    const session = this.parseJSON<OtpSession>(sessionRaw);

    if (!dataRaw) {
      throw new UnauthorizedException(OTP_SESSION_EXPIRED);
    }

    const data = this.parseJSON<OtpData>(dataRaw);

    if (data.attempts >= this.MAX_ATTEMPTS) {
      await redis.del(this.dataKey(sessionId));
      throw new UnauthorizedException('Too many attempts');
    }

    const isValid = await bcrypt.compare(otp, data.hash);

    if (!isValid) {
      const ttl = await redis.ttl(this.dataKey(sessionId));

      const updatedData: OtpData = {
        hash: data.hash,
        attempts: data.attempts + 1,
      };

      await redis.set(
        this.dataKey(sessionId),
        JSON.stringify(updatedData),
        'EX',
        ttl > 0 ? ttl : this.OTP_TTL,
      );

      throw new UnauthorizedException(INVALID_OTP_ATTEMPT);
    }

    await redis.del(this.dataKey(sessionId));
    await redis.del(this.sessionKey(sessionId));

    return session.email;
  }

  async resend(sessionId: string): Promise<{ otp: string; email: string }> {
    const sessionRaw = await redis.get(this.sessionKey(sessionId));
    const session = this.parseJSON<OtpSession>(sessionRaw);

    if (session.resendCount >= this.MAX_RESENDS) {
      throw new UnauthorizedException(TOO_MANY_ATTEMPTS);
    }

    if (await redis.get(this.cooldownKey(session.userId))) {
      throw new UnauthorizedException(WAIT_BEFORE_RESEND);
    }

    await redis.set(
      this.cooldownKey(session.userId),
      '1',
      'EX',
      this.COOLDOWN_TTL,
    );

    const otp = this.generateOtp();
    const hash = await bcrypt.hash(otp, 10);

    const data: OtpData = {
      hash,
      attempts: 0,
    };

    const updatedSession: OtpSession = {
      ...session,
      resendCount: session.resendCount + 1,
    };

    await redis.set(
      this.dataKey(sessionId),
      JSON.stringify(data),
      'EX',
      this.OTP_TTL,
    );

    await redis.set(
      this.sessionKey(sessionId),
      JSON.stringify(updatedSession),
      'EX',
      this.SESSION_TTL,
    );

    return { otp, email: session.email };
  }
}

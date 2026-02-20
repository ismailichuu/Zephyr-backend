export type otpType = 'signup' | 'forgot';

export interface OtpService {
  generate(
    userId: string,
    email: string,
    type: otpType,
  ): Promise<{ sessionId: string; otp: string }>;
  verify(sessionId: string, otp: string, type: otpType): Promise<string>;
  resend(sessionId: string): Promise<{ otp: string; email: string }>;
}

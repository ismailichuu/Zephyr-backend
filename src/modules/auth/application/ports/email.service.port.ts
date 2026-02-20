export interface EmailService {
  sendEmailSignup(email: string, otp: string): Promise<void>;
  sendEmailForgot(email: string, otp: string): Promise<void>;
}

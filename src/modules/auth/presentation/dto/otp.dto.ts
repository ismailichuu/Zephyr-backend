import { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator';

enum otpType {
  'signup' = 'signup',
  'forgot' = 'forgot',
}

export class VerifyOtpDto {
  @IsString()
  @Length(6)
  otp: string;

  @IsString()
  otpSessionId: string;

  @IsEnum(otpType)
  type: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(7)
  password: string;
}

export class ResendOtpDto {
  @IsString()
  sessionId: string;
}

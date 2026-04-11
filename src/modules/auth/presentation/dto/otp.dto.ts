import { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator';
import { User } from 'src/modules/user/domain/entities/user.entity';

enum otpType {
  'signup' = 'signup',
  'forgot' = 'forgot',
}

export class VerifyOtpRequestDto {
  @IsString()
  @Length(6)
  otp!: string;

  @IsString()
  otpSessionId!: string;

  @IsEnum(otpType)
  type!: string;
}

export class VerifyOtpResponseDto {
  user?: Partial<User>;
  readyToVerify?: boolean;
}

export class ForgotPasswordRequestDto {
  @IsEmail()
  email!: string;
}

export class ForgotPasswordResponseDto {
  otpSessionId!: string;
}

export class ChangePasswordRequestDto {
  @IsString()
  @MinLength(7)
  password!: string;
}

export class ChangePasswordResponseDto {
  readToLogin!: boolean;
}

export class ResendOtpRequestDto {
  @IsString()
  sessionId!: string;
}

export class ResendOtpResponseDto {
  emailSent!: boolean;
}

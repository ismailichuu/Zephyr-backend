import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum Role {
  FREELANCER = 'FREELANCER',
  CLIENT = 'CLIENT',
}

export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(7)
  password: string;

  @IsEnum(Role)
  role: Role;
}

export class GoogleSignupDto {
  @IsString()
  idToken: string;

  @IsEnum(Role)
  role: Role;
}

import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { authProviders } from './infrastructure/di/auth.providers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { loadJwtModuleOptions } from './infrastructure/config/jwt-module.config';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ForgotOtpVerifyUsecase } from './application/use-case/implementations/forgot-otp-verify.usecase';
import {
  ADMIN_LOGIN_USECASE,
  CHANGE_PASSWORD_USECASE,
  FORGOT_OTP_VERIFY_USECASE,
  FORGOT_PASSWORD_USECASE,
  GOOGLE_LOGIN_USECASE,
  LOGIN_USECASE,
  REFRESH_TOKEN_USECASE,
  RESEND_OTP_USECASE,
  SIGNUP_OTP_VERIFY_USECASE,
  SIGNUP_USECASE,
} from './application/use-case/tokens.usecase';
import { SignupOtpVerifyUsecase } from './application/use-case/implementations/signup-otp-verify.usecase';
import { LoginUseCase } from './application/use-case/implementations/login.usecase';
import { SignupUseCase } from './application/use-case/implementations/signup.usecase';
import { RefreshTokenUseCase } from './application/use-case/implementations/refresh-token.usecase';
import { GoogleLoginUseCase } from './application/use-case/implementations/google-login.usecase';
import { ForgotPasswordUsecase } from './application/use-case/implementations/forgot-password.usecase';
import { ResendOtpUsecase } from './application/use-case/implementations/resend-otp.usecase';
import { AdminLoginUsecase } from './application/use-case/implementations/admin-login.usecase';
import { ChangePasswordUsecase } from './application/use-case/implementations/change-password.usecase';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: loadJwtModuleOptions,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    { provide: LOGIN_USECASE, useClass: LoginUseCase },
    { provide: SIGNUP_USECASE, useClass: SignupUseCase },
    { provide: REFRESH_TOKEN_USECASE, useClass: RefreshTokenUseCase },
    { provide: FORGOT_OTP_VERIFY_USECASE, useClass: ForgotOtpVerifyUsecase },
    { provide: SIGNUP_OTP_VERIFY_USECASE, useClass: SignupOtpVerifyUsecase },
    { provide: GOOGLE_LOGIN_USECASE, useClass: GoogleLoginUseCase },
    { provide: FORGOT_PASSWORD_USECASE, useClass: ForgotPasswordUsecase },
    { provide: CHANGE_PASSWORD_USECASE, useClass: ChangePasswordUsecase },
    { provide: RESEND_OTP_USECASE, useClass: ResendOtpUsecase },
    { provide: ADMIN_LOGIN_USECASE, useClass: AdminLoginUsecase },
    ...authProviders,
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}

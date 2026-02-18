import {
  AUTH_USER_REPOSITORY,
  EMAIL_SERVICE,
  GOOGLE_AUTH_GATEWAY,
  ID_GENERATOR,
  OTP_SERVICE,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from 'src/auth/application/ports/auth.token';
import { UserRepositoryAuthAdapter } from 'src/user/infrastructure/adapters/user-repository-auth.adapter';
import { BcryptPasswordService } from '../services/security/bcrypt-password.service';
import { RedisOtpService } from '../presistence/redis/redis-otp.service';
import { CryptoIdGenerator } from 'src/user/infrastructure/utils/id-generator.utility';
import { GoogleAuthService } from '../services/google-auth.service';
import { loadEmailConfig } from '../config/email.config.env';
import { NodemailerEmailService } from '../services/verification/nodemailer-email.service';
import { JwtService } from '@nestjs/jwt';
import { loadJwtConfig } from '../config/jwt.config.env';
import { JwtTokenService } from '../services/security/jwt-token.service';
import { LoginUseCase } from 'src/auth/application/use-case/login.usecase';
import { ChangePasswordUsecase } from 'src/auth/application/use-case/change-password.usecase';
import { ForgotPasswordUsecase } from 'src/auth/application/use-case/forgot-password.usecase';
import { GoogleLoginUseCase } from 'src/auth/application/use-case/google-login.usecase';
import { OtpVerifyUsecase } from 'src/auth/application/use-case/otp-verify.usecase';
import { ResendOtpUsecase } from 'src/auth/application/use-case/resend-otp.usecase';
import { SignupUseCase } from 'src/auth/application/use-case/signup.usecase';
import { RefreshTokenUseCase } from 'src/auth/application/use-case/refresh-token.usecase';

export const authProviders = [
  {
    provide: AUTH_USER_REPOSITORY,
    useClass: UserRepositoryAuthAdapter,
  },
  {
    provide: PASSWORD_SERVICE,
    useClass: BcryptPasswordService,
  },
  {
    provide: OTP_SERVICE,
    useClass: RedisOtpService,
  },
  {
    provide: ID_GENERATOR,
    useClass: CryptoIdGenerator,
  },
  {
    provide: GOOGLE_AUTH_GATEWAY,
    useClass: GoogleAuthService,
  },
  {
    provide: EMAIL_SERVICE,
    useFactory: () => {
      const config = loadEmailConfig();
      return new NodemailerEmailService(config);
    },
  },
  {
    provide: TOKEN_SERVICE,
    useFactory: (jwt: JwtService) => {
      const config = loadJwtConfig();
      return new JwtTokenService(jwt, config);
    },
    inject: [JwtService],
  },
  //usecases
  ChangePasswordUsecase,
  ForgotPasswordUsecase,
  GoogleLoginUseCase,
  LoginUseCase,
  OtpVerifyUsecase,
  RefreshTokenUseCase,
  ResendOtpUsecase,
  SignupUseCase,
];

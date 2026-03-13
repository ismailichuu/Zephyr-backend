import { BcryptPasswordService } from '../services/security/bcrypt-password.service';
import { RedisOtpService } from '../presistence/redis/redis-otp.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { loadEmailConfig } from '../config/email.config.env';
import { NodemailerEmailService } from '../services/verification/nodemailer-email.service';
import { JwtService } from '@nestjs/jwt';
import { loadJwtConfig } from '../config/jwt.config.env';
import { JwtTokenService } from '../services/security/jwt-token.service';
import {
  AUTH_USER_REPOSITORY,
  EMAIL_SERVICE,
  GOOGLE_AUTH_GATEWAY,
  ID_GENERATOR,
  OTP_SERVICE,
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../../application/ports/auth.token';
import { UserRepositoryAuthAdapter } from 'src/modules/user/infrastructure/adapters/user-repository-auth.adapter';
import { CryptoIdGenerator } from 'src/modules/user/infrastructure/utils/id-generator.utility';
import { ChangePasswordUsecase } from '../../application/use-case/change-password.usecase';
import { ForgotPasswordUsecase } from '../../application/use-case/forgot-password.usecase';
import { GoogleLoginUseCase } from '../../application/use-case/google-login.usecase';
import { LoginUseCase } from '../../application/use-case/login.usecase';
import { OtpVerifyUsecase } from '../../application/use-case/otp-verify.usecase';
import { RefreshTokenUseCase } from '../../application/use-case/refresh-token.usecase';
import { ResendOtpUsecase } from '../../application/use-case/resend-otp.usecase';
import { SignupUseCase } from '../../application/use-case/signup.usecase';
import { LogoutUseCase } from '../../application/use-case/logout.usecase';
import { AdminLoginUsecase } from '../../application/use-case/admin-login.usecase';
import { JwtStrategy } from '../strategies/jwt.strategy';

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

  // create JwtTokenService properly
  {
    provide: TOKEN_SERVICE,
    useFactory: (jwt: JwtService) => {
      const config = loadJwtConfig();
      return new JwtTokenService(jwt, config);
    },
    inject: [JwtService],
  },
  {
    provide: EMAIL_SERVICE,
    useFactory: () => {
      const config = loadEmailConfig();
      return new NodemailerEmailService(config);
    },
  },

  JwtStrategy,

  ChangePasswordUsecase,
  ForgotPasswordUsecase,
  GoogleLoginUseCase,
  LoginUseCase,
  OtpVerifyUsecase,
  RefreshTokenUseCase,
  ResendOtpUsecase,
  SignupUseCase,
  LogoutUseCase,
  AdminLoginUsecase,
];

import { LoginUseCase } from 'src/auth/application/use-case/login.usecase';
import { BcryptPasswordService } from '../services/security/bcrypt-password.service';
import { JwtTokenService } from '../services/security/jwt-token.service';
import { JwtService } from '@nestjs/jwt';
import { SignupUseCase } from 'src/auth/application/use-case/signup.usecase';
import { loadJwtConfig } from '../config/jwt.config.env';
import { refreshTokenUseCase } from 'src/auth/application/use-case/refreshToken.usecase';
import { RedisOtpService } from '../presistence/redis/redis-otp.service';
import { NodemailerEmailService } from '../services/verification/nodemailer-email.service';
import { loadEmailConfig } from '../config/email.config.env';
import {
  EMAIL_SERVICE,
  PASSWORD_SERVICE,
  OTP_SERVICE,
  TOKEN_SERVICE,
  AUTH_USER_REPOSITORY,
  GOOGLE_AUTH_GATEWAY,
  ID_GENERATOR,
} from 'src/auth/application/ports/auth.token';
import { AuthUserRepository } from 'src/auth/application/ports/auth-user-repository.port';
import { PasswordService } from 'src/auth/application/ports/password.service.port';
import { TokenService } from 'src/auth/application/ports/token.service.port';
import { OtpService } from 'src/auth/application/ports/otp.service.port';
import { EmailService } from 'src/auth/application/ports/email.service.port';
import { UserRepositoryAuthAdapter } from 'src/user/infrastructure/adapters/user-repository-auth.adapter';
import { IdGenerator } from 'src/auth/application/ports/id-generator.port';
import { CryptoIdGenerator } from 'src/user/infrastructure/utils/id-generator.utility';
import { ChangePasswordUsecase } from 'src/auth/application/use-case/change-password.usecase';
import { OtpVerifyUsecase } from 'src/auth/application/use-case/otp-verify.usecase';
import { ForgotPasswordUsecase } from 'src/auth/application/use-case/forgot-password.usecase';
import { ResendOtpUsecase } from 'src/auth/application/use-case/resend-otp.usecase';
import { GoogleAuthService } from '../services/google-auth.service';
import { GoogleLoginUseCase } from 'src/auth/application/use-case/google-login.usecase';
import { GoogleAuthPort } from 'src/auth/application/ports/google-auth.port';

export const authProviders = [
  //googleGateway
  {
    provide: GOOGLE_AUTH_GATEWAY,
    useClass: GoogleAuthService,
  },
  //id-generator
  {
    provide: ID_GENERATOR,
    useClass: CryptoIdGenerator,
  },
  //otp-servie
  {
    provide: OTP_SERVICE,
    useClass: RedisOtpService,
  },
  //googleAuth
  {
    provide: GOOGLE_AUTH_GATEWAY,
    useClass: GoogleAuthService,
  },

  //email-service
  {
    provide: EMAIL_SERVICE,
    useFactory: () => {
      const emailConfig = loadEmailConfig();
      return new NodemailerEmailService(emailConfig);
    },
  },

  //passowrd hashing
  {
    provide: PASSWORD_SERVICE,
    useClass: BcryptPasswordService,
  },

  //AuthUserDatabase
  {
    provide: AUTH_USER_REPOSITORY,
    useClass: UserRepositoryAuthAdapter,
  },
  //token Service(out adapter)
  {
    provide: TOKEN_SERVICE,
    useFactory: (JwtService: JwtService) => {
      const jwtConfig = loadJwtConfig();
      return new JwtTokenService(JwtService, jwtConfig);
    },

    inject: [JwtService],
  },

  //usecases di

  {
    provide: ChangePasswordUsecase,
    useFactory: (
      repo: AuthUserRepository,
      passowrdService: PasswordService,
      tokenService: TokenService,
    ) => {
      return new ChangePasswordUsecase(repo, passowrdService, tokenService);
    },
    inject: [AUTH_USER_REPOSITORY, PASSWORD_SERVICE, TOKEN_SERVICE],
  },
  {
    provide: LoginUseCase,
    useFactory: (
      repo: AuthUserRepository,
      hash: PasswordService,
      token: TokenService,
    ) => {
      return new LoginUseCase(repo, hash, token);
    },
    inject: [AUTH_USER_REPOSITORY, PASSWORD_SERVICE, TOKEN_SERVICE],
  },
  {
    provide: SignupUseCase,
    useFactory: (
      repo: AuthUserRepository,
      hash: PasswordService,
      otp: OtpService,
      email: EmailService,
      idGenerator: IdGenerator,
    ) => {
      return new SignupUseCase(repo, hash, otp, email, idGenerator);
    },
    inject: [
      AUTH_USER_REPOSITORY,
      PASSWORD_SERVICE,
      OTP_SERVICE,
      EMAIL_SERVICE,
      ID_GENERATOR,
    ],
  },
  {
    provide: refreshTokenUseCase,
    useFactory: (token: TokenService) => {
      return new refreshTokenUseCase(token);
    },
    inject: [TOKEN_SERVICE],
  },
  {
    provide: OtpVerifyUsecase,
    useFactory: (
      otp: OtpService,
      repo: AuthUserRepository,
      token: TokenService,
    ) => {
      return new OtpVerifyUsecase(otp, repo, token);
    },
    inject: [OTP_SERVICE, AUTH_USER_REPOSITORY, TOKEN_SERVICE],
  },
  {
    provide: GoogleLoginUseCase,
    useFactory: (
      googleAuth: GoogleAuthPort,
      authRepo: AuthUserRepository,
      idGenerator: IdGenerator,
      token: TokenService,
    ) => {
      return new GoogleLoginUseCase(googleAuth, authRepo, idGenerator, token);
    },
    inject: [
      GOOGLE_AUTH_GATEWAY,
      AUTH_USER_REPOSITORY,
      ID_GENERATOR,
      TOKEN_SERVICE,
    ],
  },
  {
    provide: ForgotPasswordUsecase,
    useFactory: (
      otpRepo: OtpService,
      authRepo: AuthUserRepository,
      emailService: EmailService,
    ) => {
      return new ForgotPasswordUsecase(otpRepo, authRepo, emailService);
    },
    inject: [OTP_SERVICE, AUTH_USER_REPOSITORY, EMAIL_SERVICE],
  },
  {
    provide: ResendOtpUsecase,
    useFactory: (otpService: OtpService, emailService: EmailService) => {
      return new ResendOtpUsecase(otpService, emailService);
    },
    inject: [OTP_SERVICE, EMAIL_SERVICE],
  },
];

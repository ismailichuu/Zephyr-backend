import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { authProviders } from './infrastructure/di/auth.providers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { loadJwtModuleOptions } from './infrastructure/config/jwt-module.config';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { TOKEN_VERIFIER } from '../freelancer/application/ports/freelancer.token';

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
  providers: [...authProviders],
  exports: [JwtModule, PassportModule, TOKEN_VERIFIER],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { authProviders } from './infrastructure/di/auth.providers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { loadJwtModuleOptions } from './infrastructure/config/jwt-module.config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: loadJwtModuleOptions,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [...authProviders],
})
export class AuthModule {}

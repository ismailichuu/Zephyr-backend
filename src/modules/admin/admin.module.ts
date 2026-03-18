import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { adminProviders } from './infrastructure/di/admin-providers';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AdminController],
  providers: [...adminProviders],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { adminProviders } from './infrastructure/di/admin-providers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [...adminProviders],
})
export class AdminModule {}

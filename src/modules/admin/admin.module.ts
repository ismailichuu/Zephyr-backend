import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { adminProviders } from './infrastructure/di/admin-providers';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import {
  ADMIN_ACTION_USECASE,
  GET_ALL_USERS_USECASE,
  GET_USER_DETAILS_USECASE,
} from './application/use-case/token.usecase';
import { GetAllUsersUsecase } from './application/use-case/implementation/get-all-users.usecase';
import { GetUserDetailsUsecase } from './application/use-case/implementation/get-user-details.usecase';
import { AdminActionUsecase } from './application/use-case/implementation/admin-action.usecase';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AdminController],
  providers: [
    { provide: GET_ALL_USERS_USECASE, useClass: GetAllUsersUsecase },
    { provide: GET_USER_DETAILS_USECASE, useClass: GetUserDetailsUsecase },
    { provide: ADMIN_ACTION_USECASE, useClass: AdminActionUsecase },
    ...adminProviders,
  ],
})
export class AdminModule {}

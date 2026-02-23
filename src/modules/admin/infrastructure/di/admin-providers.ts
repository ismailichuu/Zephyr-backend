import { UserRepositoryAdminAdapter } from 'src/modules/user/infrastructure/adapters/user-repository-admin.adapter';
import { ADMIN_USER_REPOSITORY } from '../../application/ports/admin.token';
import { GetAllUsersUsecase } from '../../application/use-case/get-all-users.usecase';
import { AdminActionUsecase } from '../../application/use-case/admin-action.usecase';
import { GetUserDetailsUsecase } from '../../application/use-case/get-user-details.usecase';

export const adminProviders = [
  {
    provide: ADMIN_USER_REPOSITORY,
    useClass: UserRepositoryAdminAdapter,
  },
  //usecases
  GetAllUsersUsecase,
  AdminActionUsecase,
  GetUserDetailsUsecase,
];

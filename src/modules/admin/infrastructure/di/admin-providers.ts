import { UserRepositoryAdminAdapter } from 'src/modules/user/infrastructure/adapters/user-repository-admin.adapter';
import { ADMIN_USER_REPOSITORY } from '../../application/ports/admin.token';

export const adminProviders = [
  {
    provide: ADMIN_USER_REPOSITORY,
    useClass: UserRepositoryAdminAdapter,
  },
];

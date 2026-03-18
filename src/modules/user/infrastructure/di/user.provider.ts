import { FREELANCER_USER_REPOSITORY } from 'src/modules/freelancer/application/ports/freelancer.token';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserRepositoryMongo } from '../presistence/mongo/user.repository.mongo';
import { UserRepositoryFreelancerAdapter } from '../adapters/user-repository-freelancer.adapter';
import { CLIENT_USER_REPOSITORY } from 'src/modules/client/application/ports/client.token';
import { UserRepositoryClientAdapter } from '../adapters/user-repository-client.adapter';

export const userProviders = [
  {
    provide: UserRepository,
    useClass: UserRepositoryMongo,
  },
  {
    provide: FREELANCER_USER_REPOSITORY,
    useClass: UserRepositoryFreelancerAdapter,
  },
  {
    provide: CLIENT_USER_REPOSITORY,
    useClass: UserRepositoryClientAdapter,
  },
];

import { FREELANCER_USER_REPOSITORY } from 'src/modules/freelancer/application/ports/freelancer.token';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserRepositoryMongo } from '../presistence/mongo/user.repository.mongo';
import { UserRepositoryFreelancerAdapter } from '../adapters/user-repository-freelancer.adapter';

export const userProviders = [
  {
    provide: UserRepository,
    useClass: UserRepositoryMongo,
  },
  {
    provide: FREELANCER_USER_REPOSITORY,
    useClass: UserRepositoryFreelancerAdapter,
  },
];

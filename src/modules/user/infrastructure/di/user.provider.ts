import { UserRepository } from '../../domain/repositories/user.repository';
import { UserRepositoryMongo } from '../presistence/mongo/user.repository.mongo';

export const userProviders = [
  {
    provide: UserRepository,
    useClass: UserRepositoryMongo,
  },
];

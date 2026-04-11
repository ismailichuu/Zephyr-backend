import { User } from '../../../user/domain/entities/user.entity';
import { ClientProfile } from '../../domain/entities/client-profile.entity';

export interface GetProfileOutput {
  profile: Partial<ClientProfile>;
  user: Partial<User>;
}

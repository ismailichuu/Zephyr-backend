import { ClientProfile } from '../../domain/entities/client-profile.entity';
import { User } from 'src/modules/user/domain/entities/user.entity';

export interface GetProfileOutput {
  profile: Partial<ClientProfile>;
  user: Partial<User>;
}

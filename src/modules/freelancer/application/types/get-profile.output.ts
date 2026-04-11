import { User } from '../../../user/domain/entities/user.entity';
import { FreelancerProfile } from '../../domain/entities/freelancer-profile.entity';

export interface GetProfileOutput {
  user: Partial<User>;
  profile: Partial<FreelancerProfile>;
}

import { User } from '../../../user/domain/entities/user.entity';
import { FreelancerProfile } from '../../domain/entities/freelancer-profile.entity';

export class GetProfileResponseDto {
  freelancerProfile!: {
    profile: Partial<FreelancerProfile>;
    user: Partial<User>;
  };
}

import { FreelancerProfile } from '../../domain/entities/freelancer-profile.entity';

export interface UpdateProfileBasicOutput {
  freelancer: {
    user: { name: string | undefined };
    profile: Partial<FreelancerProfile>;
  };
}

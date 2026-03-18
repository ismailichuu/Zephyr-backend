import { User } from 'src/modules/user/domain/entities/user.entity';
import { ClientProfile } from '../../domain/entities/client-profile.entity';

export class UpdateProfileBasicResponseDto {
  clientProfile: {
    profile?: Partial<ClientProfile>;
    user?: Partial<User>;
  };
}

export class UpdateProfileBioResponseDto {
  updatedBio?: string | null;
}

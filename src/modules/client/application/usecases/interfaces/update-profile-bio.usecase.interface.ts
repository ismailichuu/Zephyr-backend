import { UpdateProfileBioInput } from '../../types/update-profile-bio.input';
import { UpdateProfileBioOutput } from '../../types/update-profile-bio.output';

export interface IUpdateProfileBioUsecase {
  execute(dto: UpdateProfileBioInput): Promise<UpdateProfileBioOutput>;
}

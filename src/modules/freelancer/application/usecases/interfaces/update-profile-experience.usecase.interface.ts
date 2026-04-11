import { UpdateProfileExperienceInput } from '../../types/update-profile-experience.input';
import { UpdateProfileExperienceOutput } from '../../types/update-profile-experience.output';

export interface IUpdateProfileExperienceUsecase {
  execute(
    dto: UpdateProfileExperienceInput,
  ): Promise<UpdateProfileExperienceOutput>;
}

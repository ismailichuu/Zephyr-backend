import type { IFreelancerProfileRepository } from '../../../domain/repositories/freelancer-profile.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { UpdateProfileExperienceInput } from '../../types/update-profile-experience.input';
import { UpdateProfileExperienceOutput } from '../../types/update-profile-experience.output';
import { IUpdateProfileExperienceUsecase } from '../interfaces/update-profile-experience.usecase.interface';
import { FREELANCER_PROFILE_REPOSITORY } from 'src/modules/freelancer/domain/repositories/token.repository';

@Injectable()
export class UpdateProfileExperienceUsecase implements IUpdateProfileExperienceUsecase {
  constructor(
    @Inject(FREELANCER_PROFILE_REPOSITORY)
    private readonly _freelancerProfileRepo: IFreelancerProfileRepository,
  ) {}

  async execute({
    experience,
    userId,
  }: UpdateProfileExperienceInput): Promise<UpdateProfileExperienceOutput> {
    const updatedProfile = await this._freelancerProfileRepo.update(userId, {
      experience,
    });
    if (!updatedProfile) throw new BadRequestException(NOT_FOUND);

    return {
      experience: updatedProfile.experience ?? [],
    };
  }
}

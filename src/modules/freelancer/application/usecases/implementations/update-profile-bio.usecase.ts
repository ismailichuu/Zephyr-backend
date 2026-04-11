import type { IFreelancerProfileRepository } from '../../../domain/repositories/freelancer-profile.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { UpdateProfileBioInput } from '../../types/update-profile-bio.input';
import { UpdateProfileBioOutput } from '../../types/update-profile-bio.output';
import { IUpdateProfileBioUsecase } from '../interfaces/update-profile-bio.usecase.interface';
import { FREELANCER_PROFILE_REPOSITORY } from 'src/modules/freelancer/domain/repositories/token.repository';

@Injectable()
export class UpdateProfileBioUsecase implements IUpdateProfileBioUsecase {
  constructor(
    @Inject(FREELANCER_PROFILE_REPOSITORY)
    private readonly _freelancerProfileRepo: IFreelancerProfileRepository,
  ) {}

  async execute({
    bio,
    userId,
  }: UpdateProfileBioInput): Promise<UpdateProfileBioOutput | undefined> {
    if (bio) {
      const updatedProfile = await this._freelancerProfileRepo.update(userId, {
        bio,
      });
      if (!updatedProfile) throw new BadRequestException(NOT_FOUND);

      return {
        updatedBio: updatedProfile.bio,
      };
    }
  }
}

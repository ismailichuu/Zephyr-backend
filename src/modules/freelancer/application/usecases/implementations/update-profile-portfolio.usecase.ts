import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IFreelancerProfileRepository } from '../../../domain/repositories/freelancer-profile.repository';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { UpdateProfilePortfolioInput } from '../../types/update-profile-portfolio.input';
import { UpdateProfilePortfolioOutput } from '../../types/update-profile-portfolio.output';
import { IUpdateProfilePortfolioUsecase } from '../interfaces/update-profile-portfolio.usecase.interface';
import { FREELANCER_PROFILE_REPOSITORY } from 'src/modules/freelancer/domain/repositories/token.repository';

@Injectable()
export class UpdateProfilePortfolioUsecase implements IUpdateProfilePortfolioUsecase {
  constructor(
    @Inject(FREELANCER_PROFILE_REPOSITORY)
    private readonly _freelancerProfileRepo: IFreelancerProfileRepository,
  ) {}

  async execute({
    portfolioUrl,
    userId,
  }: UpdateProfilePortfolioInput): Promise<
    UpdateProfilePortfolioOutput | undefined
  > {
    if (portfolioUrl) {
      const updatedProfile = await this._freelancerProfileRepo.update(userId, {
        portfolioUrl,
      });

      if (!updatedProfile) throw new BadRequestException(NOT_FOUND);

      return {
        portfolioUrl: updatedProfile.portfolioUrl ?? '',
      };
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { FreelancerProfileRepository } from '../../domain/repositories/freelancer-profile.repository';
import { TokenPayload } from '../types/token-payload.type';
import { Request } from 'express';
import { PROFILE_UPDATED } from '../constants/success-message.const';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';

@Injectable()
export class UpdateProfilePortfolioUsecase {
  constructor(
    private readonly _freelancerProfileRepo: FreelancerProfileRepository,
  ) {}

  async execute(req: Request, portfolioUrl?: string) {
    const userPayload = req.user as TokenPayload;
    if (portfolioUrl) {
      const updatedProfile = await this._freelancerProfileRepo.update(
        userPayload.userId,
        {
          portfolioUrl,
        },
      );

      if (!updatedProfile) throw new BadRequestException(NOT_FOUND);

      return {
        message: PROFILE_UPDATED,
        portfolioUrl: updatedProfile.portfolioUrl,
      };
    }
  }
}

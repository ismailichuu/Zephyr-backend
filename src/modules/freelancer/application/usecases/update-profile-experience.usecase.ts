import { Request } from 'express';
import { FreelancerProfileRepository } from '../../domain/repositories/freelancer-profile.repository';
import { AddExperienceProfileDto } from '../../presentation/dtos/update-profile.dtos';
import { TokenPayload } from '../types/token-payload.type';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { PROFILE_UPDATED } from '../constants/success-message.const';

@Injectable()
export class UpdateProfileExperienceUsecase {
  constructor(
    private readonly _freelancerProfileRepo: FreelancerProfileRepository,
  ) {}

  async execute(req: Request, dto: AddExperienceProfileDto[]) {
    const userPayload = req.user as TokenPayload;

    const updatedProfile = await this._freelancerProfileRepo.update(
      userPayload.userId,
      { experience: dto },
    );

    if (!updatedProfile) throw new BadRequestException(NOT_FOUND);

    return {
      message: PROFILE_UPDATED,
      experince: updatedProfile.experience,
    };
  }
}

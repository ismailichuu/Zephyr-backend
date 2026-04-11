import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { FREELANCER_USER_REPOSITORY } from '../../ports/freelancer.token';
import type { IFreelancerProfileRepository } from '../../../domain/repositories/freelancer-profile.repository';
import { FreelancerProfile } from '../../../domain/entities/freelancer-profile.entity';
import type { FreelancerUserRepository } from '../../ports/freelancer-user.repository.port';
import { Availability } from '../../../domain/enums/freelancer-availability.enum';
import { NOT_FOUND } from '../../../../auth/application/constants/error-message.const';
import { GetProfileInput } from '../../types/get-profile.input';
import { GetProfileOutput } from '../../types/get-profile.output';
import { IGetProfileUsecase } from '../interfaces/get-profile.usecase.interface';
import { FREELANCER_PROFILE_REPOSITORY } from 'src/modules/freelancer/domain/repositories/token.repository';

@Injectable()
export class GetProfileUsecase implements IGetProfileUsecase {
  constructor(
    @Inject(FREELANCER_PROFILE_REPOSITORY)
    private readonly _freelancerProfileRepo: IFreelancerProfileRepository,
    @Inject(FREELANCER_USER_REPOSITORY)
    private readonly _freelancerUserRepo: FreelancerUserRepository,
  ) {}

  async execute({ userId }: GetProfileInput): Promise<GetProfileOutput> {
    let profile = await this._freelancerProfileRepo.findById(userId);

    const user = await this._freelancerUserRepo.findById(userId);
    if (!user) throw new UnauthorizedException(NOT_FOUND);
    if (!profile) {
      const freelancerProfile = FreelancerProfile.create({
        id: null,
        userId: userId,
        imageUrl: null,
        jobCategory: null,
        jobSubCategory: null,
        location: null,
        availability: Availability.AVAILABLE,
        experience: null,
        portfolioUrl: null,
        bio: null,
        updatedAt: null,
      });

      profile = await this._freelancerProfileRepo.create(freelancerProfile);
    }

    const freelancerProfile = {
      id: profile.id,
      userId: profile.userId,
      imageUrl: profile.imageUrl,
      bio: profile.bio,
      jobCategory: profile.jobCategory,
      jobSubCategory: profile.jobSubCategory,
      location: profile.location,
      availability: profile.availability,
      experience: profile.experience,
      portfolioUrl: profile.portfolioUrl,
      updatedAt: profile.updatedAt,
    };

    const userDetails = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscriptionId,
      isPremium: user.isPremium,
      status: user.status,
      createdAt: user.joinedAt,
    };

    return {
      profile: freelancerProfile,
      user: userDetails,
    };
  }
}

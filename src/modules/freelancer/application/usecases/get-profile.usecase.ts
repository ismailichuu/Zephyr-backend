import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { FREELANCER_USER_REPOSITORY } from '../ports/freelancer.token';
import {
  NOT_FOUND,
  TOKEN_EXPIRED,
} from 'src/modules/auth/application/constants/error-message.const';
import { FreelancerProfileRepository } from '../../domain/repositories/freelancer-profile.repository';
import { FreelancerProfile } from '../../domain/entities/freelancer-profile.entity';
import { PROFILE_FETCH_SUCCESS } from '../constants/success-message.const';
import type { FreelancerUserRepository } from '../ports/freelancer-user.repository.port';
import { Availability } from '../../domain/enums/freelancer-availability.enum';

@Injectable()
export class GetProfileUsecase {
  constructor(
    private readonly _freelancerProfileRepo: FreelancerProfileRepository,
    @Inject(FREELANCER_USER_REPOSITORY)
    private readonly _freelancerUserRepo: FreelancerUserRepository,
  ) {}

  async execute(req: Request) {
    const userPayload = req.user as { userId: string; role: string };

    if (!userPayload) throw new UnauthorizedException(TOKEN_EXPIRED);

    let profile = await this._freelancerProfileRepo.findById(
      userPayload.userId,
    );
    const user = await this._freelancerUserRepo.findById(userPayload.userId);
    if (!user) throw new UnauthorizedException(NOT_FOUND);
    if (!profile) {
      const freelancerProfile = FreelancerProfile.create({
        id: null,
        userId: userPayload.userId,
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

      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscriptionId,
        isPremium: user.isPremium,
        status: user.status,
        createdAt: user.joinedAt,
      },
    };

    return {
      message: PROFILE_FETCH_SUCCESS,
      freelancer: freelancerProfile,
    };
  }
}

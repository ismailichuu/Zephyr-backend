import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import type { TokenVerifier } from '../ports/token-verifier.port';
import {
  FREELANCER_USER_REPOSITORY,
  TOKEN_VERIFIER,
} from '../ports/freelancer.token';
import {
  NOT_FOUND,
  TOKEN_EXPIRED,
} from 'src/modules/auth/application/constants/error-message.const';
import { FreelancerProfileRepository } from '../../domain/repositories/freelancer-profile.repository';
import { FreelancerProfile } from '../../domain/entity/freelancer-profile.entity';
import { Availability } from '../../domain/enums/freelancer-availability.enum';
import { PROFILE_FETCH_SUCCESS } from '../constants/success-message.const';
import type { FreelancerUserRepository } from '../ports/freelancer-user.repository.port';

@Injectable()
export class GetProfileUsecase {
  constructor(
    @Inject(TOKEN_VERIFIER)
    private readonly _tokenVerifier: TokenVerifier,
    private readonly _freelancerProfileRepo: FreelancerProfileRepository,
    @Inject(FREELANCER_USER_REPOSITORY)
    private readonly _freelancerUserRepo: FreelancerUserRepository,
  ) {}

  async execute(req: Request) {
    const token = req.cookies?.accessToken as string | undefined;
    if (!token) throw new UnauthorizedException(TOKEN_EXPIRED);

    const isValid = await this._tokenVerifier.verifyAccessToken(token);
    if (!isValid) throw new UnauthorizedException(TOKEN_EXPIRED);

    let profile = await this._freelancerProfileRepo.findById(isValid.userId);
    const user = await this._freelancerUserRepo.findById(isValid.userId);
    if (!user) throw new UnauthorizedException(NOT_FOUND);
    if (!profile) {
      const freelancerProfile = FreelancerProfile.create({
        id: null,
        userId: isValid.userId,
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

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ClientProfileRepository } from '../../domain/repositories/client-profile.repository';
import { TokenPayload } from 'src/modules/freelancer/application/types/token-payload.type';
import { Request } from 'express';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { PROFILE_UPDATED_CLIENT } from '../constants/success-message.consts';
import { CLIENT_PROFILE_REPOSITORY } from '../../domain/repositories/repository.token';

@Injectable()
export class UpdateProfileBioUsecase {
  constructor(
    @Inject(CLIENT_PROFILE_REPOSITORY)
    private readonly _clientProfileRepo: ClientProfileRepository,
  ) {}

  async execute(req: Request, bio: string) {
    const userPayload = req.user as TokenPayload;

    const updatedProfile = await this._clientProfileRepo.update(
      userPayload.userId,
      { bio },
    );

    if (!updatedProfile) throw new BadRequestException(NOT_FOUND);

    return {
      message: PROFILE_UPDATED_CLIENT,
      updatedBio: updatedProfile.bio,
    };
  }
}

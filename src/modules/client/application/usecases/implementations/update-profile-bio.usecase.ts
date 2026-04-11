import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ClientProfileRepository } from '../../../domain/repositories/client-profile.repository';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { CLIENT_PROFILE_REPOSITORY } from '../../../domain/repositories/repository.token';
import { UpdateProfileBioInput } from '../../types/update-profile-bio.input';
import { UpdateProfileBioOutput } from '../../types/update-profile-bio.output';
import { IUpdateProfileBioUsecase } from '../interfaces/update-profile-bio.usecase.interface';

@Injectable()
export class UpdateProfileBioUsecase implements IUpdateProfileBioUsecase {
  constructor(
    @Inject(CLIENT_PROFILE_REPOSITORY)
    private readonly _clientProfileRepo: ClientProfileRepository,
  ) {}

  async execute(dto: UpdateProfileBioInput): Promise<UpdateProfileBioOutput> {
    const updatedProfile = await this._clientProfileRepo.update(dto.userId, {
      bio: dto.bio,
    });

    if (!updatedProfile) throw new BadRequestException(NOT_FOUND);

    return {
      updatedBio: updatedProfile.bio,
    };
  }
}

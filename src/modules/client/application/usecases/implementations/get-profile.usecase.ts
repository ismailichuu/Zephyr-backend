import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ClientProfileRepository } from '../../../domain/repositories/client-profile.repository';
import type { ClientUserRepository } from '../../ports/client-user.respository.port';
import { CLIENT_USER_REPOSITORY } from '../../ports/client.token';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { ClientProfile } from '../../../domain/entities/client-profile.entity';
import { CLIENT_PROFILE_REPOSITORY } from '../../../domain/repositories/repository.token';
import { GetProfileInput } from '../../types/get-profile.input';
import { GetProfileOutput } from '../../types/get-profile.output';
import { IGetProfileUsecase } from '../interfaces/get-profie.usecase.interface';

@Injectable()
export class GetProfileUsecase implements IGetProfileUsecase {
  constructor(
    @Inject(CLIENT_PROFILE_REPOSITORY)
    private readonly _clientProfileRepo: ClientProfileRepository,
    @Inject(CLIENT_USER_REPOSITORY)
    private readonly _clientUserRepo: ClientUserRepository,
  ) {}

  async execute(dto: GetProfileInput): Promise<GetProfileOutput> {
    let profile = await this._clientProfileRepo.findById(dto.userId);
    const user = await this._clientUserRepo.findById(dto.userId);
    if (!user) throw new NotFoundException(NOT_FOUND);
    if (!profile) {
      const clientProfile = ClientProfile.create({
        id: null,
        userId: dto.userId,
        imageUrl: null,
        location: null,
        bio: null,
        updatedAt: null,
        companyName: null,
      });

      profile = await this._clientProfileRepo.create(clientProfile);
    }

    return {
      profile: {
        id: profile.id,
        userId: profile.userId,
        imageUrl: profile.imageUrl,
        bio: profile.bio,
        location: profile.location,
        companyName: profile.companyName,
        updatedAt: profile.updatedAt,
      },

      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionId: user.subscriptionId,
        isPremium: user.isPremium,
        status: user.status,
        isAdminApproved: user.isAdminApproved,
      },
    };
  }
}

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ClientProfileRepository } from '../../domain/repositories/client-profile.repository';
import { Request } from 'express';
import type { ClientUserRepository } from '../ports/client-user.respository.port';
import { CLIENT_USER_REPOSITORY } from '../ports/client.token';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { ClientProfile } from '../../domain/entities/client-profile.entity';
import { FETCH_SUCCESS_CLIENT } from '../constants/success-message.consts';
import { CLIENT_PROFILE_REPOSITORY } from '../../domain/repositories/repository.token';
import { IGetProfileUsecase } from './interfaces/get-profile.usecase.interface';

@Injectable()
export class GetProfileUsecase implements IGetProfileUsecase {
  constructor(
    @Inject(CLIENT_PROFILE_REPOSITORY)
    private readonly _clientProfileRepo: ClientProfileRepository,
    @Inject(CLIENT_USER_REPOSITORY)
    private readonly _clientUserRepo: ClientUserRepository,
  ) {}

  async execute(req: Request) {
    const userPayload = req.user as { userId: string; role: string };

    let profile = await this._clientProfileRepo.findById(userPayload.userId);
    const user = await this._clientUserRepo.findById(userPayload.userId);
    if (!user) throw new UnauthorizedException(NOT_FOUND);
    if (!profile) {
      const clientProfile = ClientProfile.create({
        id: null,
        userId: userPayload.userId,
        imageUrl: null,
        location: null,
        bio: null,
        updatedAt: null,
        companyName: null,
      });

      profile = await this._clientProfileRepo.create(clientProfile);
    }

    const clientProfile = {
      id: profile.id,
      userId: profile.userId,
      imageUrl: profile.imageUrl,
      bio: profile.bio,
      location: profile.location,
      companyName: profile.companyName,
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
        isAdminApproved: user.isAdminApproved,
      },
    };

    return {
      message: FETCH_SUCCESS_CLIENT,
      client: clientProfile,
    };
  }
}

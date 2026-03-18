import { Request } from 'express';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { ClientProfile } from '../../domain/entities/client-profile.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  CLIENT_USER_REPOSITORY,
  FILE_UPLOADER,
  FILE_VALIDATOR_PORT,
} from '../ports/client.token';
import type { FileValidator } from '../ports/file-validator.port';
import type { UploadService } from '../ports/upload.service';
import type { ClientUserRepository } from '../ports/client-user.respository.port';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import type { ClientProfileRepository } from '../../domain/repositories/client-profile.repository';
import { CLIENT_PROFILE_REPOSITORY } from '../../domain/repositories/repository.token';
import { UpdateProfileBasicInput } from '../types/update-profile-basic.input';
import { IUpdateProfileBasicUsecase } from './update-profile-basic.usecase.interface';
import { UpdatePrfoleBasicOutput } from '../types/update-profile-basic.output';

export class UpdateProfileBasicUsecase implements IUpdateProfileBasicUsecase {
  constructor(
    @Inject(FILE_VALIDATOR_PORT)
    private readonly _fileValidator: FileValidator,
    @Inject(FILE_UPLOADER)
    private readonly _uploadService: UploadService,
    @Inject(CLIENT_USER_REPOSITORY)
    private readonly _userRepo: ClientUserRepository,
    @Inject(CLIENT_PROFILE_REPOSITORY)
    private readonly _clientProfileRepo: ClientProfileRepository,
  ) {}

  async execute(
    dto: UpdateProfileBasicInput,
  ): Promise<UpdatePrfoleBasicOutput> {
    const { name, ...profileDetails } = dto;

    let updatedUser: User | null = null;
    let updatedProfile: ClientProfile | null = null;

    if (dto.file) {
      this._fileValidator.validate(dto.file);
      const upload = await this._uploadService.uploadImage(
        dto.file,
        dto.userId,
      );

      profileDetails.imageUrl = upload.url;
    }

    if (name) {
      updatedUser = await this._userRepo.update(dto.userId, {
        name,
      });

      if (!updatedUser) {
        throw new BadRequestException(NOT_FOUND);
      }
    }

    if (Object.keys(profileDetails).length > 0) {
      updatedProfile = await this._clientProfileRepo.update(
        dto.userId,
        profileDetails,
      );

      if (!updatedProfile) {
        throw new BadRequestException(NOT_FOUND);
      }
    }

    return {
      user: {
        name: updatedUser ? updatedUser.name : name,
      },
      profile: {
        imageUrl: updatedProfile?.imageUrl ?? profileDetails.imageUrl,
        location: updatedProfile?.location ?? profileDetails.location,
        companyName: updatedProfile?.companyName ?? profileDetails.companyName,
      },
    };
  }
}

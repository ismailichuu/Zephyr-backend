import { Request } from 'express';
import { UpdateProfileBasicDto } from '../../presentation/dtos/update-profile.dtos';
import type { FreelancerUserRepository } from '../ports/freelancer-user.repository.port';
import { TokenPayload } from '../types/token-payload.type';
import { BadRequestException, Inject } from '@nestjs/common';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import { FreelancerProfileRepository } from '../../domain/repositories/freelancer-profile.repository';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { FreelancerProfile } from '../../domain/entities/freelancer-profile.entity';
import {
  FILE_VALIDATOR,
  FREELANCER_USER_REPOSITORY,
  UPLOAD_SERVICE,
} from '../ports/freelancer.token';
import { PROFILE_UPDATED } from '../constants/success-message.const';
import type { FileValidator } from '../ports/file-validator.interface';
import type { UploadService } from '../ports/upload.service';

export class UpdateProfileBasicUsecase {
  constructor(
    @Inject(FREELANCER_USER_REPOSITORY)
    private readonly _userRepo: FreelancerUserRepository,
    private readonly _freelancerProfileRepo: FreelancerProfileRepository,
    @Inject(FILE_VALIDATOR)
    private readonly _fileValidator: FileValidator,
    @Inject(UPLOAD_SERVICE)
    private readonly _uploadService: UploadService,
  ) {}

  async execute(
    req: Request,
    basicDetails: UpdateProfileBasicDto,
    file?: Express.Multer.File,
  ) {
    const userPayload = req.user as TokenPayload;

    const { name, ...profileDetails } = basicDetails;

    let updatedUser: User | null = null;
    let updatedProfile: FreelancerProfile | null = null;

    if (file) {
      this._fileValidator.validate(file);
      const upload = await this._uploadService.uploadImage(
        file,
        userPayload.userId,
      );

      profileDetails.imageUrl = upload.url;
    }

    if (name) {
      updatedUser = await this._userRepo.update(userPayload.userId, {
        name,
      });

      if (!updatedUser) {
        throw new BadRequestException(NOT_FOUND);
      }
    }

    if (Object.keys(profileDetails).length > 0) {
      updatedProfile = await this._freelancerProfileRepo.update(
        userPayload.userId,
        profileDetails,
      );

      if (!updatedProfile) {
        throw new BadRequestException(NOT_FOUND);
      }
    }

    return {
      message: PROFILE_UPDATED,
      freelancer: {
        user: {
          name: updatedUser ? updatedUser.name : name,
        },
        profile: {
          imageUrl: updatedProfile?.imageUrl ?? profileDetails.imageUrl,
          location: updatedProfile?.location ?? profileDetails.location,
          jobCategory:
            updatedProfile?.jobCategory ?? profileDetails.jobCategory,
          jobSubCategory:
            updatedProfile?.jobSubCategory ?? profileDetails.jobSubCategory,
        },
      },
    };
  }
}

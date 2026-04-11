import type { FreelancerUserRepository } from '../../ports/freelancer-user.repository.port';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NOT_FOUND } from 'src/modules/auth/application/constants/error-message.const';
import type { IFreelancerProfileRepository } from '../../../domain/repositories/freelancer-profile.repository';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { FreelancerProfile } from '../../../domain/entities/freelancer-profile.entity';
import {
  FILE_VALIDATOR,
  FREELANCER_USER_REPOSITORY,
  UPLOAD_SERVICE,
} from '../../ports/freelancer.token';
import type { FileValidator } from '../../ports/file-validator.interface';
import type { UploadService } from '../../ports/upload.service';
import { UpdateProfileBasicInput } from '../../types/update-profile-basic.input';
import { FREELANCER_PROFILE_REPOSITORY } from 'src/modules/freelancer/domain/repositories/token.repository';
import { UpdateProfileBasicOutput } from '../../types/update-profile-basic.output';
import { IUpdateProfileBasicUsecase } from '../interfaces/update-profile-basic.usecase.interface';

@Injectable()
export class UpdateProfileBasicUsecase implements IUpdateProfileBasicUsecase {
  constructor(
    @Inject(FREELANCER_USER_REPOSITORY)
    private readonly _userRepo: FreelancerUserRepository,
    @Inject(FREELANCER_PROFILE_REPOSITORY)
    private readonly _freelancerProfileRepo: IFreelancerProfileRepository,
    @Inject(FILE_VALIDATOR)
    private readonly _fileValidator: FileValidator,
    @Inject(UPLOAD_SERVICE)
    private readonly _uploadService: UploadService,
  ) {}

  async execute({
    basicDetails,
    file,
    userId,
  }: UpdateProfileBasicInput): Promise<UpdateProfileBasicOutput> {
    console.log(basicDetails);
    const { name, ...profileDetails } = basicDetails;

    let updatedUser: User | null = null;
    let updatedProfile: FreelancerProfile | null = null;

    if (file) {
      this._fileValidator.validate(file);
      const upload = await this._uploadService.uploadImage(file, userId);

      profileDetails.imageUrl = upload.url;
    }

    if (name) {
      updatedUser = await this._userRepo.update(userId, {
        name,
      });

      if (!updatedUser) {
        throw new BadRequestException(NOT_FOUND);
      }
    }

    if (Object.keys(profileDetails).length > 0) {
      updatedProfile = await this._freelancerProfileRepo.update(
        userId,
        profileDetails,
      );

      if (!updatedProfile) {
        throw new BadRequestException(NOT_FOUND);
      }
    }

    return {
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

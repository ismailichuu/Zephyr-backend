import { FILE_UPLOADER } from '../../application/ports/client.token';
import { GetProfileUsecase } from '../../application/usecases/get-profile.usecase';
import { UpdateProfileBasicUsecase } from '../../application/usecases/update-profile-basic.usecase';
import { UpdateProfileBioUsecase } from '../../application/usecases/update-profile-bio.usecase';
import { CLIENT_PROFILE_REPOSITORY } from '../../domain/repositories/repository.token';
import { ClientProfileRepositoryMongo } from '../presistence/mongo/client-profile.repository.mongo';
import { CloudinaryUploadService } from '../services/cloudinary-upload.service';

export const clientProviders = [
  {
    provide: CLIENT_PROFILE_REPOSITORY,
    useClass: ClientProfileRepositoryMongo,
  },
  {
    provide: FILE_UPLOADER,
    useClass: CloudinaryUploadService,
  },
  //usecases
  GetProfileUsecase,
  UpdateProfileBasicUsecase,
  UpdateProfileBioUsecase,
];

import { FILE_UPLOADER } from '../../application/ports/client.token';
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
];

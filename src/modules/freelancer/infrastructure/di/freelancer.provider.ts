import { FILE_VALIDATOR_PORT } from 'src/modules/client/application/ports/client.token';
import {
  FILE_VALIDATOR,
  UPLOAD_SERVICE,
} from '../../application/ports/freelancer.token';
import { FreelancerProfileRepositoryMongo } from '../presistence/mongo/freelancer-profile/freelancer-profile.repository.mongo';
import { SkillRepositoryMongo } from '../presistence/mongo/skill/skill.repository.mongo';
import { CloudinaryUploadService } from '../services/cloudinary.service';
import { ImageFileValidator } from '../services/image-file-validator';
import { FREELANCER_PROFILE_REPOSITORY } from '../../domain/repositories/token.repository';
import { SkillRepository } from '../../domain/repositories/skill.repository';

export const freelancerProviders = [
  {
    provide: SkillRepository,
    useClass: SkillRepositoryMongo,
  },
  {
    provide: FREELANCER_PROFILE_REPOSITORY,
    useClass: FreelancerProfileRepositoryMongo,
  },
  {
    provide: UPLOAD_SERVICE,
    useClass: CloudinaryUploadService,
  },
  {
    provide: FILE_VALIDATOR,
    useClass: ImageFileValidator,
  },
  {
    provide: FILE_VALIDATOR_PORT,
    useClass: ImageFileValidator,
  },
];

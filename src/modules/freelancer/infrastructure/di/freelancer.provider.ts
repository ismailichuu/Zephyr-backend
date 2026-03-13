import { FILE_VALIDATOR_PORT } from 'src/modules/client/application/ports/client.token';
import {
  FILE_VALIDATOR,
  UPLOAD_SERVICE,
} from '../../application/ports/freelancer.token';
import { GetProfileUsecase } from '../../application/usecases/get-profile.usecase';
import { GetSkillsUsecase } from '../../application/usecases/get-skills.usecase';
import { UpdateProfileBasicUsecase } from '../../application/usecases/update-profile-basic.usecase';
import { UpdateProfileBioUsecase } from '../../application/usecases/update-profile-bio.usecase';
import { UpdateProfileExperienceUsecase } from '../../application/usecases/update-profile-experience.usecase';
import { UpdateProfilePortfolioUsecase } from '../../application/usecases/update-profile-portfolio.usecase';
import { FreelancerProfileRepository } from '../../domain/repositories/freelancer-profile.repository';
import { SkillRepository } from '../../domain/repositories/skill.repository';
import { FreelancerProfileRepositoryMongo } from '../presistence/mongo/freelancer-profile/freelancer-profile.repository.mongo';
import { SkillRepositoryMongo } from '../presistence/mongo/skill/skill.repository.mongo';
import { CloudinaryUploadService } from '../services/cloudinary.service';
import { ImageFileValidator } from '../services/image-file-validator';

export const freelancerProviders = [
  {
    provide: SkillRepository,
    useClass: SkillRepositoryMongo,
  },
  {
    provide: FreelancerProfileRepository,
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
  //usecases
  GetProfileUsecase,
  GetSkillsUsecase,
  UpdateProfileBasicUsecase,
  UpdateProfileBioUsecase,
  UpdateProfilePortfolioUsecase,
  UpdateProfileExperienceUsecase,
];

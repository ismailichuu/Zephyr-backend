import { GetProfileUsecase } from '../../application/usecases/get-profile.usecase';
import { GetSkillsUsecase } from '../../application/usecases/get-skills.usecase';
import { FreelancerProfileRepository } from '../../domain/repositories/freelancer-profile.repository';
import { SkillRepository } from '../../domain/repositories/skill.repository';
import { FreelancerProfileRepositoryMongo } from '../presistence/mongo/freelancer-profile/freelancer-profile.repository.mongo';
import { SkillRepositoryMongo } from '../presistence/mongo/skill/skill.repository.mongo';

export const freelancerProviders = [
  {
    provide: SkillRepository,
    useClass: SkillRepositoryMongo,
  },
  {
    provide: FreelancerProfileRepository,
    useClass: FreelancerProfileRepositoryMongo,
  },
  //usecases
  GetProfileUsecase,
  GetSkillsUsecase,
];

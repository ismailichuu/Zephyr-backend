import { Module } from '@nestjs/common';
import { FreelancerController } from './presentation/freelancer.controller';
import { freelancerProviders } from './infrastructure/di/freelancer.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillSchema } from './infrastructure/presistence/mongo/skill/skill.schema';
import {
  FreelancerProfileDocument,
  FreelancerProfileSchema,
} from './infrastructure/presistence/mongo/freelancer-profile/freelancer-profile.schema';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { FILE_VALIDATOR_PORT } from '../client/application/ports/client.token';
import {
  GET_PROFILE_USECASE,
  GET_SKILLS_USECASE,
  UPDATE_PROFILE_BASIC_USECASE,
  UPDATE_PROFILE_BIO_USECASE,
  UPDATE_PROFILE_EXPERIENCE_USECASE,
  UPDATE_PROFILE_PORTFOLIO_USECASE,
} from './application/usecases/tokens.usecase';
import { UpdateProfileBasicUsecase } from './application/usecases/implementations/update-profile-basic.usecase';
import { UpdateProfileBioUsecase } from './application/usecases/implementations/update-profile-bio.usecase';
import { UpdateProfileExperienceUsecase } from './application/usecases/implementations/update-profile-experience.usecase';
import { UpdateProfilePortfolioUsecase } from './application/usecases/implementations/update-profile-portfolio.usecase';
import { GetProfileUsecase } from './application/usecases/implementations/get-profile.usecase';
import { GetSkillsUsecase } from './application/usecases/implementations/get-skills.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FreelancerProfileDocument.name, schema: FreelancerProfileSchema },
    ]),
    MongooseModule.forFeature([{ name: 'skill', schema: SkillSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [FreelancerController],
  providers: [
    //usecases
    {
      provide: UPDATE_PROFILE_BASIC_USECASE,
      useClass: UpdateProfileBasicUsecase,
    },
    {
      provide: UPDATE_PROFILE_BIO_USECASE,
      useClass: UpdateProfileBioUsecase,
    },
    {
      provide: UPDATE_PROFILE_EXPERIENCE_USECASE,
      useClass: UpdateProfileExperienceUsecase,
    },
    {
      provide: UPDATE_PROFILE_PORTFOLIO_USECASE,
      useClass: UpdateProfilePortfolioUsecase,
    },
    {
      provide: GET_PROFILE_USECASE,
      useClass: GetProfileUsecase,
    },
    {
      provide: GET_SKILLS_USECASE,
      useClass: GetSkillsUsecase,
    },
    ...freelancerProviders,
  ],
  exports: [FILE_VALIDATOR_PORT],
})
export class FreelancerModule {}

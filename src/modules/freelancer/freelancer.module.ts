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
  providers: [...freelancerProviders],
  exports: [FILE_VALIDATOR_PORT],
})
export class FreelancerModule {}

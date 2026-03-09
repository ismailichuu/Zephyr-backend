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
})
export class FreelancerModule {}

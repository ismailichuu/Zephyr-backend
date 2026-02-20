import { Module } from '@nestjs/common';
import { FreelancerController } from './presentation/freelancer.controller';

@Module({
  controllers: [FreelancerController],
})
export class FreelancerModule {}

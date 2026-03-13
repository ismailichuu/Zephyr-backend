import { Module } from '@nestjs/common';
import { ClientController } from './presentation/client.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClientProfileDocument,
  ClientProfileSchema,
} from './infrastructure/presistence/mongo/client-profile.schema';
import { clientProviders } from './infrastructure/di/client.provider';
import { UserModule } from '../user/user.module';
import { FreelancerModule } from '../freelancer/freelancer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ClientProfileDocument.name,
        schema: ClientProfileSchema,
      },
    ]),
    UserModule,
    FreelancerModule,
  ],
  providers: [...clientProviders],
  controllers: [ClientController],
})
export class ClientModule {}

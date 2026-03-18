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
import {
  GET_PROFILE_USECASE,
  UPDATE_PROFILE_BASIC_USECASE,
  UPDATE_PROFILE_BIO_USECASE,
} from './application/usecases/usecase.tokens';
import { GetProfileUsecase } from './application/usecases/get-profile.usecase';
import { UpdateProfileBasicUsecase } from './application/usecases/update-profile-basic.usecase';
import { UpdateProfileBioUsecase } from './application/usecases/update-profile-bio.usecase';

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
  providers: [
    //usecases
    {
      provide: GET_PROFILE_USECASE,
      useClass: GetProfileUsecase,
    },
    {
      provide: UPDATE_PROFILE_BASIC_USECASE,
      useClass: UpdateProfileBasicUsecase,
    },
    {
      provide: UPDATE_PROFILE_BIO_USECASE,
      useClass: UpdateProfileBioUsecase,
    },
    ...clientProviders,
  ],
  controllers: [ClientController],
})
export class ClientModule {}

import { Module } from '@nestjs/common';
import {
  UserDocument,
  UserSchema,
} from './infrastructure/presistence/mongo/user.schema';
import { userProviders } from './infrastructure/di/user.provider';
import { UserRepository } from './domain/repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [...userProviders],
  exports: [UserRepository],
})
export class UserModule {}

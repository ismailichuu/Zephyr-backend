import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Providers } from 'src/modules/user/domain/enums/providers.enum';
import { UserRole } from 'src/modules/user/domain/enums/role.enum';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';

@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ enum: Providers, default: Providers.NORMAL })
  provider: string;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ default: null })
  subscriptionId: string;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

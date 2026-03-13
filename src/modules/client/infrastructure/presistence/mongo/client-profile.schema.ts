import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ClientProfileDocument extends Document {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ type: String, required: false, default: null })
  imageUrl: string | null;

  @Prop({ type: String, required: false, default: null })
  bio: string | null;

  @Prop({ type: String, required: false, default: null })
  companyName: string | null;

  @Prop({ type: String, required: false, default: null })
  location: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ClientProfileSchema = SchemaFactory.createForClass(
  ClientProfileDocument,
);

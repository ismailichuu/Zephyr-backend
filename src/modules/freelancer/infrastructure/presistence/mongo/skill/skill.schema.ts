import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SkillDocument extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true })
  categories!: string[];

  createdAt?: Date;
}

export const SkillSchema = SchemaFactory.createForClass(SkillDocument);

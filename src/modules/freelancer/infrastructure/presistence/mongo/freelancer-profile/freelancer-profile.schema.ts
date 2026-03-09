import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Availability } from 'src/modules/freelancer/domain/enums/freelancer-availability.enum';
import { Experience } from 'src/modules/freelancer/entity/freelancer-profile.entity';

@Schema({ timestamps: true })
export class FreelancerProfileDocument extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ type: String, required: false })
  imageUrl: string | null;

  @Prop({ required: false })
  jobCategory: string;

  @Prop({ required: false })
  jobSubCategory: string;

  @Prop({ type: String, required: false, maxLength: 1000 })
  bio: string | null;

  @Prop({ enum: Availability, default: Availability.AVAILABLE })
  availability: string;

  @Prop({ type: String, required: false })
  location: string | null;

  @Prop({ required: false })
  experience: Experience[] | [];

  @Prop({ type: String, required: false })
  portofolioUrl: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const FreelancerProfileSchema = SchemaFactory.createForClass(
  FreelancerProfileDocument,
);

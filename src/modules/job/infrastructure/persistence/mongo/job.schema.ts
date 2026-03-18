import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HiringMode } from 'src/modules/job/domain/enums/hiring-mode.enum';
import { JobStatus } from 'src/modules/job/domain/enums/job-status.enum';
import { Attachment } from 'src/modules/job/domain/types/attachment.type';
import type { BudgetRange } from 'src/modules/job/domain/types/budget-range.type';

@Schema({ timestamps: true })
export class JobDocument extends Document {
  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  budgetRange: BudgetRange;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  requiredSkills: string[];

  @Prop({ type: [{ url: String, filename: String }] })
  attachments: Attachment[] | null;

  @Prop({ required: true, enum: HiringMode })
  hiringMode: string;

  @Prop({ required: true, enum: JobStatus, default: JobStatus.OPEN })
  status: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const JobSchema = SchemaFactory.createForClass(JobDocument);

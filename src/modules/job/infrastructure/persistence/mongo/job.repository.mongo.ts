// import { Model } from 'mongoose';
// import { Job } from 'src/modules/job/domain/entities/job.entity';
// import { JobRepository } from 'src/modules/job/domain/repositories/job.repository';
// import { JobDocument } from './job.schema';
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';

// @Injectable()
// export class JobRepositoryMongo implements JobRepository {
//   constructor(
//     @InjectModel(JobDocument.name) private jobModel: Model<JobDocument>,
//   ) {}

//   private _toDomain(jobDoc: JobDocument): Job {
//     return Job.create(
//       jobDoc._id.toString(),
//       jobDoc.clientId,
//       jobDoc.title,
//       jobDoc.description,
//       jobDoc.category,
//       jobDoc.budgetRange,
//       jobDoc.duration,
//       jobDoc.requiredSkills,
//       jobDoc.attachments,
//       jobDoc.hiringMode as HiringMode,
//       jobDoc.status as JobStatus,
//       jobDoc.createdAt || null,
//       jobDoc.updatedAt || null,
//     );
//   }

//   async findById(id: string): Promise<Job | null> {
//     const jobDoc = await this.jobModel.findById(id).exec();

//   }
// }

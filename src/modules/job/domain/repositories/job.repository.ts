import { BaseRepository } from 'src/modules/shared/repositories/base.repository';
import { Job } from '../entities/job.entity';

export abstract class JobRepository implements BaseRepository<Job> {
  abstract findById(id: string): Promise<Job | null>;
  abstract findAll(): Promise<Job[]>;
  abstract create(entity: Job): Promise<Job>;
  abstract update(id: string, entity: Partial<Job>): Promise<Job | null>;
  abstract countDocument(): Promise<number>;
}

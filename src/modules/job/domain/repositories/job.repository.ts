import { BaseRepository } from 'src/modules/shared/repositories/base.repository';
import { Job } from '../entities/job.entity';

export interface JobRepository extends BaseRepository<Job> {
  findById(id: string): Promise<Job | null>;
  findAll(): Promise<Job[]>;
  create(entity: Job): Promise<Job>;
  update(id: string, entity: Partial<Job>): Promise<Job | null>;
  countDocument(): Promise<number>;
}

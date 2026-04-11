import { BaseRepository } from 'src/modules/shared/repositories/base.repository';
import { FreelancerProfile } from '../entities/freelancer-profile.entity';

export interface IFreelancerProfileRepository extends BaseRepository<FreelancerProfile> {
  findById(id: string): Promise<FreelancerProfile | null>;
  findAll(): Promise<FreelancerProfile[]>;
  create(entity: FreelancerProfile): Promise<FreelancerProfile>;
  update(
    id: string,
    entity: Partial<FreelancerProfile>,
  ): Promise<FreelancerProfile | null>;
}

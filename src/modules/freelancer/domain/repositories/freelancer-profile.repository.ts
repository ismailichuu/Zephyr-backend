import { BaseRepository } from 'src/modules/shared/repositories/base.repository';
import { FreelancerProfile } from '../entities/freelancer-profile.entity';

export abstract class FreelancerProfileRepository implements BaseRepository<FreelancerProfile> {
  abstract findById(id: string): Promise<FreelancerProfile | null>;
  abstract findAll(): Promise<FreelancerProfile[]>;
  abstract create(entity: FreelancerProfile): Promise<FreelancerProfile>;
  abstract update(
    id: string,
    entity: Partial<FreelancerProfile>,
  ): Promise<FreelancerProfile | null>;
  abstract countDocument(): Promise<number>;
}

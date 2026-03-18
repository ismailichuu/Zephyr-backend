import { BaseRepository } from 'src/modules/shared/repositories/base.repository';
import { ClientProfile } from '../entities/client-profile.entity';

export interface ClientProfileRepository extends BaseRepository<ClientProfile> {
  findById(id: string): Promise<ClientProfile | null>;
  create(entity: ClientProfile): Promise<ClientProfile>;
  update(
    id: string,
    entity: Partial<ClientProfile>,
  ): Promise<ClientProfile | null>;
}

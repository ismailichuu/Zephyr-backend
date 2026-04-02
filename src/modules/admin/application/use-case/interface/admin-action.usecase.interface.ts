import { AdminActionInput } from '../../types/admin-action.input';
import { AdminActionOutput } from '../../types/admin-action.output';

export interface IAdminActionUsecase {
  execute(dto: AdminActionInput): Promise<AdminActionOutput>;
}

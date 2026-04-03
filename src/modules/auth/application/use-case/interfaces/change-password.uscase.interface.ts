import { ChangePasswordInput } from '../../types/change-password.input';

export interface IChangePasswordUsecase {
  execute(dto: ChangePasswordInput): Promise<void>;
}

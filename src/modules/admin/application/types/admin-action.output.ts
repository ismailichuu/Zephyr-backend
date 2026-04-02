import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';

export interface AdminActionOutput {
  status?: UserStatus;
  isAdminApproved?: boolean;
}

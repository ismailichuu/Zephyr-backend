import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';

export interface AdminActionInput {
  userId: string;
  action: UserStatus | 'VERIFY';
}

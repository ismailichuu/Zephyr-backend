import { UserRole } from 'src/modules/user/domain/enums/role.enum';

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export interface ResetTokenPayload {
  userId: string;
  role: UserRole;
  type: string;
}

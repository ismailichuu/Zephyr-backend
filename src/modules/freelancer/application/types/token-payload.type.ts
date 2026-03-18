import { UserRole } from 'src/modules/user/domain/enums/role.enum';

export type TokenPayload = {
  userId: string;
  role: UserRole;
};

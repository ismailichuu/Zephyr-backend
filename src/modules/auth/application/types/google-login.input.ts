import { UserRole } from 'src/modules/user/domain/enums/role.enum';

export interface GoogleLoginInput {
  code: string;
  role: UserRole;
}

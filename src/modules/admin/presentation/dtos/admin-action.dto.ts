import { IsString, IsIn } from 'class-validator';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';

export class AdminActionRequestDto {
  @IsString()
  userId!: string;

  @IsIn([...Object.values(UserStatus), 'VERIFY'])
  action!: UserStatus | 'VERIFY';
}

export class AdminActionResponseDto {
  isAdminApproved?: boolean;
  status?: UserStatus;
}

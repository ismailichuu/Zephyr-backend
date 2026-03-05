import { IsString, IsIn } from 'class-validator';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';

export class AdminActionDto {
  @IsString()
  userId: string;

  @IsIn([...Object.values(UserStatus), 'VERIFY'])
  action: UserStatus | 'VERIFY';
}

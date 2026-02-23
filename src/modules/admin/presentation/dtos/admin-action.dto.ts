import { IsEnum, IsString } from 'class-validator';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';

export class AdminActionDto {
  @IsString()
  userId: string;

  @IsEnum(UserStatus)
  action: UserStatus;
}

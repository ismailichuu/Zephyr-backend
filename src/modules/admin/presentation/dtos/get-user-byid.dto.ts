import { IsString } from 'class-validator';
import { User } from 'src/modules/user/domain/entities/user.entity';

export class GetUserByIdRequestDto {
  @IsString()
  id!: string;
}

export class GetUserByIdResponseDto {
  user!: Partial<User>;
}

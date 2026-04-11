import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { User } from 'src/modules/user/domain/entities/user.entity';

export class GetAllUsersRequestDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class GetAllUsersResponseDto {
  users!: Partial<User>[];
  totalPages!: number;
  totalUsers!: number;
}

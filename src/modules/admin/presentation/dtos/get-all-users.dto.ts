import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetAllUsersDto {
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

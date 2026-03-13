import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileBasicDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateProfileBioDto {
  @IsString()
  bio: string;
}

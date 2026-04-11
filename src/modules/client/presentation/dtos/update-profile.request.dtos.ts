import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileBasicRequestDto {
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

export class UpdateProfileBioRequestDto {
  @IsString()
  bio!: string;
}

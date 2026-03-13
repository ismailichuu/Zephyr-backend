import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileBasicDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  jobCategory?: string;

  @IsOptional()
  @IsString()
  jobSubCategory?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateProfileBioDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;
}

export class UpdateProfilePortfolioDto {
  @IsOptional()
  @IsString()
  portfolioUrl?: string;
}

export class AddExperienceProfileDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;
}

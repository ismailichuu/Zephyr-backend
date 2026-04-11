import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Experience } from '../../domain/types/experience.type';
import { FreelancerProfile } from '../../domain/entities/freelancer-profile.entity';

export class UpdateProfileBasicRequestDto {
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

export class UpdateProfileBasicResponseDto {
  freelancer!: {
    user?: { name?: string | undefined } | undefined;
    profile?: Partial<FreelancerProfile>;
  };
}
export class UpdateProfileBioRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;
}

export class UpdateProfileBioResponseDto {
  bio?: string | null;
}

export class UpdateProfilePortfolioRequestDto {
  @IsOptional()
  @IsString()
  portfolioUrl?: string;
}

export class UpdateProfilePortfolioResponseDto {
  portfolioUrl?: string;
}

export class AddExperienceProfileRequestDto {
  @IsString()
  title!: string;

  @IsString()
  company!: string;

  @IsString()
  startDate!: Date;

  @IsString()
  endDate!: Date;
}

export class AddExperienceProfileResponseDto {
  experience!: Experience[] | [];
}

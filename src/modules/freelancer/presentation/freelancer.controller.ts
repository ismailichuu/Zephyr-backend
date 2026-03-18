import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { GetProfileUsecase } from '../application/usecases/get-profile.usecase';
import { GetSkillsDto } from './dtos/get-skills.dto';
import { GetSkillsUsecase } from '../application/usecases/get-skills.usecase';
import { JwtGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/presentation/guards/role.guard';
import { Roles } from 'src/modules/auth/presentation/decorators/role.decorator';
import {
  AddExperienceProfileDto,
  UpdateProfileBasicDto,
  UpdateProfileBioDto,
  UpdateProfilePortfolioDto,
} from './dtos/update-profile.dtos';
import { UpdateProfileBasicUsecase } from '../application/usecases/update-profile-basic.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileBioUsecase } from '../application/usecases/update-profile-bio.usecase';
import { UpdateProfilePortfolioUsecase } from '../application/usecases/update-profile-portfolio.usecase';
import { UpdateProfileExperienceUsecase } from '../application/usecases/update-profile-experience.usecase';

@Controller('freelancer')
export class FreelancerController {
  constructor(
    private readonly _getProfileUsecase: GetProfileUsecase,
    private readonly _getSkillsUsecase: GetSkillsUsecase,
    private readonly _updateProfileBasicUsecase: UpdateProfileBasicUsecase,
    private readonly _updateProfileBioUsecase: UpdateProfileBioUsecase,
    private readonly _updateProfilePortfolioUsecase: UpdateProfilePortfolioUsecase,
    private readonly _updateProfileExperienceUsecase: UpdateProfileExperienceUsecase,
  ) {}

  //* Freelancer routes for profile and skills
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @Get('profile')
  getProfile(@Req() req: Request) {
    return this._getProfileUsecase.execute(req);
  }

  //? Get skills by category
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @Get('skills')
  getSkills(@Query() dto: GetSkillsDto) {
    return this._getSkillsUsecase.execute(dto.category);
  }

  //? Update profile basic info (name, title, etc.)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @UseInterceptors(FileInterceptor('image'))
  @Patch('profile/basic')
  updateBasicProfile(
    @Req() req: Request,
    @Body() dto: UpdateProfileBasicDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._updateProfileBasicUsecase.execute(req, dto, file);
  }

  //? Update profile bio
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @Patch('profile/bio')
  updateProfileBio(@Body() dto: UpdateProfileBioDto, @Req() req: Request) {
    return this._updateProfileBioUsecase.execute(req, dto.bio);
  }

  //? Update profile portfolio link
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @Patch('profile/portfolio')
  updateProfilePortfolio(
    @Body() dto: UpdateProfilePortfolioDto,
    @Req() req: Request,
  ) {
    return this._updateProfilePortfolioUsecase.execute(req, dto.portfolioUrl);
  }

  //? Add profile experience (new endpoint for adding work experience to profile)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @Put('profile/experience')
  addProfileExperience(
    @Req() req: Request,
    @Body() dto: AddExperienceProfileDto[],
  ) {
    return this._updateProfileExperienceUsecase.execute(req, dto);
  }
}

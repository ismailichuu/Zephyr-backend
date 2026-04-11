import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  AddExperienceProfileRequestDto,
  AddExperienceProfileResponseDto,
  UpdateProfileBasicRequestDto,
  UpdateProfileBasicResponseDto,
  UpdateProfileBioRequestDto,
  UpdateProfileBioResponseDto,
  UpdateProfilePortfolioRequestDto,
  UpdateProfilePortfolioResponseDto,
} from './dtos/update-profile.dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  PROFILE_FETCH_SUCCESS,
  PROFILE_UPDATED,
  SKILL_FETCH_SUCCESS,
} from '../application/constants/success-message.const';
import { ResponseMessage } from '../../../common/decarators/success-message.decarator';
import { Roles } from '../../../common/decarators/role.decorator';
import { JwtGuard } from '../../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../../common/guards/role.guard';
import { TOKEN_EXPIRED } from '../../auth/application/constants/error-message.const';
import { GetProfileResponseDto } from './dtos/get-profile.dto';
import {
  GetSkillResponseDto,
  GetSkillsRequestDto,
} from './dtos/get-skills.dto';
import { TokenPayload } from '../application/types/token-payload.type';
import type { IGetProfileUsecase } from '../application/usecases/interfaces/get-profile.usecase.interface';
import type { IGetSkillsUsecase } from '../application/usecases/interfaces/get-skills.usecase.interface';
import type { IUpdateProfileBioUsecase } from '../application/usecases/interfaces/update-profile-bio.usecase.interface';
import type { IUpdateProfilePortfolioUsecase } from '../application/usecases/interfaces/update-profile-portfolio.usecase.interface';
import type { IUpdateProfileExperienceUsecase } from '../application/usecases/interfaces/update-profile-experience.usecase.interface';
import {
  GET_PROFILE_USECASE,
  GET_SKILLS_USECASE,
  UPDATE_PROFILE_BASIC_USECASE,
  UPDATE_PROFILE_BIO_USECASE,
  UPDATE_PROFILE_EXPERIENCE_USECASE,
  UPDATE_PROFILE_PORTFOLIO_USECASE,
} from '../application/usecases/tokens.usecase';
import type { IUpdateProfileBasicUsecase } from '../application/usecases/interfaces/update-profile-basic.usecase.interface';

@Controller('freelancer')
export class FreelancerController {
  constructor(
    @Inject(GET_PROFILE_USECASE)
    private readonly _getProfileUsecase: IGetProfileUsecase,
    @Inject(GET_SKILLS_USECASE)
    private readonly _getSkillsUsecase: IGetSkillsUsecase,
    @Inject(UPDATE_PROFILE_BASIC_USECASE)
    private readonly _updateProfileBasicUsecase: IUpdateProfileBasicUsecase,
    @Inject(UPDATE_PROFILE_BIO_USECASE)
    private readonly _updateProfileBioUsecase: IUpdateProfileBioUsecase,
    @Inject(UPDATE_PROFILE_PORTFOLIO_USECASE)
    private readonly _updateProfilePortfolioUsecase: IUpdateProfilePortfolioUsecase,
    @Inject(UPDATE_PROFILE_EXPERIENCE_USECASE)
    private readonly _updateProfileExperienceUsecase: IUpdateProfileExperienceUsecase,
  ) {}

  //* Freelancer routes for profile and skills
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @ResponseMessage(PROFILE_FETCH_SUCCESS)
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<GetProfileResponseDto> {
    const userPayload = req.user as { userId: string; role: string };
    if (!userPayload) throw new UnauthorizedException(TOKEN_EXPIRED);
    const { user, profile } =
      await this._getProfileUsecase.execute(userPayload);
    return {
      freelancerProfile: {
        profile,
        user,
      },
    };
  }

  //? Get skills by category
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @ResponseMessage(SKILL_FETCH_SUCCESS)
  @Get('skills')
  getSkills(@Query() dto: GetSkillsRequestDto): Promise<GetSkillResponseDto> {
    return this._getSkillsUsecase.execute(dto);
  }

  //? Update profile basic info (name, title, etc.)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @UseInterceptors(FileInterceptor('image'))
  @ResponseMessage(PROFILE_UPDATED)
  @Patch('profile/basic')
  async updateBasicProfile(
    @Req() req: Request,
    @Body() dto: UpdateProfileBasicRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateProfileBasicResponseDto> {
    const { userId } = req.user as TokenPayload;
    const res = await this._updateProfileBasicUsecase.execute({
      basicDetails: dto,
      userId,
      file,
    });

    return res;
  }

  //? Update profile bio
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @ResponseMessage(PROFILE_UPDATED)
  @Patch('profile/bio')
  async updateProfileBio(
    @Body() dto: UpdateProfileBioRequestDto,
    @Req() req: Request,
  ): Promise<UpdateProfileBioResponseDto> {
    const { userId } = req.user as TokenPayload;
    const res = await this._updateProfileBioUsecase.execute({
      bio: dto.bio ?? undefined,
      userId,
    });

    return {
      bio: res?.updatedBio ?? undefined,
    };
  }

  //? Update profile portfolio link
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @ResponseMessage(PROFILE_UPDATED)
  @Patch('profile/portfolio')
  updateProfilePortfolio(
    @Body() dto: UpdateProfilePortfolioRequestDto,
    @Req() req: Request,
  ): Promise<UpdateProfilePortfolioResponseDto | void> {
    const { userId } = req.user as TokenPayload;
    return this._updateProfilePortfolioUsecase.execute({
      userId,
      portfolioUrl: dto.portfolioUrl,
    });
  }

  //? Add profile experience (new endpoint for adding work experience to profile)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('FREELANCER')
  @ResponseMessage(PROFILE_UPDATED)
  @Put('profile/experience')
  addProfileExperience(
    @Req() req: Request,
    @Body() dto: AddExperienceProfileRequestDto[],
  ): Promise<AddExperienceProfileResponseDto> {
    const { userId } = req.user as TokenPayload;
    return this._updateProfileExperienceUsecase.execute({
      userId,
      experience: dto,
    });
  }
}

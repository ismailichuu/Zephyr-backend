import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UpdateProfileBasicRequestDto,
  UpdateProfileBioRequestDto,
} from './dtos/update-profile.request.dtos';
import {
  FETCH_SUCCESS_CLIENT,
  PROFILE_UPDATED_CLIENT,
} from '../application/constants/success-message.consts';
import { GetProfileResponseDto } from './dtos/get-profile.response.dto';
import {
  UpdateProfileBasicResponseDto,
  UpdateProfileBioResponseDto,
} from './dtos/update-profile.response.dto';
import { ResponseMessage } from 'src/common/decarators/success-message.decarator';
import { Roles } from 'src/common/decarators/role.decorator';
import {
  GET_PROFILE_USECASE,
  UPDATE_PROFILE_BASIC_USECASE,
  UPDATE_PROFILE_BIO_USECASE,
} from '../application/usecases/usecase.tokens';
import type { IGetProfileUsecase } from '../application/usecases/interfaces/get-profie.usecase.interface';
import type { IUpdateProfileBasicUsecase } from '../application/usecases/interfaces/update-profile-basic.usecase.interface';
import type { IUpdateProfileBioUsecase } from '../application/usecases/interfaces/update-profile-bio.usecase.interface';

@Controller('client')
export class ClientController {
  constructor(
    @Inject(GET_PROFILE_USECASE)
    private readonly _getProfileUsecase: IGetProfileUsecase,
    @Inject(UPDATE_PROFILE_BASIC_USECASE)
    private readonly _updateProfileBasicUsecase: IUpdateProfileBasicUsecase,
    @Inject(UPDATE_PROFILE_BIO_USECASE)
    private readonly _updateProfileBioUsecase: IUpdateProfileBioUsecase,
  ) {}

  //? Get client profile
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('CLIENT')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCH_SUCCESS_CLIENT)
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<GetProfileResponseDto> {
    const userPayload = req.user as { userId: string; role: string };
    const { user, profile } =
      await this._getProfileUsecase.execute(userPayload);
    return {
      clientProfile: {
        user,
        profile,
      },
    };
  }

  //? Update profile basic info (name, location, etc.)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('CLIENT')
  @ResponseMessage(PROFILE_UPDATED_CLIENT)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('profile/basic')
  async updateBasicProfile(
    @Req() req: Request,
    @Body() dto: UpdateProfileBasicRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateProfileBasicResponseDto> {
    const userPayload = req.user as { userId: string; role: string };
    const { profile, user } = await this._updateProfileBasicUsecase.execute({
      ...dto,
      userId: userPayload.userId,
      file,
    });

    return {
      clientProfile: {
        profile,
        user,
      },
    };
  }

  //? Update profile bio
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('CLIENT')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(PROFILE_UPDATED_CLIENT)
  @Patch('profile/bio')
  updateProfileBio(
    @Req() req: Request,
    @Body() dto: UpdateProfileBioRequestDto,
  ): Promise<UpdateProfileBioResponseDto> {
    const userPayload = req.user as { userId: string; role: string };
    return this._updateProfileBioUsecase.execute({
      ...dto,
      userId: userPayload.userId,
    });
  }
}

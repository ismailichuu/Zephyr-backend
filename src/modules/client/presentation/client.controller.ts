import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from 'src/modules/auth/presentation/decorators/role.decorator';
import { JwtGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/presentation/guards/role.guard';
import { GetProfileUsecase } from '../application/usecases/get-profile.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UpdateProfileBasicDto,
  UpdateProfileBioDto,
} from './dtos/update-profile.dtos';
import { UpdateProfileBasicUsecase } from '../application/usecases/update-profile-basic.usecase';
import { UpdateProfileBioUsecase } from '../application/usecases/update-profile-bio.usecase';

@Controller('client')
export class ClientController {
  constructor(
    private readonly _getProfileUsecase: GetProfileUsecase,
    private readonly _updateProfileBasicUsecase: UpdateProfileBasicUsecase,
    private readonly _updateProfileBioUsecase: UpdateProfileBioUsecase,
  ) {}

  //? Get client profile
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('CLIENT')
  @Get('profile')
  getProfile(@Req() req: Request) {
    return this._getProfileUsecase.execute(req);
  }

  //? Update profile basic info (name, location, etc.)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('CLIENT')
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
  @Roles('CLIENT')
  @Patch('profile/bio')
  updateProfileBio(@Body() dto: UpdateProfileBioDto, @Req() req: Request) {
    return this._updateProfileBioUsecase.execute(req, dto.bio);
  }
}

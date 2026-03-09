import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { GetProfileUsecase } from '../application/usecases/get-profile.usecase';
import { GetSkillsDto } from './dtos/get-skills.dto';
import { GetSkillsUsecase } from '../application/usecases/get-skills.usecase';
import { JwtGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/presentation/guards/role.guard';

@Controller('freelancer')
export class FreelancerController {
  constructor(
    private readonly _getProfileUsecase: GetProfileUsecase,
    private readonly _getSkillsUsecase: GetSkillsUsecase,
  ) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return this._getProfileUsecase.execute(req);
  }

  @Get('skills')
  getSkills(@Query() dto: GetSkillsDto) {
    return this._getSkillsUsecase.execute(dto.category);
  }
}

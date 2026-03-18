import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetAllUsersUsecase } from '../application/use-case/get-all-users.usecase';
import { GetAllUsersDto } from './dtos/get-all-users.dto';
import { AdminActionDto } from './dtos/admin-action.dto';
import { AdminActionUsecase } from '../application/use-case/admin-action.usecase';
import { GetUserDetailsUsecase } from '../application/use-case/get-user-details.usecase';
import { JwtGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/presentation/guards/role.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly _getAllUserUsecase: GetAllUsersUsecase,
    private readonly _adminActionUsecase: AdminActionUsecase,
    private readonly _getUserDetailsUsecase: GetUserDetailsUsecase,
  ) {}

  //* Admin routes for user management
  @UseGuards(JwtGuard, RoleGuard)
  @Get('user')
  @HttpCode(HttpStatus.OK)
  getAllUsers(@Query() query: GetAllUsersDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';

    return this._getAllUserUsecase.execute(page, limit, search);
  }

  //? Admin actions: VERIFY, BLOCK, UNBLOCK
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('/user')
  @HttpCode(HttpStatus.OK)
  adminAction(@Body() dto: AdminActionDto) {
    return this._adminActionUsecase.execute(dto.userId, dto.action);
  }

  //? Get user details by ID
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/user/:id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string) {
    return this._getUserDetailsUsecase.execute(id);
  }
}

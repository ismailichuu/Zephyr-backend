import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { GetAllUsersUsecase } from '../application/use-case/get-all-users.usecase';
import { GetAllUsersDto } from './dtos/get-all-users.dto';
import { AdminActionDto } from './dtos/admin-action.dto';
import { AdminActionUsecase } from '../application/use-case/admin-action.usecase';
import { GetUserDetailsUsecase } from '../application/use-case/get-user-details.usecase';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly _getAllUserUsecase: GetAllUsersUsecase,
    private readonly _adminActionUsecase: AdminActionUsecase,
    private readonly _getUserDetailsUsecase: GetUserDetailsUsecase,
  ) {}

  //* Admin routes for user management
  @Get('user')
  @HttpCode(HttpStatus.OK)
  getAllUsers(@Query() query: GetAllUsersDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';

    return this._getAllUserUsecase.execute(page, limit, search);
  }

  //? Admin actions: VERIFY, BLOCK, UNBLOCK
  @Patch('/user')
  @HttpCode(HttpStatus.OK)
  adminAction(@Body() dto: AdminActionDto) {
    return this._adminActionUsecase.execute(dto.userId, dto.action);
  }

  //? Get user details by ID
  @Get('/user/:id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string) {
    return this._getUserDetailsUsecase.execute(id);
  }
}

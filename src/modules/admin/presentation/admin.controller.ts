import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  GetAllUsersRequestDto,
  GetAllUsersResponseDto,
} from './dtos/get-all-users.dto';
import {
  AdminActionRequestDto,
  AdminActionResponseDto,
} from './dtos/admin-action.dto';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decarators/role.decorator';
import { ResponseMessage } from 'src/common/decarators/success-message.decarator';
import {
  USER_FETCH_SUCCESS,
  USER_UPDATE_SUCCESS,
} from '../application/constants/success-message.const';
import {
  GetUserByIdRequestDto,
  GetUserByIdResponseDto,
} from './dtos/get-user-byid.dto';
import type { IGetAllUsersUsecase } from '../application/use-case/interface/get-all-users.usecase.interface';
import type { IAdminActionUsecase } from '../application/use-case/interface/admin-action.usecase.interface';
import type { IGetUserDetialsUsecase } from '../application/use-case/interface/get-user-details.usecase.interface';
import {
  ADMIN_ACTION_USECASE,
  GET_ALL_USERS_USECASE,
  GET_USER_DETAILS_USECASE,
} from '../application/use-case/token.usecase';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(GET_ALL_USERS_USECASE)
    private readonly _getAllUserUsecase: IGetAllUsersUsecase,
    @Inject(ADMIN_ACTION_USECASE)
    private readonly _adminActionUsecase: IAdminActionUsecase,
    @Inject(GET_USER_DETAILS_USECASE)
    private readonly _getUserDetailsUsecase: IGetUserDetialsUsecase,
  ) {}

  //* Admin routes for user management
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('ADMIN')
  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(USER_FETCH_SUCCESS)
  getAllUsers(
    @Query() query: GetAllUsersRequestDto,
  ): Promise<GetAllUsersResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    return this._getAllUserUsecase.execute({ limit, page, search });
  }

  //? Admin actions: VERIFY, BLOCK, UNBLOCK
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('ADMIN')
  @Patch('/user')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(USER_UPDATE_SUCCESS)
  adminAction(
    @Body() dto: AdminActionRequestDto,
  ): Promise<AdminActionResponseDto> {
    return this._adminActionUsecase.execute(dto);
  }

  //? Get user details by ID
  @UseGuards(JwtGuard, RoleGuard)
  @Roles('ADMIN')
  @Get('/user/:id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(USER_FETCH_SUCCESS)
  getUserById(
    @Param('id') dto: GetUserByIdRequestDto,
  ): Promise<GetUserByIdResponseDto> {
    return this._getUserDetailsUsecase.execute({ userId: dto.id });
  }
}

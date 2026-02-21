import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { GetAllUsersUsecase } from '../application/use-case/get-all-users.usecase';
import { GetAllUsersDto } from './dtos/get-all-users.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly _getAllUserUsecase: GetAllUsersUsecase) {}
  @Get('user')
  @HttpCode(HttpStatus.OK)
  getAllUsers(@Query() query: GetAllUsersDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';

    return this._getAllUserUsecase.execute(page, limit, search);
  }
}

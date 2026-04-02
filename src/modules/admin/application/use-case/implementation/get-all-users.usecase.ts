import { Inject, Injectable } from '@nestjs/common';
import type { AdminUserRepositoryPort } from '../../ports/admin-user-repository.port';
import { ADMIN_USER_REPOSITORY } from '../../ports/admin.token';
import { GetAllUsersInput } from '../../types/get-all-users.input';
import { GetAllUsersOutput } from '../../types/get-all-users.output';
import { IGetAllUsersUsecase } from '../interface/get-all-users.usecase.interface';

@Injectable()
export class GetAllUsersUsecase implements IGetAllUsersUsecase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly _userRepo: AdminUserRepositoryPort,
  ) {}

  async execute({
    page,
    limit,
    search,
  }: GetAllUsersInput): Promise<GetAllUsersOutput> {
    const { data, total, totalPages } = await this._userRepo.findPaginated(
      page,
      limit,
      search,
    );

    const result = data.map((user) => ({
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      isOtpVerified: user.isOtpVerified,
      isAdminApproved: user.isAdminApproved,
      joinedAt: user.joinedAt,
      status: user.status,
    }));

    return {
      users: result,
      totalPages,
      totalUsers: total,
    };
  }
}

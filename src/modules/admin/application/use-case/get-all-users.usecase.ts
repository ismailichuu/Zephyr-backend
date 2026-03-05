import { Inject, Injectable } from '@nestjs/common';
import type { AdminUserRepositoryPort } from '../ports/admin-user-repository.port';
import { ADMIN_USER_REPOSITORY } from '../ports/admin.token';
import { USER_FETCH_SUCCESS } from '../constants/success-message.const';

@Injectable()
export class GetAllUsersUsecase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly _userRepo: AdminUserRepositoryPort,
  ) {}

  async execute(page: number, limit: number, search: string) {
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
      message: USER_FETCH_SUCCESS,
      users: result,
      totalPages,
      totalUser: total,
    };
  }
}

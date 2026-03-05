import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { AdminUserRepositoryPort } from '../ports/admin-user-repository.port';
import { ADMIN_USER_REPOSITORY } from '../ports/admin.token';
import { USER_NOT_EXIST } from '../constants/error-message.const';
import { USER_DETAILS_FETCH_SUCCESS } from '../constants/success-message.const';

@Injectable()
export class GetUserDetailsUsecase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly _userRepository: AdminUserRepositoryPort,
  ) {}

  async execute(userId: string) {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException(USER_NOT_EXIST);
    }

    const userDetails = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      isOtpVerified: user.isOtpVerified,
      isAdminApproved: user.isAdminApproved,
      joinedAt: user.joinedAt,
      status: user.status,
      provider: user.provider,
    };

    return {
      message: USER_DETAILS_FETCH_SUCCESS,
      user: userDetails,
    };
  }
}

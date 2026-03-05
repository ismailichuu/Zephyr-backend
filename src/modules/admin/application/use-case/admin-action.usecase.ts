import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';
import { USER_NOT_EXIST } from '../constants/error-message.const';
import { USER_UPDATE_SUCCESS } from '../constants/success-message.const';
import type { AdminUserRepositoryPort } from '../ports/admin-user-repository.port';
import { ADMIN_USER_REPOSITORY } from '../ports/admin.token';

@Injectable()
export class AdminActionUsecase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly _userRepo: AdminUserRepositoryPort,
  ) {}

  async execute(userId: string, action: UserStatus | 'VERIFY') {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new BadRequestException(USER_NOT_EXIST);

    if (action === 'VERIFY') {
      if (user.isAdminApproved)
        throw new BadRequestException('User is already verified');
      const userUpdated = await this._userRepo.update(userId, {
        isAdminApproved: true,
      });
      return {
        message: USER_UPDATE_SUCCESS,
        isAdminApproved: userUpdated?.isAdminApproved,
      };
    }

    const userUpdated = await this._userRepo.update(userId, { status: action });

    return {
      message: USER_UPDATE_SUCCESS,
      status: userUpdated?.status,
    };
  }
}

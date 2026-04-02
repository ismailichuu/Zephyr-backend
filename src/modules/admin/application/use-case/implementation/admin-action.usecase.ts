import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { USER_NOT_EXIST } from '../../constants/error-message.const';
import type { AdminUserRepositoryPort } from '../../ports/admin-user-repository.port';
import { ADMIN_USER_REPOSITORY } from '../../ports/admin.token';
import { AdminActionInput } from '../../types/admin-action.input';
import { AdminActionOutput } from '../../types/admin-action.output';
import { IAdminActionUsecase } from '../interface/admin-action.usecase.interface';

@Injectable()
export class AdminActionUsecase implements IAdminActionUsecase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly _userRepo: AdminUserRepositoryPort,
  ) {}

  async execute({
    userId,
    action,
  }: AdminActionInput): Promise<AdminActionOutput> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new BadRequestException(USER_NOT_EXIST);

    if (action === 'VERIFY') {
      if (user.isAdminApproved)
        throw new BadRequestException('User is already verified');
      const userUpdated = await this._userRepo.update(userId, {
        isAdminApproved: true,
      });
      return {
        isAdminApproved: userUpdated?.isAdminApproved,
      };
    }

    const userUpdated = await this._userRepo.update(userId, { status: action });

    return {
      status: userUpdated?.status,
    };
  }
}

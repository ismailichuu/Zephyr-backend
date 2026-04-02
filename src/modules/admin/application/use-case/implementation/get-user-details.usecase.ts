import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { AdminUserRepositoryPort } from '../../ports/admin-user-repository.port';
import { ADMIN_USER_REPOSITORY } from '../../ports/admin.token';
import { USER_NOT_EXIST } from '../../constants/error-message.const';
import { GetUserDetailsInput } from '../../types/get-user-details.input';
import { GetUserDetailsOutput } from '../../types/get-user-details.output';
import { IGetUserDetialsUsecase } from '../interface/get-user-details.usecase.interface';

@Injectable()
export class GetUserDetailsUsecase implements IGetUserDetialsUsecase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly _userRepository: AdminUserRepositoryPort,
  ) {}

  async execute({
    userId,
  }: GetUserDetailsInput): Promise<GetUserDetailsOutput> {
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
      user: userDetails,
    };
  }
}

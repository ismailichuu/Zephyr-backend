import { ClientProfile } from 'src/modules/client/domain/entities/client-profile.entity';

export interface IGetProfileUsecase {
  execute(req: Request): Promise<{
    message: string;
    data: {
      profile: ClientProfile;
    };
  }>;
}

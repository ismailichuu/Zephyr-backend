import { GetProfileInput } from '../../types/get-profile.input';
import { GetProfileOutput } from '../../types/get-profile.output';

export interface IGetProfileUsecase {
  execute(dto: GetProfileInput): Promise<GetProfileOutput>;
}

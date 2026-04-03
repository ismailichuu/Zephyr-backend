import { RefreshTokenInput } from '../types/refresh-token.input';
import { RefreshTokenOutput } from '../types/refresh-token.output';

export interface IRefreshTokenUsecase {
  execute(dto: RefreshTokenInput): Promise<RefreshTokenOutput>;
}

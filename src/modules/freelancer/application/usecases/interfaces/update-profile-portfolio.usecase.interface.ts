import { UpdateProfilePortfolioInput } from '../../types/update-profile-portfolio.input';
import { UpdateProfilePortfolioOutput } from '../../types/update-profile-portfolio.output';

export interface IUpdateProfilePortfolioUsecase {
  execute(
    dto: UpdateProfilePortfolioInput,
  ): Promise<UpdateProfilePortfolioOutput | undefined>;
}

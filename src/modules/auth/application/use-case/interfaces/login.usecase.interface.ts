import { LoginInput } from '../types/login.input';
import { LoginOutput } from '../types/login.output';

export interface ILoginUsecase {
  execute(dto: LoginInput): Promise<LoginOutput>;
}

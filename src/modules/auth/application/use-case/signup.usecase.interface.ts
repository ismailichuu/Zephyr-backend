import { SignupInput } from '../types/signup.input';
import { SignupOutput } from '../types/signup.output';

export interface ISignupUsecase {
  execute(dto: SignupInput): Promise<SignupOutput>;
}

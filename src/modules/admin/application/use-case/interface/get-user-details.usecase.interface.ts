import { GetUserDetailsInput } from '../../types/get-user-details.input';
import { GetUserDetailsOutput } from '../../types/get-user-details.output';

export interface IGetUserDetialsUsecase {
  execute(dto: GetUserDetailsInput): Promise<GetUserDetailsOutput>;
}

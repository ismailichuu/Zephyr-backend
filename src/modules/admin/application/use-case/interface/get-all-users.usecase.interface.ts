import { GetAllUsersInput } from '../../types/get-all-users.input';
import { GetAllUsersOutput } from '../../types/get-all-users.output';

export interface IGetAllUsersUsecase {
  execute(dto: GetAllUsersInput): Promise<GetAllUsersOutput>;
}

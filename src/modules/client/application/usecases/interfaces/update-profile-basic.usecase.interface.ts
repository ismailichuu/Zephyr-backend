import { UpdateProfileBasicInput } from '../../types/update-profile-basic.input';
import { UpdateProfileBasicOutput } from '../../types/update-profile-basic.output';

export interface IUpdateProfileBasicUsecase {
  execute(dto: UpdateProfileBasicInput): Promise<UpdateProfileBasicOutput>;
}

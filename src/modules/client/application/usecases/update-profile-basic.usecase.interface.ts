import { UpdateProfileBasicInput } from '../types/update-profile-basic.input';
import { UpdatePrfoleBasicOutput } from '../types/update-profile-basic.output';

export interface IUpdateProfileBasicUsecase {
  execute(dto: UpdateProfileBasicInput): Promise<UpdatePrfoleBasicOutput>;
}

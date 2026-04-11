import { GetSkillsInput } from '../../types/get-skills.input';
import { GetSkillsOutput } from '../../types/get-skills.output';

export interface IGetSkillsUsecase {
  execute(dto: GetSkillsInput): Promise<GetSkillsOutput>;
}

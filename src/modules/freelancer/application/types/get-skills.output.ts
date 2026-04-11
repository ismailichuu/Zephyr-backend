import { Skill } from '../../domain/entities/skill.entity';

export interface GetSkillsOutput {
  skills: Skill[] | [];
}

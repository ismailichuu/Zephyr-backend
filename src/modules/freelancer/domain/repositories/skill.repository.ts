import { Skill } from '../entity/skill.entity';

export abstract class SkillRepository {
  abstract findByCategory(category: string): Promise<Skill[] | []>;
}

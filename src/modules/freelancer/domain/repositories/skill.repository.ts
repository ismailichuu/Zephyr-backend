import { Skill } from '../entities/skill.entity';

export abstract class SkillRepository {
  abstract findByCategory(category: string): Promise<Skill[] | []>;
}

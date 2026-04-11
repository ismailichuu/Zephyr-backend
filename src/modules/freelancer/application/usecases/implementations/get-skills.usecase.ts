import { Injectable } from '@nestjs/common';
import { SkillRepository } from '../../../domain/repositories/skill.repository';
import { Skill } from '../../../domain/entities/skill.entity';
import { GetSkillsInput } from '../../types/get-skills.input';
import { GetSkillsOutput } from '../../types/get-skills.output';
import { IGetSkillsUsecase } from '../interfaces/get-skills.usecase.interface';

@Injectable()
export class GetSkillsUsecase implements IGetSkillsUsecase {
  constructor(private readonly _skillRepo: SkillRepository) {}

  async execute({ category }: GetSkillsInput): Promise<GetSkillsOutput> {
    const skillsDoc = await this._skillRepo.findByCategory(category);
    let skills:
      | {
          id: string;
          name: string;
          categories: string[];
          createdAt: Date | undefined;
        }[]
      | [] = [];
    if (skillsDoc) {
      skills = skillsDoc.map((skill: Skill) => {
        return {
          id: skill.id,
          name: skill.name,
          categories: skill.categories,
          createdAt: skill.createdAt,
        };
      });
    }

    return {
      skills: (skills as Skill[]) ?? [],
    };
  }
}

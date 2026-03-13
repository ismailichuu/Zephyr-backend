import { Injectable } from '@nestjs/common';
import { SkillRepository } from '../../domain/repositories/skill.repository';
import { SKILL_FETCH_SUCCESS } from '../constants/success-message.const';
import { Skill } from '../../domain/entities/skill.entity';

@Injectable()
export class GetSkillsUsecase {
  constructor(private readonly _skillRepo: SkillRepository) {}

  async execute(category: string) {
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
      message: SKILL_FETCH_SUCCESS,
      skills: skills ?? [],
    };
  }
}

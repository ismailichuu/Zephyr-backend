import { Model } from 'mongoose';
import { Skill } from 'src/modules/freelancer/domain/entity/skill.entity';
import { SkillRepository } from 'src/modules/freelancer/domain/repositories/skill.repository';
import { SkillDocument } from './skill.schema';
import { InjectModel } from '@nestjs/mongoose';

export class SkillRepositoryMongo implements SkillRepository {
  constructor(
    @InjectModel('skill')
    private readonly _skillModel: Model<SkillDocument>,
  ) {}

  private _toDomain(skillDoc: SkillDocument): Skill {
    return Skill.create({
      id: skillDoc._id.toString(),
      name: skillDoc.name,
      categories: skillDoc.categories,
      createdAt: skillDoc.createdAt,
    });
  }

  async findByCategory(category: string): Promise<Skill[] | []> {
    const skills = await this._skillModel.find({ categories: category }).exec();

    return skills ? skills.map((skill) => this._toDomain(skill)) : [];
  }
}

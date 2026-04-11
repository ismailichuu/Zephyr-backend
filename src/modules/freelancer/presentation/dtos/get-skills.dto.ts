import { IsString } from 'class-validator';
import { Skill } from '../../domain/entities/skill.entity';

export class GetSkillsRequestDto {
  @IsString()
  category!: string;
}

export class GetSkillResponseDto {
  skills!: Skill[] | [];
}

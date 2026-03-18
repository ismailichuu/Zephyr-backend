import { IsString } from 'class-validator';

export class GetSkillsDto {
  @IsString()
  category: string;
}

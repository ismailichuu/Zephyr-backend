import { Experience } from '../../domain/types/experience.type';

export interface UpdateProfileExperienceInput {
  userId: string;
  experience: Experience[];
}

import { Role } from '../../presentation/dto/signup.dto';

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

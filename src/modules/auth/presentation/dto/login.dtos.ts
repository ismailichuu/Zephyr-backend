import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/modules/user/domain/entities/user.entity';

export class LoginRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString()
  password!: string;
}

export class LoginResponseDto {
  user!: Partial<User>;
}

import bcrypt from 'bcryptjs';
import { PasswordService } from 'src/modules/auth/application/ports/password.service.port';

export class BcryptPasswordService implements PasswordService {
  async hash(plain: string): Promise<string> {
    const salt = 10;
    return await bcrypt.hash(plain, salt);
  }
  async compare(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }
}

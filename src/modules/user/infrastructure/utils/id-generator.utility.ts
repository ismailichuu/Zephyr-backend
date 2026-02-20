import { IdGenerator } from 'src/modules/auth/application/ports/id-generator.port';

export class CryptoIdGenerator implements IdGenerator {
  generateForRole(role: string): string {
    const short = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    const prefix = role === 'FREELANCER' ? 'FRE' : 'CLI';
    return `${prefix}-${short}`;
  }
}

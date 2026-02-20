export interface IdGenerator {
  generateForRole(role: string): string;
}

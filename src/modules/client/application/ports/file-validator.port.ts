export interface FileValidator {
  validate(file: Express.Multer.File): void;
}

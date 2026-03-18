import { BadRequestException } from '@nestjs/common';
import { FileValidator } from '../../application/ports/file-validator.interface';
import {
  FILE_FORMAT_ERROR,
  FILE_NOT_FOUND,
  FILE_SIZE_ERROR,
} from '../../application/constants/error-messages.const';

export class ImageFileValidator implements FileValidator {
  private readonly _allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ];

  private readonly _maxFileSize = 5 * 1024 * 1024;

  validate(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException(FILE_NOT_FOUND);
    }

    if (!this._allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(FILE_FORMAT_ERROR);
    }

    if (file.size > this._maxFileSize) {
      throw new BadRequestException(FILE_SIZE_ERROR);
    }
  }
}

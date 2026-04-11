import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import {
  UploadImageResponse,
  UploadService,
} from '../../application/ports/upload.service';
import { Injectable } from '@nestjs/common';
import { normalizeError } from 'src/common/utils/error-normalizer.util';

@Injectable()
export class CloudinaryUploadService implements UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadImageResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'freelancer-profile',
          public_id: userId,
          overwrite: true,
          invalidate: true,
        },
        (error, result) => {
          if (error || !result) {
            return reject(normalizeError(error));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );
      uploadStream.end(file.buffer);
    });
  }
}

export type UploadImageResponse = {
  url: string;
  publicId: string;
};

export interface UploadService {
  uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadImageResponse>;
}

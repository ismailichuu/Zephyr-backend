export interface UpdateProfileBasicInput {
  userId: string;
  file?: Express.Multer.File;
  name?: string;
  companyName?: string;
  location?: string;
  imageUrl?: string;
}

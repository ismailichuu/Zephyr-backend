interface BasicDetails {
  name?: string;
  imageUrl?: string;
  jobCategory?: string;
  jobSubCategory?: string;
  location?: string;
}

export interface UpdateProfileBasicInput {
  basicDetails: BasicDetails;
  file: Express.Multer.File;
  userId: string;
}

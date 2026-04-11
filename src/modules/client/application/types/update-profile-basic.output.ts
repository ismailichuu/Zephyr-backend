export interface UpdateProfileBasicOutput {
  user?: {
    name?: string;
  };
  profile?: {
    imageUrl?: string;
    location?: string;
    companyName?: string;
  };
}

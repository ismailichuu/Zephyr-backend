export interface GoogleLoginOutput {
  url: string;
  isError: boolean;
  refreshToken?: string;
  accessToken?: string;
}

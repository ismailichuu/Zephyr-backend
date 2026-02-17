export interface GoogleUserPayload {
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

export interface GoogleAuthPort {
  generateAuthUrl(state: string): string;
  getUserFromCode(code: string): Promise<GoogleUserPayload>;
}

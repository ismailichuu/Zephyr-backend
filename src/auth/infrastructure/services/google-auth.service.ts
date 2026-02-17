import { Injectable } from '@nestjs/common';
import {
  GoogleAuthPort,
  GoogleUserPayload,
} from '../../application/ports/google-auth.port';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService implements GoogleAuthPort {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL,
    );
  }

  generateAuthUrl(state: string): string {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      state,
      prompt: 'consent',
    });
  }

  async getUserFromCode(code: string): Promise<GoogleUserPayload> {
    const { tokens } = await this.client.getToken(code);

    if (!tokens.id_token) {
      throw new Error('No ID token returned');
    }

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }

    return {
      email: payload.email,
      name: payload.name || '',
      picture: payload.picture,
      googleId: payload.sub,
    };
  }
}

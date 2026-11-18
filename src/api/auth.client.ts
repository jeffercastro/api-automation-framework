import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async createToken(
    username: string = process.env.API_USERNAME || 'admin',
    password: string = process.env.API_PASSWORD || 'password123'
  ): Promise<string> {
    const response = await this.authenticate(username, password);
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body.token;
  }

  async authenticate(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', {
      data: {
        username,
        password,
      },
    });
  }
}

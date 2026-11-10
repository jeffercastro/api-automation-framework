import { APIRequestContext, expect } from '@playwright/test';

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async createToken(): Promise<string> {
    const response = await this.request.post('/auth', {
      data: {
        username: 'admin',
        password: 'password123',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    return body.token;
  }
}

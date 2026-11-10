import { APIRequestContext, APIResponse } from '@playwright/test';
import { BookingPayload } from '../data/booking.data';

export class BookingClient {
  constructor(private request: APIRequestContext) {}

  async createBooking(data: BookingPayload): Promise<APIResponse> {
    return this.request.post('/booking', { data });
  }

  async getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async updateBooking(id: number, data: BookingPayload, token: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
      data,
    });
  }

  async deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }
}

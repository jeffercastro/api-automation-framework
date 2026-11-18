import { APIRequestContext, APIResponse } from '@playwright/test';
import { BookingPayload } from '../data/booking.data';

export class BookingClient {
  constructor(private request: APIRequestContext) {}

  async createBooking(data: Partial<BookingPayload> | any): Promise<APIResponse> {
    return this.request.post('/booking', { data });
  }

  async getBooking(id: number | string): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async updateBooking(id: number | string, data: Partial<BookingPayload> | any, token?: string): Promise<APIResponse> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Cookie'] = `token=${token}`;
    }
    return this.request.put(`/booking/${id}`, {
      headers,
      data,
    });
  }

  async partialUpdateBooking(id: number | string, data: any, token?: string): Promise<APIResponse> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Cookie'] = `token=${token}`;
    }
    return this.request.patch(`/booking/${id}`, {
      headers,
      data,
    });
  }

  async deleteBooking(id: number | string, token?: string): Promise<APIResponse> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Cookie'] = `token=${token}`;
    }
    return this.request.delete(`/booking/${id}`, {
      headers,
    });
  }
}

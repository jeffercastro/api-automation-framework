import { test, expect } from '@playwright/test';
import { BookingClient } from '../src/api/booking.client';
import { AuthClient } from '../src/api/auth.client';
import { generateBookingData } from '../src/data/booking.data';

test.describe('Booking API - Negative & Boundary Testing', () => {

  test('GET /booking/:id with non-existent ID should return 404 Not Found', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const nonExistentId = 999999999;
    const response = await bookingClient.getBooking(nonExistentId);
    expect(response.status()).toBe(404);
  });

  test('PUT /booking/:id without auth token should return 403 Forbidden', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const seed = generateBookingData();
    const createRes = await bookingClient.createBooking(seed);
    const { bookingid } = await createRes.json();

    const payload = generateBookingData({ firstname: 'Hacker' });
    const response = await bookingClient.updateBooking(bookingid, payload);
    expect(response.status()).toBe(403);

    // Cleanup
    const authClient = new AuthClient(request);
    const token = await authClient.createToken();
    await bookingClient.deleteBooking(bookingid, token);
  });

  test('PUT /booking/:id with invalid token should return 403 Forbidden', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const seed = generateBookingData();
    const createRes = await bookingClient.createBooking(seed);
    const { bookingid } = await createRes.json();

    const payload = generateBookingData({ firstname: 'Hacker' });
    const response = await bookingClient.updateBooking(bookingid, payload, 'invalid_token_12345');
    expect(response.status()).toBe(403);

    // Cleanup
    const authClient = new AuthClient(request);
    const token = await authClient.createToken();
    await bookingClient.deleteBooking(bookingid, token);
  });

  test('DELETE /booking/:id without auth token should return 403 Forbidden', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const seed = generateBookingData();
    const createRes = await bookingClient.createBooking(seed);
    const { bookingid } = await createRes.json();

    const response = await bookingClient.deleteBooking(bookingid);
    expect(response.status()).toBe(403);

    // Cleanup
    const authClient = new AuthClient(request);
    const token = await authClient.createToken();
    await bookingClient.deleteBooking(bookingid, token);
  });

  test('DELETE /booking/:id with invalid token should return 403 Forbidden', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const seed = generateBookingData();
    const createRes = await bookingClient.createBooking(seed);
    const { bookingid } = await createRes.json();

    const response = await bookingClient.deleteBooking(bookingid, 'fake_token_xyz');
    expect(response.status()).toBe(403);

    // Cleanup
    const authClient = new AuthClient(request);
    const token = await authClient.createToken();
    await bookingClient.deleteBooking(bookingid, token);
  });

  test('POST /auth with bad credentials should reject and return reason', async ({ request }) => {
    const authClient = new AuthClient(request);
    const response = await authClient.authenticate('wrong_user', 'wrong_pass');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /booking with empty payload should be rejected with 500 error', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const response = await bookingClient.createBooking({});
    expect(response.status()).toBe(500);
  });
});

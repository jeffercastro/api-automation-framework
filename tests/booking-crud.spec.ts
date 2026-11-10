import { test, expect } from '@playwright/test';
import { BookingClient } from '../src/api/booking.client';
import { AuthClient } from '../src/api/auth.client';
import { generateBookingData } from '../src/data/booking.data';

test.describe('Booking API - End-to-End Chained Flow', () => {
  test('Complete lifecycle: Create -> Read -> Update -> Delete', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    const authClient = new AuthClient(request);

    // 0. AUTHENTICATE
    const token = await authClient.createToken();
    expect(token).toBeTruthy();

    // 1. CREATE
    const initialData = generateBookingData({ firstname: 'Alice', totalprice: 200 });
    const createRes = await bookingClient.createBooking(initialData);
    expect(createRes.status()).toBe(200);

    const createBody = await createRes.json();
    const bookingId = createBody.bookingid;
    expect(bookingId).toBeGreaterThan(0);
    expect(createBody.booking.firstname).toBe('Alice');

    // 2. READ
    const getRes = await bookingClient.getBooking(bookingId);
    expect(getRes.status()).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.firstname).toBe('Alice');
    expect(getBody.totalprice).toBe(200);

    // 3. UPDATE
    const updatedData = generateBookingData({ firstname: 'AliceUpdated', totalprice: 350 });
    const updateRes = await bookingClient.updateBooking(bookingId, updatedData, token);
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.firstname).toBe('AliceUpdated');
    expect(updateBody.totalprice).toBe(350);

    // 4. DELETE
    const deleteRes = await bookingClient.deleteBooking(bookingId, token);
    expect(deleteRes.status()).toBe(201);

    // 5. VERIFY DELETION
    const verifyRes = await bookingClient.getBooking(bookingId);
    expect(verifyRes.status()).toBe(404);
  });
});

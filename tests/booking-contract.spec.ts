import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { BookingClient } from '../src/api/booking.client';
import { generateBookingData } from '../src/data/booking.data';
import { bookingResponseSchema } from '../src/schemas/booking.schema';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateBooking = ajv.compile(bookingResponseSchema);

test.describe('Booking API - Contract & Performance Validation', () => {
  test('GET /booking/:id satisfies JSON Schema contract and SLA < 2000ms', async ({ request }) => {
    const bookingClient = new BookingClient(request);
    
    // Seed
    const newBooking = generateBookingData();
    const createRes = await bookingClient.createBooking(newBooking);
    const { bookingid } = await createRes.json();

    // Query entity measuring response time
    const startTime = Date.now();
    const response = await bookingClient.getBooking(bookingid);
    const duration = Date.now() - startTime;

    // Validate SLA
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);

    // Validate Contract
    const body = await response.json();
    const isValid = validateBooking(body);

    if (!isValid) {
      console.error('Schema errors:', validateBooking.errors);
    }
    expect(isValid).toBe(true);
  });
});

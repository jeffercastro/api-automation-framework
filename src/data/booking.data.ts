export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
}

export const generateBookingData = (overrides?: Partial<BookingPayload>): BookingPayload => ({
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-12-01',
    checkout: '2026-12-10',
  },
  additionalneeds: 'Breakfast',
  ...overrides,
});

export const generateBookingId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VKU-${randomPart}`;
};

export const generateQrToken = (bookingId: string, roomId: string, slotId: string, date: string): string => {
  const payload = {
    app: 'VKU-STUDY-BOOKING',
    bookingId,
    roomId,
    slotId,
    date,
    issuedAt: Date.now(),
  };
  return JSON.stringify(payload);
};

import { Booking } from '../types';
import { TIME_SLOTS } from '../constants';
import { isTimeInSlot } from './dateTime';

export const isSlotConflict = (
  reservations: Booking[],
  roomId: string,
  date: string,
  slotId: string
): boolean => {
  return reservations.some(
    (b) =>
      b.status === 'confirmed' &&
      b.roomId === roomId &&
      b.date === date &&
      b.slotId === slotId
  );
};

export const getBookedSlotsForDate = (
  reservations: Booking[],
  roomId: string,
  date: string
): string[] => {
  return reservations
    .filter((b) => b.status === 'confirmed' && b.roomId === roomId && b.date === date)
    .map((b) => b.slotId);
};

export type RealtimeRoomStatus = 'Available Now' | 'Occupied';

export const getRoomRealtimeStatus = (
  reservations: Booking[],
  roomId: string
): { status: RealtimeRoomStatus; currentBooking?: Booking } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const currentBooking = reservations.find((b) => {
    if (b.status !== 'confirmed' || b.roomId !== roomId || b.date !== todayStr) {
      return false;
    }
    const slot = TIME_SLOTS.find((s) => s.id === b.slotId);
    if (!slot) return false;
    return isTimeInSlot(now, todayStr, slot.startTime, slot.endTime);
  });

  return {
    status: currentBooking ? 'Occupied' : 'Available Now',
    currentBooking,
  };
};

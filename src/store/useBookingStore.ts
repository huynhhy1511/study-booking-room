import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Building, Equipment, FilterState, Room, UserSession } from '../types';
import { SAMPLE_ROOMS } from '../data/rooms';
import { DEFAULT_USER, TIME_SLOTS } from '../constants';
import { generateBookingId, generateQrToken } from '../utils/idGenerator';
import { isSlotConflict } from '../utils/conflict';
import { cancelBookingReminder, scheduleBookingReminder } from '../services/notificationService';

interface BookingStoreState {
  // Session
  user: UserSession;
  setUser: (user: Partial<UserSession>) => void;

  // Rooms Data (Local)
  rooms: Room[];

  // Reservations
  reservations: Booking[];

  // Active Filters
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setBuildingFilter: (building: Building | 'ALL') => void;
  setCapacityFilter: (min: number, max: number) => void;
  toggleEquipmentFilter: (equipment: Equipment) => void;
  resetFilters: () => void;

  // Interactive Selection State
  selectedDate: string; // YYYY-MM-DD
  selectedSlotId: string | null;
  setSelectedDate: (date: string) => void;
  setSelectedSlotId: (slotId: string | null) => void;

  // Core Booking Actions
  createBooking: (roomId: string, date: string, slotId: string, notes?: string) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;

  // Helper selectors
  isSlotUnavailable: (roomId: string, date: string, slotId: string) => boolean;
}

const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initialFilters: FilterState = {
  searchQuery: '',
  building: 'ALL',
  minCapacity: 2,
  maxCapacity: 20,
  equipment: [],
};

// Dữ liệu mẫu khởi tạo ban đầu để demo tính năng Conflict Engine ngay từ lần đầu mở app
const getInitialSeedBookings = (): Booking[] => {
  const today = getTodayDateString();
  return [
    {
      id: 'VKU-SEED-01',
      roomId: 'room-a-101',
      roomName: 'Phòng Hội Thảo Nhóm A.101',
      roomCode: 'A.101',
      building: 'A',
      floor: 1,
      date: today,
      slotId: 'slot-1',
      slotLabel: '07:30 - 09:30',
      startTime: '07:30',
      endTime: '09:30',
      userId: 'usr-vku-999',
      userName: 'Trần Thị Thu Thảo',
      userEmail: 'thaott.21it@vku.udn.vn',
      studentId: '21IT099',
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      qrToken: JSON.stringify({ app: 'VKU-STUDY-BOOKING', bookingId: 'VKU-SEED-01', roomId: 'room-a-101' }),
      notes: 'Họp nhóm nghiên cứu AI',
    },
    {
      id: 'VKU-SEED-02',
      roomId: 'room-b-201',
      roomName: 'Lab AI & Trí Tuệ Nhân Tạo B.201',
      code: 'B.201',
      building: 'B',
      floor: 2,
      date: today,
      slotId: 'slot-3',
      slotLabel: '13:00 - 15:00',
      startTime: '13:00',
      endTime: '15:00',
      userId: 'usr-vku-888',
      userName: 'Lê Hoàng Nam',
      userEmail: 'namlh.21it@vku.udn.vn',
      studentId: '21IT088',
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      qrToken: JSON.stringify({ app: 'VKU-STUDY-BOOKING', bookingId: 'VKU-SEED-02', roomId: 'room-b-201' }),
      notes: 'Thực hành mô hình transformer',
    } as any,
  ];
};

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      setUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      rooms: SAMPLE_ROOMS,
      reservations: getInitialSeedBookings(),

      filters: initialFilters,
      setSearchQuery: (query) =>
        set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
      setBuildingFilter: (building) =>
        set((state) => ({ filters: { ...state.filters, building } })),
      setCapacityFilter: (min, max) =>
        set((state) => ({
          filters: { ...state.filters, minCapacity: min, maxCapacity: max },
        })),
      toggleEquipmentFilter: (item) =>
        set((state) => {
          const current = state.filters.equipment;
          const exists = current.includes(item);
          const updated = exists
            ? current.filter((e) => e !== item)
            : [...current, item];
          return { filters: { ...state.filters, equipment: updated } };
        }),
      resetFilters: () => set({ filters: initialFilters }),

      selectedDate: getTodayDateString(),
      selectedSlotId: null,
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedSlotId: (slotId) => set({ selectedSlotId: slotId }),

      isSlotUnavailable: (roomId, date, slotId) => {
        return isSlotConflict(get().reservations, roomId, date, slotId);
      },

      createBooking: async (roomId, date, slotId, notes) => {
        const { rooms, reservations, user } = get();

        // 1. Kiểm tra conflict
        if (isSlotConflict(reservations, roomId, date, slotId)) {
          return {
            success: false,
            error: 'Khung giờ này đã có sinh viên khác đặt trước. Vui lòng chọn khung giờ khác!',
          };
        }

        const room = rooms.find((r) => r.id === roomId);
        const slot = TIME_SLOTS.find((s) => s.id === slotId);

        if (!room || !slot) {
          return {
            success: false,
            error: 'Thông tin phòng hoặc khung giờ không hợp lệ!',
          };
        }

        const bookingId = generateBookingId();
        const qrToken = generateQrToken(bookingId, room.id, slot.id, date);

        const newBooking: Booking = {
          id: bookingId,
          roomId: room.id,
          roomName: room.name,
          roomCode: room.code,
          building: room.building,
          floor: room.floor,
          date,
          slotId: slot.id,
          slotLabel: slot.label,
          startTime: slot.startTime,
          endTime: slot.endTime,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          studentId: user.studentId,
          createdAt: new Date().toISOString(),
          status: 'confirmed',
          qrToken,
          notes,
        };

        // 2. Schedule local notification 15 phút trước start time
        try {
          const notificationId = await scheduleBookingReminder(newBooking);
          if (notificationId) {
            newBooking.notificationId = notificationId;
          }
        } catch (e) {
          console.warn('Could not schedule notification:', e);
        }

        // 3. Cập nhật state (tức thì, real-time shared state)
        set((state) => ({
          reservations: [newBooking, ...state.reservations],
          selectedSlotId: null, // Reset selection sau khi đặt xong
        }));

        return {
          success: true,
          booking: newBooking,
        };
      },

      cancelBooking: async (bookingId) => {
        const { reservations } = get();
        const booking = reservations.find((b) => b.id === bookingId);

        if (!booking) {
          return { success: false, error: 'Không tìm thấy thông tin đặt phòng!' };
        }

        // 1. Hủy notification đã lập lịch
        if (booking.notificationId) {
          await cancelBookingReminder(booking.notificationId);
        }

        // 2. Cập nhật trạng thái sang cancelled (hoặc giải phóng slot)
        set((state) => ({
          reservations: state.reservations.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          ),
        }));

        return { success: true };
      },
    }),
    {
      name: 'vku_booking_storage_v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        reservations: state.reservations,
        filters: state.filters,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Building, Equipment, FilterState, Room, UserSession } from '../types';
import { SAMPLE_ROOMS } from '../data/rooms';
import { DEFAULT_USER, TIME_SLOTS } from '../constants';
import { generateBookingId, generateQrToken } from '../utils/idGenerator';
import { isSlotConflict } from '../utils/conflict';
import { cancelBookingReminder, scheduleBookingReminder } from '../services/notificationService';
import {
  cancelBookingInSupabase,
  fetchBookingsFromSupabase,
  fetchRoomsFromSupabase,
  insertBookingToSupabase,
  isSupabaseConfigured,
  subscribeToBookingsRealtime,
} from '../services/supabase';

interface BookingStoreState {
  // Session
  user: UserSession;
  setUser: (user: Partial<UserSession>) => void;

  // Rooms Data
  rooms: Room[];

  // Reservations
  reservations: Booking[];

  // Supabase Sync status
  isOnline: boolean;
  initSync: () => Promise<void>;

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
  createBooking: (
    roomId: string,
    date: string,
    slotId: string,
    notes?: string
  ) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
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
      roomCode: 'B.201',
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
      notes: 'Luyện thi đồ án tốt nghiệp',
    },
  ];
};

let realtimeChannelSubscribed = false;

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      setUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      rooms: SAMPLE_ROOMS,
      reservations: getInitialSeedBookings(),
      isOnline: false,

      // Khởi tạo đồng bộ Supabase Backend & Lắng nghe WebSocket Realtime
      initSync: async () => {
        if (!isSupabaseConfigured()) {
          console.log('ℹ️ Supabase not configured in .env. Running in Offline-First Local Mode.');
          return;
        }

        try {
          // 1. Tải danh sách phòng từ Supabase Database
          const remoteRooms = await fetchRoomsFromSupabase();
          if (remoteRooms && remoteRooms.length > 0) {
            set({ rooms: remoteRooms });
          }

          // 2. Tải danh sách các lượt đặt phòng từ Supabase Database
          const remoteBookings = await fetchBookingsFromSupabase();
          if (remoteBookings && remoteBookings.length > 0) {
            // Hợp nhất dữ liệu không trùng lặp
            set((state) => {
              const existingIds = new Set(remoteBookings.map((b) => b.id));
              const localOnly = state.reservations.filter((b) => !existingIds.has(b.id));
              return {
                reservations: [...remoteBookings, ...localOnly],
                isOnline: true,
              };
            });
          } else {
            set({ isOnline: true });
          }

          // 3. Đăng ký WebSocket Realtime (chỉ đăng ký 1 lần duy nhất)
          if (!realtimeChannelSubscribed) {
            realtimeChannelSubscribed = true;
            subscribeToBookingsRealtime(({ eventType, newBooking, oldId }) => {
              console.log(`⚡ [Supabase Realtime] Event: ${eventType}`, newBooking?.id || oldId);

              if (eventType === 'INSERT' && newBooking) {
                set((state) => {
                  const exists = state.reservations.some((b) => b.id === newBooking.id);
                  if (exists) return state;
                  return { reservations: [newBooking, ...state.reservations] };
                });
              } else if (eventType === 'UPDATE' && newBooking) {
                set((state) => ({
                  reservations: state.reservations.map((b) =>
                    b.id === newBooking.id ? newBooking : b
                  ),
                }));
              } else if (eventType === 'DELETE' && oldId) {
                set((state) => ({
                  reservations: state.reservations.filter((b) => b.id !== oldId),
                }));
              }
            });
          }
        } catch (error) {
          console.warn('Supabase initSync error:', error);
        }
      },

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

        // 1. Kiểm tra conflict ở máy khách
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

        // 3. Đẩy lên Supabase Database (với kiểm tra ràng buộc duy nhất chống conflict ở DB)
        const dbResult = await insertBookingToSupabase(newBooking);
        if (!dbResult.success) {
          return {
            success: false,
            error: dbResult.error || 'Lỗi khi lưu đặt phòng vào cơ sở dữ liệu!',
          };
        }

        // 4. Cập nhật state cục bộ
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

        // 1. Cập nhật trạng thái hủy trên Supabase
        const dbResult = await cancelBookingInSupabase(bookingId);
        if (!dbResult.success) {
          console.warn('Supabase cancel update failed:', dbResult.error);
        }

        // 2. Hủy notification đã lập lịch
        if (booking.notificationId) {
          await cancelBookingReminder(booking.notificationId);
        }

        // 3. Cập nhật trạng thái sang cancelled cục bộ
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

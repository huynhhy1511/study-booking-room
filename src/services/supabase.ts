import 'react-native-url-polyfill/auto';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Room, UserSession } from '../types';

// Cấu hình URL và Anon Key từ biến môi trường của Expo (bắt đầu bằng EXPO_PUBLIC_)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.trim().length > 0 &&
    !SUPABASE_URL.includes('your-project-ref') &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.trim().length > 0 &&
    !SUPABASE_ANON_KEY.includes('your-anon-key')
  );
};

// Khởi tạo Supabase Client
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder-project.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

/**
 * 1. Lấy danh sách phòng học từ Supabase
 */
export const fetchRoomsFromSupabase = async (): Promise<Room[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('code', { ascending: true });

    if (error) {
      console.warn('Supabase fetch rooms error:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        building: item.building,
        floor: item.floor,
        capacity: item.capacity,
        equipment: Array.isArray(item.equipment) ? item.equipment : [],
        imageUrl: item.image_url,
        description: item.description,
        type: item.type,
      }));
    }
    return null;
  } catch (err) {
    console.warn('Network error fetching rooms from Supabase:', err);
    return null;
  }
};

/**
 * 2. Lấy danh sách toàn bộ các lịch đặt phòng từ Supabase
 */
export const fetchBookingsFromSupabase = async (): Promise<Booking[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch bookings error:', error.message);
      return null;
    }

    if (data) {
      return data.map((b: any) => ({
        id: b.id,
        roomId: b.room_id,
        roomName: b.room_name,
        roomCode: b.room_code,
        building: b.building,
        floor: b.floor,
        date: b.date,
        slotId: b.slot_id,
        slotLabel: b.slot_label,
        startTime: b.start_time,
        endTime: b.end_time,
        userId: b.user_id,
        userName: b.user_name,
        userEmail: b.user_email,
        studentId: b.student_id,
        createdAt: b.created_at,
        status: b.status,
        qrToken: b.qr_token,
        notes: b.notes || undefined,
        notificationId: b.notification_id || undefined,
      }));
    }
    return null;
  } catch (err) {
    console.warn('Network error fetching bookings from Supabase:', err);
    return null;
  }
};

/**
 * 3. Tạo đặt phòng mới trên Supabase Database
 * Nhờ có Unique Index: UNIQUE(room_id, date, slot_id) WHERE status = 'confirmed',
 * nếu có 2 sinh viên bấm cùng lúc, Supabase sẽ tự động chặn sinh viên thứ 2 (lỗi code 23505).
 */
export const insertBookingToSupabase = async (
  booking: Booking
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true }; // Fallback offline mode
  }

  try {
    const row = {
      id: booking.id,
      room_id: booking.roomId,
      room_name: booking.roomName,
      room_code: booking.roomCode,
      building: booking.building,
      floor: booking.floor,
      date: booking.date,
      slot_id: booking.slotId,
      slot_label: booking.slotLabel,
      start_time: booking.startTime,
      end_time: booking.endTime,
      user_id: booking.userId,
      user_name: booking.userName,
      user_email: booking.userEmail,
      student_id: booking.studentId,
      created_at: booking.createdAt,
      status: booking.status,
      qr_token: booking.qrToken,
      notes: booking.notes || null,
      notification_id: booking.notificationId || null,
    };

    const { error } = await supabase.from('bookings').insert([row]);

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Khung giờ này vừa có sinh viên khác đăng ký thành công trên hệ thống!',
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi kết nối cơ sở dữ liệu Supabase.' };
  }
};

/**
 * 4. Hủy đặt phòng trên Supabase Database
 */
export const cancelBookingInSupabase = async (
  bookingId: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true }; // Fallback offline mode
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi cập nhật trạng thái hủy.' };
  }
};

/**
 * 5. Lắng nghe thay đổi Realtime từ Supabase (WebSocket)
 * Khi bất kỳ ai đặt phòng hay hủy phòng ở máy khác, máy này lập tức nhận được event
 * và cập nhật giao diện trong 0.1 giây mà không cần F5!
 */
export const subscribeToBookingsRealtime = (
  onChange: (payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE'; newBooking?: Booking; oldId?: string }) => void
): RealtimeChannel | null => {
  if (!isSupabaseConfigured()) return null;

  try {
    const channel = supabase
      .channel('vku-study-room-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload: any) => {
          const { eventType, new: newRow, old: oldRow } = payload;

          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            const formatted: Booking = {
              id: newRow.id,
              roomId: newRow.room_id,
              roomName: newRow.room_name,
              roomCode: newRow.room_code,
              building: newRow.building,
              floor: newRow.floor,
              date: newRow.date,
              slotId: newRow.slot_id,
              slotLabel: newRow.slot_label,
              startTime: newRow.start_time,
              endTime: newRow.end_time,
              userId: newRow.user_id,
              userName: newRow.user_name,
              userEmail: newRow.user_email,
              studentId: newRow.student_id,
              createdAt: newRow.created_at,
              status: newRow.status,
              qrToken: newRow.qr_token,
              notes: newRow.notes || undefined,
              notificationId: newRow.notification_id || undefined,
            };
            onChange({ eventType, newBooking: formatted });
          } else if (eventType === 'DELETE') {
            onChange({ eventType: 'DELETE', oldId: oldRow?.id });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('⚡ Connected to Supabase Realtime WebSocket successfully!');
        }
      });

    return channel;
  } catch (e) {
    console.warn('Realtime subscription error:', e);
    return null;
  }
};

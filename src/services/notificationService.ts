import { Platform } from 'react-native';
import { Booking } from '../types';
import { parseSlotToDate } from '../utils/dateTime';

// Dynamic safe loading để tương thích 100% với Expo Go (SDK 53+ không hỗ trợ native push modules)
// và hoạt động đầy đủ khi build APK với EAS Build
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  console.log('expo-notifications native module not available in current environment:', e);
}

// Cấu hình cách hiển thị thông báo khi app đang mở
if (Notifications && Notifications.setNotificationHandler) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.log('Notification handler setup skipped:', e);
  }
}

/**
 * Xin quyền gửi thông báo cục bộ
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!Notifications || Platform.OS === 'web') return false;

  try {
    if (!Notifications.getPermissionsAsync) return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted' && Notifications.requestPermissionsAsync) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android' && Notifications.setNotificationChannelAsync) {
      await Notifications.setNotificationChannelAsync('booking-reminders', {
        name: 'Nhắc nhở nhận phòng VKU',
        importance: Notifications.AndroidImportance?.HIGH ?? 4,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1E40AF',
      });
    }

    return true;
  } catch (error) {
    console.warn('Notification permission request error:', error);
    return false;
  }
};

/**
 * Lập lịch thông báo trước 15 phút so với giờ bắt đầu của slot
 */
export const scheduleBookingReminder = async (booking: Booking): Promise<string | undefined> => {
  if (!Notifications) {
    console.log(`[Notification Service] Local notification simulated for ${booking.roomCode} at ${booking.startTime}`);
    return `sim-notif-${Date.now()}`;
  }

  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('Notification permission not granted, skipping schedule');
      return undefined;
    }

    const slotStartDate = parseSlotToDate(booking.date, booking.startTime);
    const reminderTime = new Date(slotStartDate.getTime() - 15 * 60 * 1000);
    const now = new Date();

    let triggerDate: Date;
    if (reminderTime > now) {
      triggerDate = reminderTime;
    } else if (slotStartDate > now) {
      // Nếu đặt sát giờ (< 15 phút), báo sau 10 giây
      triggerDate = new Date(now.getTime() + 10 * 1000);
    } else {
      // Khung giờ đã qua
      return undefined;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔔 Sắp đến giờ nhận phòng: ${booking.roomCode}`,
        body: `Phòng ${booking.roomName} bắt đầu lúc ${booking.startTime}. Vui lòng mở thẻ QR Pass để check-in!`,
        data: { bookingId: booking.id, roomId: booking.roomId },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes?.DATE ?? 'date',
        date: triggerDate,
        channelId: Platform.OS === 'android' ? 'booking-reminders' : undefined,
      },
    });

    console.log(`Notification scheduled for booking ${booking.id}: ID ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.warn('Failed to schedule notification:', error);
    return undefined;
  }
};

/**
 * Hủy thông báo khi người dùng hủy đặt phòng
 */
export const cancelBookingReminder = async (notificationId?: string): Promise<void> => {
  if (!notificationId || !Notifications || !Notifications.cancelScheduledNotificationAsync) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Cancelled scheduled notification: ${notificationId}`);
  } catch (error) {
    console.warn(`Failed to cancel notification ${notificationId}:`, error);
  }
};

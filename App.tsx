import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { requestNotificationPermission } from './src/services/notificationService';
import { colors } from './src/theme';

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width > 520;

  useEffect(() => {
    // Xin quyền thông báo
    requestNotificationPermission().catch((err) => {
      console.log('Permission init notice:', err);
    });

    // Tinh chỉnh CSS cho Web để thao tác chuột mượt mà và ẩn thanh cuộn thô kệch
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'vku-web-enhancements';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          body {
            background-color: #07111F;
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          * {
            -webkit-tap-highlight-color: transparent;
            outline: none;
          }
          button, [role="button"], a {
            cursor: pointer !important;
          }
          /* Ẩn thanh cuộn thô trên web để giữ trọn vẹn giao diện mobile */
          ::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            background: transparent;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDesktopWeb ? 'light' : 'dark'} />

      {isDesktopWeb ? (
        // Giao diện Khung Điện Thoại Cao Cấp (Phone Frame Simulator) khi xem trên máy tính
        <View style={styles.webDesktopBackground}>
          {/* Header giới thiệu trên Desktop */}
          <View style={styles.desktopHeader}>
            <View style={styles.badgeLive}>
              <View style={styles.liveDot} />
              <Text style={styles.badgeText}>VKU MOBILE APP PREVIEW</Text>
            </View>
            <Text style={styles.desktopTitle}>VKU Smart Study Room Booking</Text>
            <Text style={styles.desktopSubtitle}>
              Chế độ mô phỏng điện thoại di động • Sử dụng chuột để vuốt chạm và trải nghiệm
            </Text>
          </View>

          {/* Phone Mockup Body */}
          <View style={styles.phoneMockupContainer}>
            {/* Dynamic Island / Loa trên điện thoại */}
            <View style={styles.phoneDynamicIsland} />

            {/* Khung viền màn hình App */}
            <View style={styles.phoneScreen}>
              <AppNavigator />
            </View>

            {/* Home Indicator Bar ở đáy màn hình điện thoại */}
            <View style={styles.homeIndicator} />
          </View>
        </View>
      ) : (
        // Giao diện Full Màn Hình khi xem trên điện thoại thật
        <View style={styles.nativeContainer}>
          <AppNavigator />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  webDesktopBackground: {
    flex: 1,
    backgroundColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  desktopHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: 'rgba(37, 99, 235, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
    marginBottom: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  desktopTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  desktopSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  phoneMockupContainer: {
    width: 395,
    height: 790,
    maxHeight: '86vh' as any,
    backgroundColor: '#1E293B',
    borderRadius: 44,
    padding: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.55,
    shadowRadius: 32,
    borderWidth: 3,
    borderColor: '#334155',
  },
  phoneDynamicIsland: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    width: 96,
    height: 22,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    zIndex: 9999,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 36,
    overflow: 'hidden',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 2,
    zIndex: 9999,
  },
});

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { requestNotificationPermission } from './src/services/notificationService';
import { useBookingStore } from './src/store/useBookingStore';

export default function App() {
  useEffect(() => {
    // 1. Khởi tạo đồng bộ Supabase Backend & WebSocket Realtime
    useBookingStore.getState().initSync();

    // 2. Xin quyền thông báo
    requestNotificationPermission().catch((err) => {
      console.log('Permission init notice:', err);
    });

    // Tinh chỉnh CSS cho Web để tương tác chuột chuẩn và hiển thị typography mượt mà
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'vku-web-enhancements';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          html, body, #root {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #F8FAFC;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          button, [role="button"], a {
            cursor: pointer !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});

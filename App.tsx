import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { requestNotificationPermission } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    // Xin quyền thông báo nhẹ nhàng khi khởi động app
    requestNotificationPermission().catch((err) => {
      console.log('Permission init notice:', err);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from './BrandLogo';
import { useBookingStore } from '../store/useBookingStore';
import { colors, typography, spacing, shadows } from '../theme';

export const DesktopHeader: React.FC = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useBookingStore((state) => state.user);

  // Chỉ hiển thị trên màn hình máy tính (tablet/desktop >= 768px)
  if (width < 768) return null;

  const currentTab = route.name;

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.container}>
        {/* Left: Brand Logo & Title */}
        <TouchableOpacity
          style={styles.brandRow}
          onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
          activeOpacity={0.8}
        >
          <BrandLogo size={36} />
          <View>
            <Text style={styles.brandTitle}>VKU Study Room</Text>
            <Text style={styles.brandSubtitle}>Smart Campus Booking</Text>
          </View>
        </TouchableOpacity>

        {/* Center: Navigation Links */}
        <View style={styles.navLinks}>
          <TouchableOpacity
            style={[styles.navItem, currentTab === 'HomeTab' && styles.navItemActive]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
            activeOpacity={0.7}
          >
            <Ionicons
              name={currentTab === 'HomeTab' ? 'home' : 'home-outline'}
              size={18}
              color={currentTab === 'HomeTab' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.navText,
                currentTab === 'HomeTab' && styles.navTextActive,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentTab === 'BookingsTab' && styles.navItemActive]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'BookingsTab' })}
            activeOpacity={0.7}
          >
            <Ionicons
              name={currentTab === 'BookingsTab' ? 'receipt' : 'receipt-outline'}
              size={18}
              color={currentTab === 'BookingsTab' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.navText,
                currentTab === 'BookingsTab' && styles.navTextActive,
              ]}
            >
              My booking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentTab === 'NotificationsTab' && styles.navItemActive]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'NotificationsTab' })}
            activeOpacity={0.7}
          >
            <View style={{ position: 'relative' }}>
              <Ionicons
                name={currentTab === 'NotificationsTab' ? 'notifications' : 'notifications-outline'}
                size={18}
                color={currentTab === 'NotificationsTab' ? colors.primary : colors.textSecondary}
              />
              <View style={styles.notifDot} />
            </View>
            <Text
              style={[
                styles.navText,
                currentTab === 'NotificationsTab' && styles.navTextActive,
              ]}
            >
              Notification
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentTab === 'ProfileTab' && styles.navItemActive]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
            activeOpacity={0.7}
          >
            <Ionicons
              name={currentTab === 'ProfileTab' ? 'person' : 'person-outline'}
              size={18}
              color={currentTab === 'ProfileTab' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.navText,
                currentTab === 'ProfileTab' && styles.navTextActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right: User Session Profile Badge */}
        <TouchableOpacity
          style={styles.userBadge}
          onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
          activeOpacity={0.8}
        >
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={16} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userCode}>{user.studentId} • VKU</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...shadows.subtle,
    zIndex: 100,
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    height: 64,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
  },
  brandSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: colors.primaryLight,
  },
  navText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  notifDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  userCode: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useBookingStore } from '../store/useBookingStore';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useBookingStore((state) => state.user);

  const handleNotifications = () => {
    Alert.alert(
      'Notifications Settings',
      'Reminder alerts are automatically scheduled 15 minutes before your booked slot starts via expo-notifications.'
    );
  };

  const handleBookingHistory = () => {
    navigation.navigate('BookingsTab');
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'VKU Study Room Booking Rules:\n\n• Please present your digital QR pass at the room entrance.\n• Maintain quiet study hours.\n• Turn off electronic equipment before leaving.'
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About VKU Study Room App',
      'VKU Study Room Booking v1.0.0\nDeveloped for Vietnam - Korea University of Information and Communication Technology (VKU).'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Session Ended', 'You have been logged out.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Screen Title */}
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={36} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userSubtitle}>
            {user.studentId} • VKU Student
          </Text>
          <Text style={styles.departmentText}>{user.department}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleNotifications}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrapper}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuTitle}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleBookingHistory}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrapper}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuTitle}>Booking history</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleHelp}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrapper}>
              <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuTitle}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleAbout}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrapper}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuTitle}>About</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutBtnText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollBody: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  titleRow: {
    marginBottom: spacing.md,
  },
  screenTitle: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  departmentText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    minHeight: 52, // 52px touch target
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.button,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  logoutBtn: {
    minHeight: 48,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
});

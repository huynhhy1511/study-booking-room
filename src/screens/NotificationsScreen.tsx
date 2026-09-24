import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { formatDateDisplay } from '../utils/dateTime';
import { EmptyState } from '../components/EmptyState';
import { DesktopHeader } from '../components/DesktopHeader';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

export const NotificationsScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const reservations = useBookingStore((state) => state.reservations);
  const activeBookings = reservations.filter((b) => b.status === 'confirmed');

  return (
    <SafeAreaView style={styles.safeArea}>
      {isDesktop && <DesktopHeader />}

      <View style={styles.responsiveWrapper}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Notifications</Text>
          <Text style={styles.screenSubtitle}>
            Check-in reminders & campus study alerts
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {activeBookings.length === 0 ? (
            <EmptyState
              icon="notifications-outline"
              title="No new notifications"
              description="When you reserve a study room, reminder notifications will appear here 15 minutes before your time slot."
            />
          ) : (
            activeBookings.map((b) => (
              <View key={b.id} style={styles.notificationCard}>
                <View style={styles.iconCircle}>
                  <Ionicons name="notifications" size={20} color={colors.primary} />
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notifTitle}>Upcoming Check-in Reminder</Text>
                    <View style={styles.unreadDot} />
                  </View>

                  <Text style={styles.notifBody}>
                    Room {b.roomCode} ({b.roomName}) is scheduled for {b.slotLabel} on {formatDateDisplay(b.date)}.
                  </Text>

                  <Text style={styles.notifFooter}>
                    Ticket: {b.id} • Reminder set 15m before start
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  responsiveWrapper: {
    flex: 1,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  screenTitle: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.navy,
  },
  screenSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollBody: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...shadows.subtle,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.navy,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.badgeRed,
  },
  notifBody: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  notifFooter: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
});

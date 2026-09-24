import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { Booking } from '../types';
import { formatDateDisplay } from '../utils/dateTime';
import { QRPassModal } from '../components/QRPassModal';
import { EmptyState } from '../components/EmptyState';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

export const MyReservationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const reservations = useBookingStore((state) => state.reservations);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);

  const displayedReservations = useMemo(() => {
    return reservations.filter((b) =>
      activeTab === 'upcoming' ? b.status === 'confirmed' : b.status === 'cancelled'
    );
  }, [reservations, activeTab]);

  const handleCancelPress = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your reservation for room ${booking.roomCode} on ${booking.date} (${booking.slotLabel})?\n\nThis time slot will be immediately freed for other students.`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelBooking(booking.id);
            if (result.success) {
              Alert.alert('Booking Cancelled', 'Your reservation has been cancelled and the slot is now freed.');
            } else {
              Alert.alert('Error', result.error || 'Failed to cancel reservation.');
            }
          },
        },
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isConfirmed = item.status === 'confirmed';

    return (
      <View style={styles.bookingCard}>
        {/* Room & Building */}
        <Text style={styles.roomCode}>{item.roomCode}</Text>
        <Text style={styles.roomName}>{item.roomName}</Text>
        <Text style={styles.location}>
          Building {item.building} • Floor {item.floor}
        </Text>

        <View style={styles.divider} />

        {/* Date & Time */}
        <View style={styles.timeBlock}>
          <Text style={styles.dateText}>{formatDateDisplay(item.date)}</Text>
          <Text style={styles.slotText}>{item.slotLabel}</Text>
        </View>

        {/* Status Indicator (Accessible) */}
        <View style={styles.statusRow}>
          {isConfirmed ? (
            <View style={styles.statusPillConfirmed}>
              <View style={styles.dotGreen} />
              <Text style={styles.statusTextConfirmed}>CONFIRMED</Text>
            </View>
          ) : (
            <View style={styles.statusPillCancelled}>
              <Ionicons name="close-circle" size={12} color={colors.dangerText} />
              <Text style={styles.statusTextCancelled}>CANCELLED</Text>
            </View>
          )}

          <Text style={styles.bookingIdText}>{item.id}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.qrBtn}
            onPress={() => setSelectedBookingForQR(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code-outline" size={16} color={colors.primary} />
            <Text style={styles.qrBtnText}>QR Pass</Text>
          </TouchableOpacity>

          {isConfirmed && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancelPress(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Title */}
      <View style={styles.topHeader}>
        <Text style={styles.screenTitle}>My Bookings</Text>
      </View>

      {/* Segmented Control Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'upcoming' && styles.tabItemActive]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.tabTextActive,
            ]}
          >
            Upcoming (
            {reservations.filter((b) => b.status === 'confirmed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'past' && styles.tabItemActive]}
          onPress={() => setActiveTab('past')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.tabTextActive,
            ]}
          >
            Past (
            {reservations.filter((b) => b.status === 'cancelled').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={displayedReservations}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={activeTab === 'upcoming' ? 'calendar-outline' : 'archive-outline'}
            title={
              activeTab === 'upcoming'
                ? 'No upcoming reservations'
                : 'No past booking history'
            }
            description={
              activeTab === 'upcoming'
                ? 'Find a study room on the Home tab to schedule your next session.'
                : 'Your cancelled or past reservations will appear here.'
            }
            actionText={activeTab === 'upcoming' ? 'Explore Rooms' : undefined}
            onAction={
              activeTab === 'upcoming'
                ? () => navigation.navigate('HomeTab')
                : undefined
            }
          />
        }
      />

      {/* QR Pass Modal */}
      <QRPassModal
        visible={!!selectedBookingForQR}
        booking={selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  screenTitle: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minHeight: 44, // Touch target
  },
  tabItemActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  bookingCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  roomCode: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  roomName: {
    fontSize: typography.sizes.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  location: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  timeBlock: {
    gap: 2,
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  slotText: {
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusPillConfirmed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.chip,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusTextConfirmed: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.successText,
    letterSpacing: 0.5,
  },
  statusPillCancelled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.chip,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  statusTextCancelled: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.dangerText,
    letterSpacing: 0.5,
  },
  bookingIdText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  qrBtn: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: borderRadius.button,
    backgroundColor: colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  qrBtnText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  cancelBtn: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: borderRadius.button,
    backgroundColor: colors.dangerLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cancelBtnText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { TIME_SLOTS } from '../constants';
import { formatDateDisplay } from '../utils/dateTime';
import { DesktopHeader } from '../components/DesktopHeader';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

export const BookingConfirmationScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { roomId, date, slotId } = route.params;

  const rooms = useBookingStore((state) => state.rooms);
  const user = useBookingStore((state) => state.user);
  const createBooking = useBookingStore((state) => state.createBooking);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const room = rooms.find((r) => r.id === roomId);
  const slot = TIME_SLOTS.find((s) => s.id === slotId);

  if (!room || !slot) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text>Invalid booking request!</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const result = await createBooking(room.id, date, slot.id, notes);
      setIsSubmitting(false);

      if (result.success && result.booking) {
        navigation.replace('BookingSuccess', { booking: result.booking });
      } else {
        Alert.alert('Booking Error', result.error || 'Unable to confirm booking.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      Alert.alert('Error', err.message || 'Failed to process booking.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Desktop Header on wide screens */}
      {isDesktop && <DesktopHeader />}

      {/* Top Header */}
      <View style={styles.navBarWrapper}>
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.navy} />
            <Text style={styles.navTitle}>Review Booking</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollBody,
          isDesktop && styles.scrollBodyDesktop,
        ]}
      >
        <View style={isDesktop ? styles.desktopCardWrapper : undefined}>
          {/* Review Card */}
          <View style={styles.reviewCard}>
            <Text style={styles.roomCode}>{room.code}</Text>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.location}>
              Building {room.building} • Floor {room.floor}
            </Text>

            <View style={styles.divider} />

            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{formatDateDisplay(date)}</Text>
            </View>

            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Time</Text>
              <Text style={styles.metaValueHighlight}>{slot.label}</Text>
            </View>

            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>2 hours</Text>
            </View>

            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Reminder</Text>
              <View style={styles.reminderRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.reminderText}>15 minutes before slot starts</Text>
              </View>
            </View>
          </View>

          {/* Student Session Card */}
          <View style={styles.studentCard}>
            <Text style={styles.cardHeaderTitle}>Student Information</Text>

            <View style={styles.studentRow}>
              <Text style={styles.studentLabel}>Full name:</Text>
              <Text style={styles.studentVal}>{user.name}</Text>
            </View>

            <View style={styles.studentRow}>
              <Text style={styles.studentLabel}>Student ID:</Text>
              <Text style={styles.studentVal}>{user.studentId}</Text>
            </View>

            <View style={styles.studentRow}>
              <Text style={styles.studentLabel}>Email:</Text>
              <Text style={styles.studentVal}>{user.email}</Text>
            </View>
          </View>

          {/* Notes (Optional) */}
          <View style={styles.notesCard}>
            <Text style={styles.cardHeaderTitle}>Purpose of Booking (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Capstone project team meeting, seminar rehearsal..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Confirm Button for Desktop view */}
          {isDesktop && (
            <TouchableOpacity
              style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={isSubmitting}
              activeOpacity={0.88}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.textWhite} />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm Booking</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Confirm Button for Mobile */}
      {!isDesktop && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={isSubmitting}
            activeOpacity={0.88}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.textWhite} />
            ) : (
              <Text style={styles.confirmBtnText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarWrapper: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  navBar: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  navTitle: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.navy,
  },
  scrollBody: {
    padding: spacing.lg,
    paddingBottom: 110,
  },
  scrollBodyDesktop: {
    paddingBottom: 60,
  },
  desktopCardWrapper: {
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.card,
    marginBottom: spacing.md,
  },
  roomCode: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.navy,
  },
  roomName: {
    fontSize: typography.sizes.body,
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
    backgroundColor: '#E2E8F0',
    marginVertical: spacing.md,
  },
  metaBlock: {
    marginBottom: spacing.md,
  },
  metaLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semiBold,
    color: colors.text,
  },
  metaValueHighlight: {
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  reminderText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.medium,
    color: colors.successText,
  },
  studentCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  cardHeaderTitle: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  studentLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  studentVal: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semiBold,
    color: colors.text,
  },
  notesCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  notesInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.input,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: typography.sizes.bodySm,
    color: colors.text,
    textAlignVertical: 'top',
    minHeight: 64,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...shadows.card,
  },
  confirmBtn: {
    height: 50,
    backgroundColor: colors.navy,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  confirmBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
});

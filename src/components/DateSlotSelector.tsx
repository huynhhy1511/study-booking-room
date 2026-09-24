import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNext7Days, DayItem } from '../utils/dateTime';
import { TIME_SLOTS } from '../constants';
import { TimeSlot } from '../types';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

interface DateSlotSelectorProps {
  roomId: string;
  selectedDate: string;
  selectedSlotId: string | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slotId: string) => void;
  isSlotUnavailable: (roomId: string, date: string, slotId: string) => boolean;
}

export const DateSlotSelector: React.FC<DateSlotSelectorProps> = ({
  roomId,
  selectedDate,
  selectedSlotId,
  onSelectDate,
  onSelectSlot,
  isSlotUnavailable,
}) => {
  const days = useMemo(() => getNext7Days(), []);

  return (
    <View style={styles.container}>
      {/* 1. Date Selector (Clean Campus Card style) */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Select Date</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysScroll}
      >
        {days.map((item: DayItem) => {
          const isSelected = selectedDate === item.dateString;
          return (
            <TouchableOpacity
              key={item.dateString}
              activeOpacity={0.7}
              onPress={() => onSelectDate(item.dateString)}
              style={[
                styles.dayCard,
                isSelected && styles.dayCardSelected,
              ]}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelected && styles.dayNameSelected,
                ]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberSelected,
                ]}
              >
                {item.dayNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 2. Available Time Slots (Discrete 2-hour slots) */}
      <View style={[styles.headerRow, { marginTop: spacing.xl }]}>
        <Text style={styles.sectionTitle}>Available Time</Text>
      </View>

      <View style={styles.slotsList}>
        {TIME_SLOTS.map((slot: TimeSlot) => {
          const isBooked = isSlotUnavailable(roomId, selectedDate, slot.id);
          const isSelected = selectedSlotId === slot.id;

          return (
            <TouchableOpacity
              key={slot.id}
              activeOpacity={0.7}
              disabled={isBooked}
              onPress={() => onSelectSlot(slot.id)}
              style={[
                styles.slotCard,
                isSelected && styles.slotCardSelected,
                isBooked && styles.slotCardBooked,
              ]}
            >
              <View style={styles.slotInfo}>
                <Text
                  style={[
                    styles.slotTimeText,
                    isSelected && styles.slotTimeTextSelected,
                    isBooked && styles.slotTimeTextBooked,
                  ]}
                >
                  {slot.label}
                </Text>

                {/* Accessible Dual-Coding Status (Icon + Text) */}
                {isBooked ? (
                  <View style={styles.statusRow}>
                    <Ionicons name="lock-closed" size={14} color={colors.danger} />
                    <Text style={styles.bookedStatusText}>Booked</Text>
                  </View>
                ) : isSelected ? (
                  <View style={styles.statusRow}>
                    <Ionicons name="checkmark-done" size={16} color={colors.primary} />
                    <Text style={styles.selectedStatusText}>Selected</Text>
                  </View>
                ) : (
                  <View style={styles.statusRow}>
                    <Ionicons name="checkmark" size={14} color={colors.success} />
                    <Text style={styles.availableStatusText}>Available</Text>
                  </View>
                )}
              </View>

              {/* Right Indicator Icon */}
              <View style={styles.slotRightIcon}>
                {isBooked ? (
                  <Ionicons name="lock-closed-outline" size={20} color={colors.danger} />
                ) : isSelected ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                ) : (
                  <Ionicons name="ellipse-outline" size={20} color={colors.borderDark} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  headerRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  daysScroll: {
    paddingHorizontal: spacing.lg,
    gap: 10,
    paddingVertical: 4,
  },
  dayCard: {
    width: 62,
    height: 78,
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  dayCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: typography.weights.semiBold,
  },
  dayNumber: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  dayNumberSelected: {
    color: colors.textWhite,
  },
  slotsList: {
    paddingHorizontal: spacing.lg,
    gap: 10,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 64, // Touch target
    ...shadows.subtle,
  },
  slotCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  slotCardBooked: {
    backgroundColor: colors.disabledBg,
    borderColor: colors.border,
  },
  slotInfo: {
    gap: 4,
  },
  slotTimeText: {
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  slotTimeTextSelected: {
    color: colors.primary,
  },
  slotTimeTextBooked: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableStatusText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semiBold,
    color: colors.success,
  },
  selectedStatusText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  bookedStatusText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
  slotRightIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

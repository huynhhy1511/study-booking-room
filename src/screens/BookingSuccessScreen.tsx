import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types';
import { formatDateDisplay } from '../utils/dateTime';
import { QRPassModal } from '../components/QRPassModal';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

export const BookingSuccessScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const booking: Booking = route.params?.booking;

  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  if (!booking) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text>Booking information not found!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}>
          <Text style={{ color: colors.primary, marginTop: 10 }}>Return to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={36} color={colors.textWhite} />
        </View>

        <Text style={styles.title}>Booking Confirmed</Text>

        <Text style={styles.roomCode}>{booking.roomCode}</Text>
        <Text style={styles.location}>
          Building {booking.building} • Floor {booking.floor}
        </Text>

        <Text style={styles.dateTime}>
          {formatDateDisplay(booking.date)}
        </Text>
        <Text style={styles.timeSlot}>{booking.slotLabel}</Text>

        {/* Booking ID */}
        <View style={styles.idBox}>
          <Text style={styles.idLabel}>Booking ID</Text>
          <Text style={styles.idText}>{booking.id}</Text>
        </View>

        {/* Embedded QR Code Card directly on the screen */}
        <View style={styles.qrCard}>
          <QRCode
            value={booking.qrToken || booking.id}
            size={180}
            color={colors.text}
            backgroundColor="#FFFFFF"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setIsQRModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="expand-outline" size={18} color={colors.textWhite} />
            <Text style={styles.qrButtonText}>View Full QR Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'BookingsTab' })}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>View My Bookings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* QR Pass Modal */}
      <QRPassModal
        visible={isQRModalVisible}
        booking={booking}
        onClose={() => setIsQRModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  roomCode: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  location: {
    fontSize: typography.sizes.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  dateTime: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  timeSlot: {
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  idBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  idText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  qrCard: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    marginBottom: spacing.xl,
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  qrButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrButtonText: {
    color: colors.textWhite,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  secondaryButton: {
    height: 48,
    backgroundColor: colors.card,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semiBold,
  },
});

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types';
import { formatDateDisplay } from '../utils/dateTime';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

interface QRPassModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const QRPassModal: React.FC<QRPassModalProps> = ({
  visible,
  booking,
  onClose,
}) => {
  if (!booking) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerSubtitle}>DIGITAL PASS</Text>
              <Text style={styles.headerTitle}>VKU Smart Campus Pass</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Booking Pass Header Badge */}
            <View style={styles.passHeader}>
              <View style={styles.passCodeBadge}>
                <Ionicons name="ticket-outline" size={16} color={colors.primary} />
                <Text style={styles.passCodeText}>{booking.id}</Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  booking.status === 'confirmed'
                    ? styles.statusPillActive
                    : styles.statusPillCancelled,
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    booking.status === 'confirmed'
                      ? styles.statusTextActive
                      : styles.statusTextCancelled,
                  ]}
                >
                  {booking.status === 'confirmed' ? 'CONFIRMED' : 'CANCELLED'}
                </Text>
              </View>
            </View>

            {/* QR Code Container */}
            <View style={styles.qrContainer}>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={booking.qrToken || booking.id}
                  size={190}
                  color={booking.status === 'confirmed' ? colors.text : colors.textMuted}
                  backgroundColor="#FFFFFF"
                />
              </View>
              <Text style={styles.qrInstruction}>
                Scan this code at the door reader or present to the room supervisor
              </Text>
            </View>

            {/* Ticket Details */}
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Room:</Text>
                <Text style={styles.detailValueBold}>
                  {booking.roomCode} - {booking.roomName}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>
                  Building {booking.building} • Floor {booking.floor}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>
                  {formatDateDisplay(booking.date)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time slot:</Text>
                <Text style={styles.detailHighlight}>
                  {booking.slotLabel}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Student:</Text>
                <Text style={styles.detailValue}>{booking.userName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Student ID:</Text>
                <Text style={styles.detailValue}>{booking.studentId}</Text>
              </View>
            </View>

            {/* Reminder Box */}
            <View style={styles.noticeBox}>
              <Ionicons name="notifications-outline" size={18} color={colors.primary} />
              <Text style={styles.noticeText}>
                Check-in reminder scheduled 15 minutes before slot starts.
              </Text>
            </View>
          </ScrollView>

          {/* Close Action Button */}
          <TouchableOpacity style={styles.dismissBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.dismissBtnText}>Close Pass</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    ...shadows.modal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  closeBtn: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    paddingBottom: spacing.md,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  passCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.chip,
    gap: 6,
  },
  passCodeText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.chip,
  },
  statusPillActive: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  statusPillCancelled: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  statusTextActive: {
    color: colors.successText,
  },
  statusTextCancelled: {
    color: colors.dangerText,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.button,
    ...shadows.subtle,
  },
  qrInstruction: {
    marginTop: spacing.md,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  detailsBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  detailValueBold: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  detailHighlight: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: borderRadius.button,
    gap: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: typography.sizes.caption,
    color: colors.primary,
    lineHeight: 16,
  },
  dismissBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  dismissBtnText: {
    color: colors.textWhite,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
});

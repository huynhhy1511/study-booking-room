import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { Booking } from '../types';
import { formatDateDisplay } from '../utils/dateTime';
import { QRPassModal } from '../components/QRPassModal';
import { DesktopHeader } from '../components/DesktopHeader';
import { EmptyState } from '../components/EmptyState';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

export const MyReservationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const numColumns = width >= 768 ? 2 : 1;

  const reservations = useBookingStore((state) => state.reservations);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const displayedReservations = useMemo(() => {
    return reservations.filter((b) =>
      activeTab === 'upcoming' ? b.status === 'confirmed' : b.status === 'cancelled'
    );
  }, [reservations, activeTab]);

  const handleCancelPress = (booking: Booking) => {
    setBookingToCancel(booking);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      const res = await cancelBooking(bookingToCancel.id);
      if (res.success) {
        const code = bookingToCancel.roomCode;
        setBookingToCancel(null);
        setToastMessage(`Đã hủy đặt phòng ${code} thành công! Khung giờ đã được giải phóng.`);
        setTimeout(() => setToastMessage(null), 4500);
      } else {
        Alert.alert('Không thể hủy', res.error || 'Có lỗi xảy ra.');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể hủy lúc này.');
    } finally {
      setIsCancelling(false);
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isConfirmed = item.status === 'confirmed';

    return (
      <View style={[styles.bookingCard, numColumns > 1 && styles.bookingCardGrid]}>
        {/* Room & Building */}
        <Text style={styles.roomCode}>{item.roomCode}</Text>
        <Text style={styles.roomName}>{item.roomName}</Text>
        <Text style={styles.location}>
          Building {item.building} • Floor {item.floor} (VKU)
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
      {/* Desktop Header for Web */}
      {isDesktop && <DesktopHeader />}

      <View style={styles.responsiveWrapper}>
        {/* Title */}
        <View style={styles.topHeader}>
          <Text style={styles.screenTitle}>My Bookings</Text>
          <Text style={styles.screenSubtitle}>
            Manage your study room reservations & access your QR check-in passes
          </Text>
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
          key={numColumns}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          data={displayedReservations}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={[
            styles.listContent,
            isDesktop && { paddingBottom: 60 },
          ]}
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
      </View>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <View style={styles.toastBanner}>
          <View style={styles.toastLeft}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
          <TouchableOpacity onPress={() => setToastMessage(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={18} color="#166534" />
          </TouchableOpacity>
        </View>
      )}

      {/* QR Pass Modal */}
      <QRPassModal
        visible={!!selectedBookingForQR}
        booking={selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
      />

      {/* Custom Cross-Platform Cancellation Dialog Modal */}
      <Modal
        visible={!!bookingToCancel}
        transparent
        animationType="fade"
        onRequestClose={() => setBookingToCancel(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalCard}>
            <View style={styles.cancelIconBox}>
              <Ionicons name="trash-outline" size={28} color={colors.danger} />
            </View>

            <Text style={styles.cancelModalTitle}>Xác nhận hủy đặt phòng</Text>

            <Text style={styles.cancelModalDesc}>
              Bạn có chắc chắn muốn hủy lịch hẹn tại{' '}
              <Text style={styles.boldNavyText}>
                {bookingToCancel?.roomCode} - {bookingToCancel?.roomName}
              </Text>?
            </Text>

            {bookingToCancel && (
              <View style={styles.bookingDetailsBox}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={15} color={colors.navy} />
                  <Text style={styles.detailText}>{formatDateDisplay(bookingToCancel.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={15} color={colors.navy} />
                  <Text style={styles.detailText}>{bookingToCancel.slotLabel}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={15} color={colors.navy} />
                  <Text style={styles.detailText}>
                    Tòa {bookingToCancel.building}, Tầng {bookingToCancel.floor} (VKU)
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.cancelNoticeBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#D97706" />
              <Text style={styles.cancelNoticeText}>
                Khung giờ này sẽ ngay lập tức được giải phóng trên hệ thống thời gian thực để sinh viên khác có thể đăng ký.
              </Text>
            </View>

            <View style={styles.cancelModalActions}>
              <TouchableOpacity
                style={styles.keepBtn}
                onPress={() => setBookingToCancel(null)}
                disabled={isCancelling}
                activeOpacity={0.7}
              >
                <Text style={styles.keepBtnText}>Giữ lại lịch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmCancelBtn, isCancelling && { opacity: 0.7 }]}
                onPress={handleConfirmCancel}
                disabled={isCancelling}
                activeOpacity={0.88}
              >
                {isCancelling ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.confirmCancelBtnText}>Xác nhận hủy</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
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
    color: colors.navy,
  },
  screenSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
  columnWrapper: {
    gap: 16,
  },
  bookingCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.card,
  },
  bookingCardGrid: {
    flex: 1,
  },
  roomCode: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.navy,
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
    backgroundColor: '#E2E8F0',
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
    borderTopColor: '#E2E8F0',
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
  // Toast Notification
  toastBanner: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    maxWidth: 560,
    alignSelf: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: borderRadius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
    zIndex: 9999,
  },
  toastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cancelModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...shadows.modal,
  },
  cancelIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  cancelModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 8,
    textAlign: 'center',
  },
  cancelModalDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  boldNavyText: {
    fontWeight: '700',
    color: colors.navy,
  },
  bookingDetailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  cancelNoticeBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 20,
  },
  cancelNoticeText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
    lineHeight: 17,
  },
  cancelModalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  keepBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  keepBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmCancelBtn: {
    flex: 1.2,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...shadows.subtle,
  },
  confirmCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

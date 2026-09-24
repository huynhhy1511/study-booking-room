import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { DateSlotSelector } from '../components/DateSlotSelector';
import { getRoomRealtimeStatus } from '../utils/conflict';
import { TIME_SLOTS } from '../constants';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

export const RoomDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { roomId } = route.params;

  const rooms = useBookingStore((state) => state.rooms);
  const reservations = useBookingStore((state) => state.reservations);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedSlotId = useBookingStore((state) => state.selectedSlotId);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const setSelectedSlotId = useBookingStore((state) => state.setSelectedSlotId);
  const isSlotUnavailable = useBookingStore((state) => state.isSlotUnavailable);

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text>Room not found!</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { status } = getRoomRealtimeStatus(reservations, room.id);
  const isAvailable = status === 'Available Now';
  const selectedSlot = TIME_SLOTS.find((s) => s.id === selectedSlotId);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out Study Room ${room.code} at VKU Smart Campus! Location: Building ${room.building}, Floor ${room.floor}.`,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  const handleLocationPress = () => {
    Alert.alert(
      'Room Location',
      `📍 Room: ${room.code} - ${room.name}\nBuilding: Tòa nhà ${room.building}\nFloor: Tầng ${room.floor}\nCampus: Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU)`
    );
  };

  const handleContinueBooking = () => {
    if (!selectedSlotId) {
      Alert.alert(
        'Select a Time Slot',
        'Please select an available time slot before continuing.'
      );
      return;
    }

    if (isSlotUnavailable(room.id, selectedDate, selectedSlotId)) {
      Alert.alert(
        'Time Slot Already Booked',
        'This slot has already been reserved by another student. Please select another slot.'
      );
      return;
    }

    navigation.navigate('BookingConfirmation', {
      roomId: room.id,
      date: selectedDate,
      slotId: selectedSlotId,
    });
  };

  // Facilities data mapping
  const facilities = [
    { id: 'wifi', name: 'Wifi', icon: 'wifi-outline', qty: null },
    { id: 'whiteboard', name: 'Whiteboard', icon: 'easel-outline', qty: 'x2' },
    { id: 'projector', name: 'Projector', icon: 'videocam-outline', qty: 'x2' },
    { id: 'pc', name: 'High-spec PC', icon: 'desktop-outline', qty: 'x1' },
    { id: 'ac', name: 'AC', icon: 'snow-outline', qty: null },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Top Navigation Bar with Back, Heart, Share */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navIconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.navy} />
        </TouchableOpacity>

        <View style={styles.navRightActions}>
          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => setIsFavorite(!isFavorite)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.danger : colors.navy}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={handleShare}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="share-social-outline" size={22} color={colors.navy} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. Room Title & Host Info Row */}
        <View style={styles.titleSection}>
          <View style={styles.titleInfo}>
            <Text style={styles.roomTitle}>
              Study Room {room.code.replace('.', ' ')}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                Tòa nhà {room.building} • Tầng {room.floor} (VKU)
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{room.capacity} People</Text>
            </View>
          </View>

          {/* Supervisor / Host Avatar */}
          <View style={styles.hostAvatarWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' }}
              style={styles.hostAvatar}
            />
          </View>
        </View>

        {/* 3. Hero Image with 1/3 page badge and dot indicators */}
        <View style={styles.carouselContainer}>
          <Image
            source={{ uri: room.imageUrl }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          {/* Page Badge: 1/3 */}
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>1/3</Text>
          </View>

          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* 4. Status & Opening Hours Row */}
        <View style={styles.statusHoursRow}>
          <View style={styles.statusPillWrapper}>
            {isAvailable ? (
              <>
                <View style={styles.statusDotGreen} />
                <Text style={styles.statusTextGreen}>Available</Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed" size={12} color={colors.danger} />
                <Text style={styles.statusTextRed}>Occupied</Text>
              </>
            )}
          </View>

          <Text style={styles.hoursText}>Open 8 AM - 10 PM</Text>
        </View>

        {/* 5. Facilities Section (Horizontal Cards) */}
        <View style={styles.facilitiesSection}>
          <Text style={styles.sectionHeading}>Facilities</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.facilitiesScroll}
          >
            {facilities.map((fac) => (
              <View key={fac.id} style={styles.facilityCard}>
                {fac.qty && (
                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyText}>{fac.qty}</Text>
                  </View>
                )}
                <Ionicons name={fac.icon as any} size={22} color={colors.navy} />
                <Text style={styles.facilityName}>{fac.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 6. Date & Time Slots Selector with Conflict Engine */}
        <DateSlotSelector
          roomId={room.id}
          selectedDate={selectedDate}
          selectedSlotId={selectedSlotId}
          onSelectDate={setSelectedDate}
          onSelectSlot={setSelectedSlotId}
          isSlotUnavailable={isSlotUnavailable}
        />
      </ScrollView>

      {/* 7. Sticky Bottom Action Buttons: [ Location ] and [ Continue ] */}
      <View style={styles.stickyBottomBar}>
        <TouchableOpacity
          style={styles.locationBtn}
          onPress={handleLocationPress}
          activeOpacity={0.8}
        >
          <Text style={styles.locationBtnText}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueBtn,
            !selectedSlotId && styles.continueBtnDisabled,
          ]}
          onPress={handleContinueBooking}
          activeOpacity={0.88}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: '#F8FAFC',
  },
  navIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  titleInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  roomTitle: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  metaText: {
    fontSize: typography.sizes.bodySm,
    color: colors.textSecondary,
  },
  hostAvatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...shadows.subtle,
  },
  hostAvatar: {
    width: '100%',
    height: '100%',
  },
  carouselContainer: {
    marginHorizontal: spacing.lg,
    height: 190,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  pageBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.chip,
  },
  pageBadgeText: {
    color: colors.textWhite,
    fontSize: 11,
    fontWeight: '600',
  },
  dotsRow: {
    position: 'absolute',
    bottom: spacing.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 14,
  },
  statusHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  statusPillWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusTextGreen: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  statusTextRed: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
  hoursText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  facilitiesSection: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  sectionHeading: {
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  facilitiesScroll: {
    paddingHorizontal: spacing.lg,
    gap: 10,
    paddingVertical: 4,
  },
  facilityCard: {
    width: 84,
    height: 76,
    backgroundColor: colors.card,
    borderRadius: borderRadius.facility,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.subtle,
  },
  qtyBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  qtyText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  facilityName: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    marginTop: 6,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...shadows.card,
  },
  locationBtn: {
    flex: 1,
    height: 50,
    borderRadius: borderRadius.button,
    borderWidth: 1.5,
    borderColor: colors.navy,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.navy,
  },
  continueBtn: {
    flex: 2,
    height: 50,
    borderRadius: borderRadius.button,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  continueBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  continueBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
});

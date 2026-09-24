import React, { memo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../types';
import { RealtimeRoomStatus } from '../utils/conflict';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

interface RoomCardProps {
  room: Room;
  status: RealtimeRoomStatus;
  onPress: (room: Room) => void;
}

const RoomCardComponent: React.FC<RoomCardProps> = ({ room, status, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const isAvailable = status === 'Available Now';

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={styles.card}
      onPress={() => onPress(room)}
    >
      {/* 1. Room Image with Favorite Heart Icon */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Heart Icon Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? colors.danger : colors.navy}
          />
        </TouchableOpacity>
      </View>

      {/* 2. Room Details Content */}
      <View style={styles.content}>
        {/* Title & Status Row */}
        <View style={styles.titleRow}>
          <Text style={styles.roomTitle} numberOfLines={1}>
            Study Room {room.code.replace('.', ' ')}
          </Text>

          {/* Status Badge: ● Available or 🔒 Occupied */}
          <View style={styles.statusRow}>
            {isAvailable ? (
              <>
                <View style={styles.dotAvailable} />
                <Text style={styles.statusTextAvailable}>Available</Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed" size={12} color={colors.danger} />
                <Text style={styles.statusTextOccupied}>Occupied</Text>
              </>
            )}
          </View>
        </View>

        {/* Location & Details Row */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.locationText}>
            Tòa {room.building} • Tầng {room.floor} (VKU)
          </Text>
        </View>

        {/* Capacity & See Detail >> Row */}
        <View style={styles.bottomRow}>
          <View style={styles.capacityWrapper}>
            <Ionicons name="people-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.capacityText}>{room.capacity} People</Text>
          </View>

          <View style={styles.seeDetailRow}>
            <Text style={styles.seeDetailText}>See Detail</Text>
            <View style={styles.doubleChevron}>
              <Ionicons name="chevron-forward" size={13} color={colors.primary} />
              <Ionicons name="chevron-forward" size={13} color={colors.primary} style={{ marginLeft: -8 }} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const RoomCard = memo(RoomCardComponent, (prev, next) => {
  return prev.room.id === next.room.id && prev.status === next.status;
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E9EEF5',
    overflow: 'hidden',
    ...shadows.card,
  },
  imageContainer: {
    width: '100%',
    height: 155,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  content: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  roomTitle: {
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dotAvailable: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusTextAvailable: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semiBold,
    color: colors.success,
  },
  statusTextOccupied: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semiBold,
    color: colors.danger,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: typography.sizes.bodySm,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  capacityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  capacityText: {
    fontSize: typography.sizes.bodySm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  seeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeDetailText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  doubleChevron: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RealtimeRoomStatus } from '../utils/conflict';
import { colors, borderRadius, typography, spacing } from '../theme';

interface StatusBadgeProps {
  status: RealtimeRoomStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isAvailable = status === 'Available Now';

  return (
    <View
      style={[
        styles.container,
        isAvailable ? styles.availableContainer : styles.occupiedContainer,
        size === 'sm' && styles.containerSm,
      ]}
    >
      {isAvailable ? (
        <View style={styles.dot} />
      ) : (
        <Ionicons
          name="lock-closed"
          size={size === 'sm' ? 11 : 12}
          color={colors.dangerText}
          style={styles.lockIcon}
        />
      )}
      <Text
        style={[
          styles.text,
          isAvailable ? styles.availableText : styles.occupiedText,
          size === 'sm' && styles.textSm,
        ]}
      >
        {isAvailable ? 'AVAILABLE' : 'OCCUPIED'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  containerSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  availableContainer: {
    backgroundColor: colors.successLight,
    borderColor: colors.successBorder,
  },
  occupiedContainer: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.dangerBorder,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  lockIcon: {
    marginRight: 4,
  },
  text: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 11,
  },
  availableText: {
    color: colors.successText,
  },
  occupiedText: {
    color: colors.dangerText,
  },
});

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { colors } from '../theme';

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 44, showText = false }) => {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Outer Circle with soft blue ring */}
        <Circle cx="50" cy="50" r="46" fill="#0B1B32" />

        {/* Smiling 'U' Mascot Shape */}
        <Path
          d="M32 30 V56 C32 66 40 74 50 74 C60 74 68 66 68 56 V30"
          stroke="#FFFFFF"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cute Smiling Mascot Eyes (Cyan / Orange) */}
        <Circle cx="26" cy="36" r="5" fill="#38BDF8" />
        <Circle cx="74" cy="36" r="5" fill="#38BDF8" />
      </Svg>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.brandTitle}>VKU Study</Text>
          <Text style={styles.brandSubtitle}>Room Booking</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});

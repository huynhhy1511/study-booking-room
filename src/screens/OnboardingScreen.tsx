import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '../components/BrandLogo';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleGetStarted = () => {
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Orbit & Mascot Visual Illustration */}
        <View style={styles.illustrationWrapper}>
          {/* Concentric Orbit Rings */}
          <View style={styles.outerRing}>
            <View style={styles.middleRing}>
              <View style={styles.innerGlow}>
                <BrandLogo size={68} />
              </View>

              {/* Floating Avatar 1 (Top right) */}
              <View style={[styles.floatingBadge, styles.badgeTopRight]}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }}
                  style={styles.avatarImg}
                />
              </View>

              {/* Floating Badge (Top Left - Books) */}
              <View style={[styles.floatingBadge, styles.badgeTopLeft]}>
                <Ionicons name="book-outline" size={16} color={colors.primary} />
              </View>

              {/* Floating Avatar 2 (Bottom Left) */}
              <View style={[styles.floatingBadge, styles.badgeBottomLeft]}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' }}
                  style={styles.avatarImg}
                />
              </View>

              {/* Floating Badge (Bottom Right - Headphones) */}
              <View style={[styles.floatingBadge, styles.badgeBottomRight]}>
                <Ionicons name="headset-outline" size={16} color={colors.primary} />
              </View>

              {/* Floating Trophy Badge (Top) */}
              <View style={[styles.floatingBadge, styles.badgeTop]}>
                <Ionicons name="trophy-outline" size={16} color="#3B82F6" />
              </View>

              {/* Floating Pencil Badge (Far Right) */}
              <View style={[styles.floatingBadge, styles.badgeFarRight]}>
                <Ionicons name="pencil-outline" size={14} color="#6366F1" />
              </View>

              {/* Floating Sleep / Zzz Badge (Far Left) */}
              <View style={[styles.floatingBadge, styles.badgeFarLeft]}>
                <Text style={styles.zzzText}>zzz</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Headline & Call To Action */}
        <View style={styles.bottomContent}>
          <Text style={styles.headline}>
            Discover the room for your next level.
          </Text>

          <Text style={styles.subheadline}>
            When the right room is easy to find, progress starts becoming inevitable.
          </Text>

          {/* Deep Navy 'Get Started >>' Button */}
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={handleGetStarted}
            activeOpacity={0.88}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <View style={styles.chevronBox}>
              <Ionicons name="chevron-forward" size={16} color={colors.navy} />
              <Ionicons name="chevron-forward" size={16} color={colors.navy} style={{ marginLeft: -10 }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  illustrationWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },
  outerRing: {
    width: width * 0.78,
    height: width * 0.78,
    borderRadius: (width * 0.78) / 2,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  middleRing: {
    width: width * 0.54,
    height: width * 0.54,
    borderRadius: (width * 0.54) / 2,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerGlow: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#E0E7FF',
    ...shadows.subtle,
  },
  floatingBadge: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderRadius: borderRadius.pill,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  badgeTopRight: {
    top: -6,
    right: 24,
    padding: 2,
  },
  badgeTopLeft: {
    top: 14,
    left: -12,
  },
  badgeBottomLeft: {
    bottom: 8,
    left: 20,
    padding: 2,
  },
  badgeBottomRight: {
    bottom: 24,
    right: -8,
  },
  badgeTop: {
    top: -36,
    alignSelf: 'center',
  },
  badgeFarRight: {
    right: -36,
    top: '38%',
  },
  badgeFarLeft: {
    left: -40,
    top: '42%',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  zzzText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  bottomContent: {
    paddingTop: spacing.lg,
  },
  headline: {
    fontSize: typography.sizes.heroHeadline,
    fontWeight: typography.weights.extraBold,
    color: colors.navy,
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  subheadline: {
    fontSize: typography.sizes.bodySm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xxl,
  },
  getStartedBtn: {
    height: 54,
    borderRadius: borderRadius.button,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    ...shadows.card,
  },
  getStartedText: {
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginRight: spacing.sm,
  },
  chevronBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textWhite,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingLeft: 4,
  },
});

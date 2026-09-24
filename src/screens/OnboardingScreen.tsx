import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '../components/BrandLogo';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleGetStarted = () => {
    navigation.replace('MainTabs');
  };

  const ringSize = isDesktop ? 360 : Math.min(width * 0.78, 320);
  const middleRingSize = isDesktop ? 250 : Math.min(width * 0.54, 220);

  // Vòng Orbit minh họa Mascot (tự điều chỉnh tỷ lệ mượt mà)
  const renderIllustration = () => (
    <View style={[styles.outerRing, { width: ringSize, height: ringSize, borderRadius: ringSize / 2 }]}>
      <View style={[styles.middleRing, { width: middleRingSize, height: middleRingSize, borderRadius: middleRingSize / 2 }]}>
        <View style={styles.innerGlow}>
          <BrandLogo size={isDesktop ? 76 : 64} />
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
  );

  if (isDesktop) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Top Navbar cho Desktop */}
        <View style={styles.desktopTopNav}>
          <View style={styles.brandRow}>
            <BrandLogo size={36} />
            <View>
              <Text style={styles.brandTitle}>VKU Study Room</Text>
              <Text style={styles.brandSubtitle}>Smart Campus Platform</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.desktopExploreBtn}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.desktopExploreText}>Vào ứng dụng ngay</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.navy} />
          </TouchableOpacity>
        </View>

        {/* 2-Column Hero Section cho Web Desktop */}
        <ScrollView contentContainerStyle={styles.desktopHeroContainer}>
          <View style={styles.desktopHeroInner}>
            {/* Cột trái: Giới thiệu & Kêu gọi hành động */}
            <View style={styles.desktopLeftCol}>
              <View style={styles.badgeCampus}>
                <Ionicons name="school-outline" size={14} color={colors.primary} />
                <Text style={styles.badgeCampusText}>VKU SMART STUDY BOOKING SYSTEM</Text>
              </View>

              <Text style={styles.desktopHeadline}>
                Discover the room for your next level.
              </Text>

              <Text style={styles.desktopSubheadline}>
                Nền tảng quản lý và đặt phòng tự học đa nền tảng (Web & Mobile) dành riêng cho sinh viên VKU. Tìm phòng học thông minh, cập nhật lịch thời gian thực và check-in vé QR tiện lợi.
              </Text>

              {/* Danh sách tính năng nổi bật */}
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Ionicons name="flash-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.featureText}>Đặt phòng theo slot 2h, chống xung đột lịch tức thì</Text>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Ionicons name="qr-code-outline" size={18} color="#10B981" />
                  </View>
                  <Text style={styles.featureText}>Tự động tạo thẻ đặt phòng QR Code (VKU-XXXXXX)</Text>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Ionicons name="business-outline" size={18} color="#8B5CF6" />
                  </View>
                  <Text style={styles.featureText}>16 phòng học tiện nghi tại tòa A, B, C, V</Text>
                </View>
              </View>

              {/* Button Bắt đầu */}
              <TouchableOpacity
                style={styles.getStartedBtnDesktop}
                onPress={handleGetStarted}
                activeOpacity={0.88}
              >
                <Text style={styles.getStartedText}>Get Started Now</Text>
                <View style={styles.chevronBox}>
                  <Ionicons name="chevron-forward" size={16} color={colors.navy} />
                  <Ionicons name="chevron-forward" size={16} color={colors.navy} style={{ marginLeft: -10 }} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Cột phải: Khối Visual Orbit Mascot */}
            <View style={styles.desktopRightCol}>
              <View style={styles.desktopIllustrationCard}>
                {renderIllustration()}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Giao diện Mobile (Native Phone Screen 1 chuẩn mockup)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Orbit & Mascot Visual Illustration */}
        <View style={styles.illustrationWrapper}>
          {renderIllustration()}
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
  // Mobile Container
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
  // Orbit Visual
  outerRing: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  middleRing: {
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerGlow: {
    width: 96,
    height: 96,
    borderRadius: 48,
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
  getStartedBtnDesktop: {
    height: 54,
    borderRadius: borderRadius.button,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    alignSelf: 'flex-start',
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

  // Desktop Specific Styles
  desktopTopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  desktopExploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  desktopExploreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.navy,
  },
  desktopHeroContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  desktopHeroInner: {
    maxWidth: 1100,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 48,
  },
  desktopLeftCol: {
    flex: 1.2,
  },
  badgeCampus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgeCampusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  desktopHeadline: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.navy,
    lineHeight: 48,
    marginBottom: 16,
  },
  desktopSubheadline: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: 28,
  },
  featuresList: {
    gap: 14,
    marginBottom: 36,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  desktopRightCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopIllustrationCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


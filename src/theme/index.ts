export const colors = {
  // Brand Dark Navy (from reference mockup)
  navy: '#0B1B32',         // Deep Navy for Bottom Bar, Main CTA buttons, Headers
  navyLight: '#162C4E',
  navyHover: '#071224',

  // Primary & Accents
  primary: '#2563EB',      // Tech Blue for links, icons, active highlights
  primaryLight: '#EFF6FF',
  primaryBorder: '#BFDBFE',
  accentCyan: '#06B6D4',
  accentPurple: '#8B5CF6',

  // Status Colors (Accessible & High Contrast)
  success: '#16A34A',      // Green - Available / Confirmed
  successLight: '#F0FDF4',
  successBorder: '#BBF7D0',
  successText: '#15803D',

  danger: '#DC2626',       // Red - Occupied / Cancelled / Booked
  dangerLight: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerText: '#B91C1C',

  warning: '#D97706',
  warningLight: '#FFFBEB',

  // Neutrals (Light-first + Card UI + Accessible)
  background: '#F8FAFC',   // Nền tổng thể sạch sẽ
  card: '#FFFFFF',         // Nền thẻ card
  surface: '#F1F5F9',      // Nền phụ
  border: '#E2E8F0',       // Đường viền chuẩn
  borderDark: '#CBD5E1',

  // Typography Colors
  text: '#0B1B32',         // Văn bản chính (Dark Navy)
  textSecondary: '#64748B', // Văn bản phụ
  textMuted: '#94A3B8',    // Văn bản mờ
  textWhite: '#FFFFFF',

  // Bottom Navigation Bar
  bottomBarBg: '#0B1B32',
  bottomBarActive: '#FFFFFF',
  bottomBarInactive: '#8E9EB5',
  badgeRed: '#EF4444',

  // Disabled
  disabledBg: '#F1F5F9',
  disabledBorder: '#E2E8F0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const borderRadius = {
  card: 16,
  button: 14,
  pill: 9999,
  chip: 20,
  input: 14,
  facility: 14,
};

export const typography = {
  sizes: {
    caption: 12,
    bodySm: 13,
    body: 15,
    bodyLg: 16,
    section: 18,
    title: 20,
    screenTitle: 24,
    heroHeadline: 28,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
};

export const shadows = {
  subtle: {
    shadowColor: '#0B1B32',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: '#0B1B32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  modal: {
    shadowColor: '#0B1B32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
};

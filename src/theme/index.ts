import { Platform, TextStyle } from 'react-native';

export const colors = {
  bg: '#0A0E17',
  surface: '#111827',
  surfaceRaised: '#334155',
  border: '#23304A',
  borderSubtle: '#334155',
  text: '#f8fafc',
  textMuted: '#64748B',
  textDim: '#64748b',
  accent: '#00E699',
  accentDim: '#059669',
  accentSoft: '#064e3b',
  danger: '#f43f5e',
  warning: '#f59e0b',
  info: '#38bdf8',
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.72)',
  chipBg: '#1e293b',
  chipActive: '#064e3b',
  urgent: '#f43f5e',
  soon: '#f59e0b',
  someday: '#64748b',
  needed: '#38bdf8',
  sourcing: '#a78bfa',
  ordered: '#fbbf24',
  installed: '#10b981',
  graySoft: '#94A3B8',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#64748B',
  slate500: '#475569',
  slate600: '#334155',
  slate700: '#23304A',
  slate800: '#1E293B',
  slate900: '#111827',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const fontFamily = {
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semibold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
};

export const typography = {
  hero: { fontFamily: fontFamily.bold, fontSize: 30, letterSpacing: -0.6 } as TextStyle,
  title: { fontFamily: fontFamily.bold, fontSize: 20, letterSpacing: -0.3 } as TextStyle,
  subtitle: { fontFamily: fontFamily.semibold, fontSize: 15 } as TextStyle,
  body: { fontFamily: fontFamily.regular, fontSize: 14 } as TextStyle,
  caption: { fontFamily: fontFamily.medium, fontSize: 12 } as TextStyle,
  label: { fontFamily: fontFamily.bold, fontSize: 11, letterSpacing: 0.6 } as TextStyle,
  mono: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  } as TextStyle,
};

export const shadows = {
  soft: Platform.select({
    ios: {
      shadowColor: colors.bg,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
    },
    android: { elevation: 3 },
  }),
};

export const theme = { colors, spacing, radius, fontFamily, typography, shadows };

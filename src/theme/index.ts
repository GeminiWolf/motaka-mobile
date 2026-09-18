import { Platform, StyleSheet, TextStyle } from 'react-native';

export const colors = {
  bg: '#121417',
  surface: '#121417',
  surfaceRaised: '#1A1E22',
  border: '#2C3236',
  borderSubtle: '#24292D',
  text: '#E7E4DC',
  textMuted: '#8F948C',
  textDim: '#6D736C',
  accent: '#8FB089',
  accentDim: '#6F8C6A',
  accentSoft: '#1B231C',
  danger: '#C45C5C',
  warning: '#C4A15A',
  info: '#8F948C',
  white: '#E7E4DC',
  black: '#0B0D0F',
  overlay: 'rgba(10, 12, 14, 0.72)',
  chipBg: 'transparent',
  chipActive: 'transparent',
  urgent: '#C45C5C',
  soon: '#8F948C',
  someday: '#6D736C',
  needed: '#8F948C',
  sourcing: '#8F948C',
  ordered: '#C4A15A',
  installed: '#6D736C',
  graySoft: '#8F948C',
  slate200: '#E7E4DC',
  slate300: '#C4C7C0',
  slate400: '#8F948C',
  slate500: '#6D736C',
  slate600: '#2C3236',
  slate700: '#24292D',
  slate800: '#1A1E22',
  slate900: '#121417',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 40,
};

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
};

export const layout = {
  gutter: 20,
  rowMinHeight: 64,
  hairline: StyleSheet.hairlineWidth,
};

export const fontFamily = {
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semibold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
};

export const typography = {
  hero: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    letterSpacing: -0.8,
    lineHeight: 36,
  } as TextStyle,
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 22,
    letterSpacing: -0.4,
    lineHeight: 26,
  } as TextStyle,
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    letterSpacing: -0.2,
    lineHeight: 22,
  } as TextStyle,
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    lineHeight: 16,
  } as TextStyle,
  mono: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontVariant: ['tabular-nums'],
  } as TextStyle,
};

export const tabularNums: TextStyle = {
  fontVariant: ['tabular-nums'],
};

export const shadows = {
  soft: Platform.select({
    ios: {
      shadowColor: colors.bg,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
  }),
};

export const theme = {
  colors,
  spacing,
  radius,
  layout,
  fontFamily,
  typography,
  shadows,
};

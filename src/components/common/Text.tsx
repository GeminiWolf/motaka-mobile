import React from 'react';
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { colors, typography } from '../../theme';

export type TextVariant =
  | 'hero'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label'
  | 'mono';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type TextTone =
  | 'default'
  | 'muted'
  | 'dim'
  | 'accent'
  | 'danger'
  | 'warning'
  | 'info'
  | 'white'
  | 'slate';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TextAlign = 'left' | 'center' | 'right';

export type TextTransform = 'none' | 'uppercase' | 'capitalize' | 'lowercase';

export type TextLeading = 'tight' | 'normal' | 'relaxed';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  align?: TextAlign;
  transform?: TextTransform;
  leading?: TextLeading;
  mono?: boolean;
  underline?: boolean;
  strike?: boolean;
  /** @deprecated Prefer `align="center"` */
  center?: boolean;
  children: React.ReactNode;
};

export const TEXT_SIZES: Record<TextSize, number> = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
};

export const TEXT_WEIGHTS: Record<TextWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const TEXT_LEADING: Record<TextLeading, number> = {
  tight: 1.15,
  normal: 1.4,
  relaxed: 1.65,
};

const TONE_COLOR: Record<TextTone, string> = {
  default: colors.text,
  muted: colors.textMuted,
  dim: colors.textDim,
  accent: colors.accent,
  danger: colors.danger,
  warning: colors.warning,
  info: colors.info,
  white: colors.white,
  slate: colors.slate400,
};

export function getTextDecorationLine(
  underline?: boolean,
  strike?: boolean,
): TextStyle['textDecorationLine'] | undefined {
  if (underline && strike) {
    return 'underline line-through';
  }
  if (underline) {
    return 'underline';
  }
  if (strike) {
    return 'line-through';
  }
  return undefined;
}

export function Text({
  variant = 'body',
  size,
  tone = 'default',
  weight,
  align,
  transform,
  leading,
  mono,
  underline,
  strike,
  center,
  style,
  children,
  ...rest
}: TextProps) {
  const fontSize =
    size != null ? TEXT_SIZES[size] : (typography[variant].fontSize as number);
  const textDecorationLine = getTextDecorationLine(underline, strike);

  return (
    <RNText
      {...rest}
      style={[
        typography[variant],
        { color: TONE_COLOR[tone] },
        size != null && { fontSize: TEXT_SIZES[size] },
        weight != null && { fontWeight: TEXT_WEIGHTS[weight] },
        (align != null || center) && {
          textAlign: align ?? (center ? 'center' : undefined),
        },
        transform != null && { textTransform: transform },
        leading != null && {
          lineHeight: Math.round(fontSize * TEXT_LEADING[leading]),
        },
        mono && typography.mono,
        textDecorationLine != null && { textDecorationLine },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

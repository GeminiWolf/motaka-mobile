import React, { type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { withOpacity } from '../../utils/withOpacity';
import { Text, type TextTone } from './Text';

export type BadgeTone =
  | 'default'
  | 'accent'
  | 'danger'
  | 'warning'
  | 'info'
  | 'muted';

type Props = {
  label: string;
  /** Custom content rendered before the label (icon, dot, spinner, etc.). */
  leftSection?: ReactNode;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
};

export const BADGE_TONE_COLOR: Record<BadgeTone, string> = {
  default: colors.white,
  accent: colors.accent,
  danger: colors.danger,
  warning: colors.warning,
  info: colors.info,
  muted: colors.slate400,
};

const BADGE_TEXT_TONE: Record<BadgeTone, TextTone> = {
  default: 'white',
  accent: 'accent',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
  muted: 'muted',
};

export function Badge({
  label,
  leftSection,
  tone = 'default',
  style,
}: Props) {
  const toneColor = BADGE_TONE_COLOR[tone];
  const textTone = BADGE_TEXT_TONE[tone];

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[
        styles.badge,
        {
          backgroundColor: withOpacity(toneColor, 0.15),
        },
        style,
      ]}
    >
      {leftSection != null ? (
        <View style={styles.leftSection}>
          {typeof leftSection === 'string' ? (
            <Text size="xs" weight="semibold" tone={textTone}>
              {leftSection}
            </Text>
          ) : (
            leftSection
          )}
        </View>
      ) : null}
      <Text size="xs" weight="semibold" tone={textTone}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  leftSection: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

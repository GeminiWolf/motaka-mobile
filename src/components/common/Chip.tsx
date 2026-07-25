import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors, radius, spacing, typography} from '../../theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  stretch?: boolean;
};

export function Chip({label, selected, onPress, stretch}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{selected: !!selected}}
      style={[
        styles.chip,
        selected && styles.selected,
        stretch && styles.stretch,
      ]}>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  stretch: {
    flex: 1,
    alignItems: 'center',
    marginRight: 0,
  },
  selected: {
    backgroundColor: colors.chipActive,
    borderColor: colors.accentDim,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.accent,
  },
});

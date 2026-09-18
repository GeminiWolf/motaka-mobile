import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, layout, spacing } from '../../theme';
import { Text } from './Text';

export type FilterTabOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  options: Array<FilterTabOption<T>>;
  onChange: (value: T) => void;
};

export function FilterTabs<T extends string>({
  value,
  options,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            hitSlop={spacing.xs}
            style={styles.tab}
          >
            <Text
              size="sm"
              weight={selected ? 'semibold' : 'regular'}
              tone={selected ? 'default' : 'muted'}
            >
              {option.label}
            </Text>
            <View style={[styles.mark, selected && styles.markActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xl,
    borderBottomWidth: layout.hairline,
    borderBottomColor: colors.borderSubtle,
  },
  tab: {
    paddingBottom: spacing.sm,
    minHeight: 36,
    justifyContent: 'flex-end',
  },
  mark: {
    height: 2,
    marginTop: spacing.xs,
    backgroundColor: 'transparent',
  },
  markActive: {
    backgroundColor: colors.text,
  },
});

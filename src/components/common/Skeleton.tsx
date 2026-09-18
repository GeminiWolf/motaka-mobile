import React from 'react';
import {
  StyleSheet,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radius as themeRadius, spacing } from '../../theme';

type Radius = keyof typeof themeRadius;

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: Radius | number;
  style?: StyleProp<ViewStyle>;
};

type SkeletonListProps = {
  count?: number;
  itemHeight?: number;
};

function resolveRadius(radius: Radius | number): number {
  return typeof radius === 'number' ? radius : themeRadius[radius];
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 'md',
  style,
}: SkeletonProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: resolveRadius(radius),
        },
        style,
      ]}
    />
  );
}

export function SkeletonList({
  count = 6,
  itemHeight = 44,
}: SkeletonListProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} height={itemHeight} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surfaceRaised,
  },
  list: {
    gap: spacing.sm,
  },
});

import React from 'react';
import {
  Pressable,
  StyleSheet,
  ColorValue,
  ViewStyle,
  PressableProps,
} from 'react-native';
import { getListIcon, ListIconName } from './listIcons';
import { colors } from '../../theme';

type Color = keyof typeof colors;

type Props = Omit<PressableProps, 'style'> & {
  icon: ListIconName;
  onPress: () => void;
  size?: number;
  color?: Color | ColorValue;
  iconColor?: Color | ColorValue;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: ViewStyle;
};

export default function ButtonIcon({
  icon,
  onPress,
  size = 20,
  color: colorValue = colors.text,
  iconColor: iconColorValue,
  variant = 'primary',
  style,
  ...props
}: Props) {
  const Icon = getListIcon(icon);

  const color = colors[colorValue as Color]
    ? colors[colorValue as Color]
    : colorValue;

  const derivedIconColor = iconColorValue ? iconColorValue : colors.white;

  const iconColor = colors[iconColorValue as Color]
    ? colors[iconColorValue as Color]
    : derivedIconColor;

  const variantStyles = {
    primary: {
      backgroundColor: color,
    },
    secondary: {
      backgroundColor: colors.surface,
    },
    danger: {
      backgroundColor: colors.danger,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  }[variant];

  return (
    <Pressable
      {...props}
      onPress={onPress}
      style={[styles.button, variantStyles, style]}
    >
      <Icon
        color={variant === 'primary' ? colors.white : iconColor}
        size={size}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 8,
  },
});

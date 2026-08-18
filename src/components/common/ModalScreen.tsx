import React, {ReactNode} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {colors, radius, spacing} from '../../theme';
import ButtonIcon from './ButtonIcon';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  onClose: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

export function ModalScreen({
  children,
  scroll,
  onClose,
  style,
  contentStyle,
}: Props) {
  const insets = useSafeAreaInsets();

  const body = scroll ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.root}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View
        style={[styles.flex, { paddingTop: Math.max(insets.top, spacing.md) }]}
      >
        <View
          style={[
            styles.flex,
            styles.sheet,
            // { paddingTop: Math.max(insets.top, spacing.md) },
            style,
          ]}
        >
          <View style={styles.chrome}>
            <View style={styles.handle} />
            <ButtonIcon
              icon="X"
              size={20}
              color="textMuted"
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={12}
            />
          </View>
          {body}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
  },
  flex: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  chrome: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    zIndex: 2,
    elevation: 2,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  closeButton: {
    marginLeft: 'auto',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});
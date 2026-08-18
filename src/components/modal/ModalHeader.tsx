import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text } from '../common/Text';
import { colors } from '../../theme';

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

type Props = {
  readonly titleText?: string;
  readonly rightSection?: React.ReactNode;
  readonly leftSection?: React.ReactNode;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly titleWeight?: FontWeight;
  readonly withHandle?: boolean;
};

export default function ModalHeader({
  titleText,
  rightSection,
  leftSection,
  containerStyle,
  titleWeight = 'semibold',
  withHandle = false,
}: Props) {
  return (
    <View style={styles.root}>
      {withHandle && <View style={styles.handle} />}
      <View style={[styles.container, containerStyle]}>
        <View style={styles.leftSection}>{leftSection && leftSection}</View>
        <View style={styles.titleSection}>
          <Text size="lg" weight={titleWeight} tone="muted" align="center">
            {titleText}
          </Text>
        </View>
        <View style={styles.rightSection}>{rightSection && rightSection}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  handle: {
    height: 4,
    width: 40,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    width: '100%',
  },
  titleSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    textAlign: 'center',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '20%',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '20%',
  },
});

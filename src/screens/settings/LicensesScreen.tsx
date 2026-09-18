import { StyleSheet, View } from 'react-native';
import React from 'react';

import { Text } from '../../components/common/Text';
import { colors, layout, spacing } from '../../theme';

export default function LicensesScreen() {
  return (
    <View style={styles.container}>
      <Text variant="title">Licenses</Text>
      <Text tone="muted">
        Outfit is licensed under the SIL Open Font License. Lucide icons are
        ISC. React Native and other dependencies keep their own licenses.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
});

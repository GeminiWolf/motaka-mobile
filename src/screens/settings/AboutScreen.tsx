import { Linking, StyleSheet, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../../components/common/Text';
import { colors, layout, spacing } from '../../theme';
import { Button } from '../../components/common/Button';
import { PRIVACY_POLICY_URL } from '../../config';
import { version } from '../../../package.json';

export default function AboutScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text variant="hero">Garage Forge</Text>
      <Text tone="muted" style={styles.lede}>
        A workshop log for the cars you’re building and the parts they still
        need.
      </Text>
      <Text size="sm" tone="dim">
        Version {version}
      </Text>
      <View style={styles.actions}>
        <Button
          label="Privacy policy"
          variant="ghost"
          onPress={() => {
            Linking.openURL(PRIVACY_POLICY_URL);
          }}
        />
        <Button
          label="Licenses"
          variant="ghost"
          onPress={() => navigation.navigate('Licenses')}
        />
      </View>
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
  lede: {
    maxWidth: 320,
  },
  actions: {
    marginTop: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
});

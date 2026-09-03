import { Linking, StyleSheet, View } from 'react-native';
import React from 'react';

import { Text } from '../../components/common/Text';
import { colors, spacing } from '../../theme';
import { Button } from '../../components/common/Button';
import GarageForgeIcon from '../../assets/GarageForgeIcon';
import { PRIVACY_POLICY_URL } from '../../config';
import { version } from '../../../package.json';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text size="2xl">Garage Forge</Text>
          <Text align="center" tone="dim" size="lg">
            Version {version}
          </Text>
        </View>
        <View style={styles.content}>
          <GarageForgeIcon size={80} />
        </View>
        <Text>2026</Text>
        <Button
          label="Privacy Policy"
          radius="full"
          onPress={() => {
            Linking.openURL(PRIVACY_POLICY_URL);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xxl,
  },
});

import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../components/common/Text';
import { colors, spacing } from '../theme';
import { Button } from '../components/common/Button';
import GarageForgeIcon from '../assets/GarageForgeIcon';
import { version } from '../../package.json';

export default function AboutScreen() {
  const navigation = useNavigation();

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
          label="Licenses"
          radius="full"
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xxl,
  },
});

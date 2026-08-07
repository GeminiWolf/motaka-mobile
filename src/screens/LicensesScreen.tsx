import { StyleSheet, View } from 'react-native';
import React from 'react';

import { Text } from '../components/common/Text';
import { colors } from '../theme';

export default function LicensesScreen() {
  return (
    <View style={styles.container}>
      <Text>LicensesScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});

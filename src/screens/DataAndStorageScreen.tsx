import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Text } from '../components/common/Text';

export default function DataAndStorageScreen() {
  return (
    <View style={styles.container}>
      <Text>Data and Storage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});

import React from 'react';
import { PlusIcon } from 'lucide-react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet } from 'react-native';

import { colors, spacing } from '../../theme';
import type { GarageStackParamList } from '../types';
import { Card } from '../../components/common/Card';

type Props = {
  route: RouteProp<GarageStackParamList, 'PartsChecklist'>;
  navigation: NativeStackNavigationProp<GarageStackParamList, 'PartsChecklist'>;
};

export function PartsChecklistHeaderRight({ navigation, route }: Props) {
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('AddPart', { vehicleId: route.params.vehicleId })
      }
    >
      <Card padding={spacing.sm} style={styles.card}>
        <PlusIcon size={18} color={colors.bg} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: '100%',
    backgroundColor: colors.accent,
  },
});

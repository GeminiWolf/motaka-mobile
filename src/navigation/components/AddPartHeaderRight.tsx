import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderAction } from './AppHeader';
import type { GarageStackParamList } from '../types';

type Props = {
  vehicleId: string;
  navigation: NativeStackNavigationProp<GarageStackParamList>;
};

export function AddPartHeaderRight({ navigation, vehicleId }: Props) {
  return (
    <HeaderAction
      label="Add part"
      onPress={() => navigation.navigate('AddPart', { vehicleId })}
    />
  );
}

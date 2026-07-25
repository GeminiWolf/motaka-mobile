import React from 'react';
import { PlusIcon } from 'lucide-react-native';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme';
import { GarageStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type Props = {
  route: RouteProp<GarageStackParamList, 'CarDashboard'>;
  navigation: NativeStackNavigationProp<GarageStackParamList, 'CarDashboard'>;
};

export function CarDashboardHeaderRight({ navigation, route }: Props) {
  const handlePress = () => {
    navigation.navigate('AddPart', { vehicleId: route.params.vehicleId });
  };

  return (
    <Button
      label="Add Part"
      onPress={handlePress}
      radius="full"
      leftIcon={<PlusIcon size={16} color={colors.bg} />}
      size="sm"
    />
  );
}

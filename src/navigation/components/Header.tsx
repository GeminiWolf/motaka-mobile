import React from 'react';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { AppHeader, HeaderAction } from './AppHeader';

type HeaderProps = BottomTabHeaderProps;

export default function Header({ route, navigation, options }: HeaderProps) {
  const addVehicle = () => {
    navigation.getParent()?.navigate('AddVehicle');
  };

  return (
    <AppHeader
      title={options.title ?? route.name}
      right={
        route.name === 'GarageTab' ? (
          <HeaderAction label="Add vehicle" onPress={addVehicle} />
        ) : undefined
      }
    />
  );
}

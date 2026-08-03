import { View, StyleSheet } from 'react-native';
import React from 'react';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../components/common/Text';
import { colors, spacing } from '../../theme';
import { Badge } from '@react-navigation/elements';
import { Button } from '../../components/common/Button';
import { PlusIcon } from 'lucide-react-native';
import GarageForgeIcon from '../../assets/GarageForgeIcon';

type HeaderProps = BottomTabHeaderProps;

export default function Header({ route, navigation }: HeaderProps) {
  const { top } = useSafeAreaInsets();

  const addVehicle = () => {
    navigation.getParent()?.navigate('AddVehicle');
  };

  const addVehicleButton = () => {
    if (route.name === 'GarageTab') {
      return (
        <Button
          label="Add Vehicle"
          onPress={addVehicle}
          radius="full"
          leftIcon={<PlusIcon size={16} color={colors.bg} />}
          size="sm"
        />
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={[styles.row, { gap: spacing.sm }]}>
        <GarageForgeIcon
          size={32}
          color={colors.bg}
          backgroundColor={colors.accent}
        />
        <Text size="2xl" weight="bold" tone="accent">
          GarageForge
        </Text>
        <Badge visible={false} size={12} style={styles.badge}>
          PRO
        </Badge>
      </View>
      {addVehicleButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.slate500,
  },
  badge: {
    backgroundColor: colors.accent,
    color: colors.bg,
  },
});

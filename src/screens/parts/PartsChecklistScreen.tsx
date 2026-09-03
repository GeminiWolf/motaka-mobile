import { FlatList, StyleSheet, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EmptyState } from '../../components/common/EmptyState';
import { Screen } from '../../components/common/Screen';
import { TrackedPartRow } from '../../components/parts/TrackedPartRow';
import type { GarageStackParamList } from '../../navigation/types';
import { useGarageStore } from '../../store/garageStore';
import { colors, spacing } from '../../theme';
import { prioritizeParts } from '../../utils/healthSummary';
import { statusFromChecklistChecked } from '../../utils/partsChecklistStatus';
import { Card } from '../../components/common/Card';
import { ListChecks, Search, Wallet } from 'lucide-react-native';
import { Text } from '../../components/common/Text';
import { Input } from '../../components/common/Input';
import { Dropdown } from '../../components/common/Dropdown';
import type { DropdownOption } from '../../components/common/Dropdown';
import { useDebounce } from '../../hooks/useDebounce';
import type { PartPriority, PartStatus } from '../../types';

type Props = NativeStackScreenProps<GarageStackParamList, 'PartsChecklist'>;

const PRIORITIES: Array<PartPriority | 'all'> = [
  'all',
  'urgent',
  'soon',
  'someday',
];

const STATUSES: Array<PartStatus | 'all'> = [
  'all',
  'needed',
  'sourcing',
  'ordered',
  'installed',
];

const SORTS = ['priority', 'cost', 'name'] as const;

function formatOptionLabel(value: string): string {
  return value === 'all'
    ? 'All'
    : value.charAt(0).toUpperCase() + value.slice(1);
}

const prioritiesOptions: DropdownOption[] = PRIORITIES.map(priority => ({
  value: priority,
  label: formatOptionLabel(priority),
}));

const statusOptions: DropdownOption[] = STATUSES.map(status => ({
  value: status,
  label: formatOptionLabel(status),
}));

const sortOptions: DropdownOption[] = SORTS.map(sort => ({
  value: sort,
  label: formatOptionLabel(sort),
}));

export function PartsChecklistScreen({ navigation, route }: Props) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { vehicleId } = route.params;
  const vehicle = useGarageStore(s => s.vehicles.find(v => v.id === vehicleId));
  const trackedParts = useGarageStore(s => s.trackedParts);
  const updateTrackedPart = useGarageStore(s => s.updateTrackedPart);
  const currency = useGarageStore(s => s.settings.currency);

  const parts = useMemo(
    () => trackedParts.filter(p => p.vehicleId === vehicleId),
    [trackedParts, vehicleId],
  );

  const checklist = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const filtered = query
      ? parts.filter(
          p =>
            p.name.toLowerCase().includes(query) ||
            p.partNumber.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query),
        )
      : parts;
    return prioritizeParts(filtered);
  }, [parts, debouncedSearch]);

  const handlePartCheckedChange = (partId: string, checked: boolean) => {
    updateTrackedPart(partId, { status: statusFromChecklistChecked(checked) });
  };

  if (!vehicle) {
    return (
      <Screen>
        <EmptyState
          title="Vehicle not found"
          actionLabel="Back to garage"
          onAction={() => navigation.navigate('GarageHome')}
        />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.summaryContainer}>
        <Card bordered style={styles.summaryCard}>
          <Wallet size={28} color={colors.accent} />
          <Text size="lg" weight="semibold">
            R4000
          </Text>
          <Text size="sm">Remaining</Text>
        </Card>
        <Card bordered style={styles.summaryCard}>
          <ListChecks size={28} color={colors.graySoft} />
          <Text size="lg" weight="semibold">
            12
          </Text>
          <Text size="sm">Needed</Text>
        </Card>
        <Card bordered style={styles.summaryCard}>
          <Wallet size={28} color={colors.graySoft} />
          <Text size="lg" weight="semibold">
            R4000
          </Text>
          <Text size="sm">Spent</Text>
        </Card>
      </View>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search parts..."
          leftSection={<Search size={16} color={colors.graySoft} />}
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.dropdownContainer}>
          <Dropdown
            placeholder="Priority"
            style={styles.dropdown}
            items={prioritiesOptions}
          />
          <Dropdown
            placeholder="Status"
            style={styles.dropdown}
            items={statusOptions}
          />
          <Dropdown
            placeholder="Sort"
            style={styles.dropdown}
            items={sortOptions}
          />
        </View>
        <Text
          size="lg"
          weight="semibold"
        >{`Parts Checklist (${checklist.length})`}</Text>
      </View>
      <FlatList
        keyExtractor={item => item.id}
        data={checklist}
        contentContainerStyle={styles.checklistContent}
        renderItem={({ item }) => (
          <TrackedPartRow
            part={item}
            currency={currency}
            checkbox
            checked={item.status === 'installed'}
            onCheckedChange={checked =>
              handlePartCheckedChange(item.id, checked)
            }
            onPress={() =>
              navigation.navigate('PartDetail', { partId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No parts tracked yet"
            subtitle="Add the parts this car still needs."
            actionLabel="Add part"
            onAction={() => navigation.navigate('AddPart', { vehicleId })}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    marginHorizontal: spacing.lg,
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  content: {
    padding: 0,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  checklistContent: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  searchContainer: {
    marginHorizontal: spacing.lg,
    gap: spacing.md,
  },
  dropdownContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dropdown: {
    flex: 1,
  },
});

import React, { useMemo, useState, type ReactNode } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';

import { EmptyState } from '../common/EmptyState';
import { FilterTabs } from '../common/FilterTabs';
import { Input } from '../common/Input';
import { Text } from '../common/Text';
import type { GarageStackParamList } from '../../navigation/types';
import { useGarageStore } from '../../store/garageStore';
import { colors, layout, spacing, tabularNums } from '../../theme';
import { getChecklistParts } from '../../utils/filterChecklistParts';
import { statusFromChecklistChecked } from '../../utils/partsChecklistStatus';
import { useBudgetOverview } from '../../hooks/useBudgetOverview';
import { formatMoney } from '../../utils/formatMoney';
import { useDebounce } from '../../hooks/useDebounce';
import { TrackedPartRow } from './TrackedPartRow';

type Scope = 'open' | 'all' | 'urgent';

type Props = {
  vehicleId: string;
  navigation: NativeStackNavigationProp<GarageStackParamList>;
  header?: ReactNode;
  onRemoveVehicle?: () => void;
};

const SCOPE_OPTIONS: Array<{ value: Scope; label: string }> = [
  { value: 'open', label: 'Open' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'all', label: 'All' },
];

export function VehiclePartsWorkspace({
  vehicleId,
  navigation,
  header,
  onRemoveVehicle,
}: Props) {
  const [search, setSearch] = useState('');
  const [scope, setScope] = useState<Scope>('open');
  const debouncedSearch = useDebounce(search, 300);

  const trackedParts = useGarageStore(s => s.trackedParts);
  const updateTrackedPart = useGarageStore(s => s.updateTrackedPart);
  const currency = useGarageStore(s => s.settings.currency);

  const parts = useMemo(
    () => trackedParts.filter(part => part.vehicleId === vehicleId),
    [trackedParts, vehicleId],
  );

  const scopedParts = useMemo(() => {
    if (scope === 'open') {
      return parts.filter(part => part.status !== 'installed');
    }
    if (scope === 'urgent') {
      return parts.filter(
        part => part.priority === 'urgent' && part.status !== 'installed',
      );
    }
    return parts;
  }, [parts, scope]);

  const checklist = useMemo(
    () =>
      getChecklistParts(scopedParts, {
        query: debouncedSearch,
        sort: 'priority',
      }),
    [scopedParts, debouncedSearch],
  );

  const { totalNeeded } = useBudgetOverview(parts);
  const openCount = parts.filter(part => part.status !== 'installed').length;
  const hasQuery = search.trim() !== '';

  const handlePartCheckedChange = (partId: string, checked: boolean) => {
    updateTrackedPart(partId, { status: statusFromChecklistChecked(checked) });
  };

  return (
    <View style={styles.root}>
      {header}
      <View style={styles.summary}>
        <Text size="sm" tone="muted">
          {openCount === 0
            ? 'Build is clear'
            : `${openCount} still needed`}
        </Text>
        <Text size="sm" tone="muted" style={tabularNums}>
          {formatMoney(totalNeeded, currency)}
        </Text>
      </View>
      {parts.length > 0 ? (
        <View style={styles.tools}>
          <Input
            placeholder="Find a part"
            leftSection={<Search size={16} color={colors.textDim} />}
            value={search}
            onChangeText={setSearch}
          />
          <FilterTabs value={scope} options={SCOPE_OPTIONS} onChange={setScope} />
        </View>
      ) : null}
      <FlatList
        keyExtractor={item => item.id}
        data={checklist}
        contentContainerStyle={styles.list}
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
          parts.length === 0 ? (
            <EmptyState
              title="No parts on this build yet"
              subtitle="Add the pieces this car still needs. Checking one off marks it installed."
              actionLabel="Add part"
              onAction={() => navigation.navigate('AddPart', { vehicleId })}
            />
          ) : (
            <View style={styles.filterEmpty}>
              <Text tone="muted">
                {hasQuery ? 'Nothing matches' : 'Nothing in this view'}
              </Text>
              <Pressable
                onPress={() => {
                  if (hasQuery) {
                    setSearch('');
                    return;
                  }
                  setScope('all');
                }}
                accessibilityRole="button"
                style={({ pressed }) => pressed && styles.pressed}
              >
                <Text weight="medium">
                  {hasQuery ? 'Clear search' : 'Show all'}
                </Text>
              </Pressable>
            </View>
          )
        }
        ListFooterComponent={
          <View>
            {parts.length > 0 ? (
              <Pressable
                onPress={() => navigation.navigate('AddPart', { vehicleId })}
                accessibilityRole="button"
                accessibilityLabel="Add part"
                style={({ pressed }) => [
                  styles.footerAdd,
                  pressed && styles.pressed,
                ]}
              >
                <Text weight="medium">Add part</Text>
              </Pressable>
            ) : null}
            {onRemoveVehicle ? (
              <Pressable
                onPress={onRemoveVehicle}
                accessibilityRole="button"
                accessibilityLabel="Remove from garage"
                style={({ pressed }) => [
                  styles.footerAdd,
                  pressed && styles.pressed,
                ]}
              >
                <Text weight="medium" tone="danger">
                  Remove from garage
                </Text>
              </Pressable>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  tools: {
    paddingHorizontal: layout.gutter,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: layout.gutter,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  footerAdd: {
    minHeight: layout.rowMinHeight,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  filterEmpty: {
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.72,
  },
});

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button} from '../components/common/Button';
import { Chip } from '../components/common/Chip';
import {NestedCategorySheet} from '../components/common/NestedCategorySheet';
import {SectionHeader} from '../components/common/SectionHeader';
import type {GarageStackParamList} from '../navigation/types';
import {getParts} from '../services/api';
import {useGarageStore} from '../store/garageStore';
import type {
  CatalogPart,
  PartCategory,
  PartPriority,
  PartStatus,
} from '../types';
import {formatCategoryPath} from '../utils/formatCategoryPath';
import {getCatalogPartDefaults} from '../utils/getCatalogPartDefaults';
import {colors, radius, spacing, typography} from '../theme';
import ModalContainer from '../components/modal/ModalContainer';
import ModalHeader from '../components/modal/ModalHeader';
import ButtonIcon from '../components/common/ButtonIcon';
import { lightenColor } from '../utils/lightenColor';

type Props = NativeStackScreenProps<GarageStackParamList, 'AddPart'>;
type Tab = 'browse' | 'manual';

const PRIORITIES: PartPriority[] = ['urgent', 'soon', 'someday'];
const STATUSES: PartStatus[] = ['needed', 'sourcing', 'ordered', 'installed'];

export function AddPartScreen({navigation, route}: Props) {
  const {vehicleId} = route.params;
  const vehicle = useGarageStore(s => s.vehicles.find(v => v.id === vehicleId));
  const apiBaseUrl = useGarageStore(s => s.settings.apiBaseUrl);
  const addTrackedPart = useGarageStore(s => s.addTrackedPart);

  const [tab, setTab] = useState<Tab>('browse');
  const [query, setQuery] = useState('');
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [categoryPath, setCategoryPath] = useState<PartCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | null>(
    null,
  );
  const [catalogParts, setCatalogParts] = useState<CatalogPart[]>([]);
  const [results, setResults] = useState<CatalogPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogPart | null>(
    null,
  );

  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<PartPriority>('soon');
  const [status, setStatus] = useState<PartStatus>('needed');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedCatalog) {
      const defaults = getCatalogPartDefaults(
        selectedCatalog,
        formatCategoryPath(categoryPath) ||
          selectedCategory?.name ||
          'Catalog',
      );
      setName(defaults.name);
      setPartNumber(defaults.partNumber);
      setCategory(defaults.category);
    }
  }, [selectedCatalog, categoryPath, selectedCategory]);

  const filterResults = (parts: CatalogPart[], search: string) => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return parts;
    }
    return parts.filter(part => part.name.toLowerCase().includes(q));
  };

  useEffect(() => {
    setResults(filterResults(catalogParts, query));
  }, [catalogParts, query]);

  const loadByCategory = async (
    cat: PartCategory,
    path: PartCategory[],
  ) => {
    setSelectedCategory(cat);
    setCategoryPath(path);
    setCategory(formatCategoryPath(path) || cat.name);
    setSelectedCatalog(null);
    setLoading(true);
    setError('');
    try {
      const data = await getParts(apiBaseUrl, cat.id);
      setCatalogParts(data);
      setResults(filterResults(data, query));
    } catch (err: any) {
      setError(err.message || 'Failed to load parts');
      setCatalogParts([]);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (!name.trim() || !partNumber.trim()) {
      setError('Name and part number are required.');
      return;
    }
    const id = addTrackedPart({
      vehicleId,
      catalogPartId: selectedCatalog?.id,
      name: name.trim(),
      partNumber: partNumber.trim(),
      category: category.trim() || 'General',
      priority,
      status,
      estimatedCost: Number(estimatedCost) || 0,
      notes: notes.trim() || undefined,
    });
    navigation.replace('PartDetail', {partId: id});
  };

  const categoryLabel =
    formatCategoryPath(categoryPath) ||
    selectedCategory?.name ||
    'Choose category';

  return (
    <ModalContainer>
      <View style={styles.root}>
        <ModalHeader
          withHandle
          rightSection={
            <ButtonIcon
              icon="X"
              color={colors.textMuted}
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={[styles.flex, styles.sidePadding]}>
          <View>
            <SectionHeader
              title="Add part"
              subtitle={
                vehicle
                  ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                  : 'Track a part for this vehicle'
              }
            />
          </View>

          <View style={styles.tabs}>
            {(['browse', 'manual'] as Tab[]).map(t => (
              <Pressable
                key={t}
                style={[styles.tab, tab === t && styles.tabActive]}
                onPress={() => setTab(t)}
              >
                <Text style={styles.tabText}>
                  {t === 'browse' ? 'Browse' : 'Manual'}
                </Text>
              </Pressable>
            ))}
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex}
          >
            <ScrollView style={styles.flex}>
              {error ? <Text style={styles.error}>{error}</Text> : null}

              {tab === 'browse' ? (
                <View style={styles.block}>
                  <Text style={styles.hint}>Browse parts by category</Text>
                  <Pressable
                    style={styles.categoryField}
                    onPress={() => setCategorySheetOpen(true)}
                  >
                    <Text style={styles.fieldLabel}>Category</Text>
                    <Text style={styles.categoryValue}>{categoryLabel}</Text>
                  </Pressable>

                  {selectedCategory ? (
                    <TextInput
                      style={styles.input}
                      placeholder="Filter by name"
                      placeholderTextColor={colors.textDim}
                      value={query}
                      onChangeText={setQuery}
                      accessibilityLabel="Filter catalog parts by name"
                    />
                  ) : null}
                  {loading ? (
                    <ActivityIndicator color={colors.accent} />
                  ) : selectedCategory && results.length === 0 ? (
                    <Text style={styles.emptyResults}>
                      No parts in this category match your search.
                    </Text>
                  ) : (
                    results.map(part => (
                      <Pressable
                        key={part.id}
                        style={[
                          styles.result,
                          selectedCatalog?.id === part.id &&
                            styles.resultSelected,
                        ]}
                        onPress={() => setSelectedCatalog(part)}
                      >
                        <Text style={styles.resultName}>{part.name}</Text>
                      </Pressable>
                    ))
                  )}
                </View>
              ) : null}

              {(tab === 'manual' || selectedCatalog) && (
                <>
                  <SectionHeader
                    title="Details"
                    subtitle="Priority, notes, estimate"
                  />
                  <Field label="Name" value={name} onChangeText={setName} />
                  <Field
                    label="Part number"
                    value={partNumber}
                    onChangeText={setPartNumber}
                  />
                  <Field
                    label="Category"
                    value={category}
                    onChangeText={setCategory}
                  />
                  <Field
                    label="Estimated cost"
                    value={estimatedCost}
                    onChangeText={setEstimatedCost}
                    keyboardType="decimal-pad"
                  />
                  <Field label="Notes" value={notes} onChangeText={setNotes} />
                  <Text style={styles.fieldLabel}>Priority</Text>
                  <View style={styles.chips}>
                    {PRIORITIES.map(p => (
                      <Chip
                        key={p}
                        label={p}
                        selected={priority === p}
                        onPress={() => setPriority(p)}
                      />
                    ))}
                  </View>
                  <Text style={styles.fieldLabel}>Status</Text>
                  <View style={styles.chips}>
                    {STATUSES.map(s => (
                      <Chip
                        key={s}
                        label={s}
                        selected={status === s}
                        onPress={() => setStatus(s)}
                      />
                    ))}
                  </View>
                  <Button label="Save tracked part" onPress={save} />
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        <NestedCategorySheet
          visible={categorySheetOpen}
          baseUrl={apiBaseUrl}
          selectedId={selectedCategory?.id}
          onClose={() => setCategorySheetOpen(false)}
          onSelect={loadByCategory}
        />
      </View>
    </ModalContainer>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'decimal-pad';
}) {
  return (
    <View style={{marginBottom: spacing.sm}}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textDim}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  flex: {
    flex: 1,
  },
  sidePadding: {
    paddingHorizontal: spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: colors.accentSoft,
  },
  tabText: {
    ...typography.caption,
    color: colors.text,
    textTransform: 'capitalize',
  },
  block: {
    flex: 1,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  form: {
    flex: 1,
    gap: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  categoryField: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  categoryValue: {
    ...typography.body,
    color: colors.text,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyResults: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  result: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  resultSelected: {
    borderColor: colors.accent,
  },
  resultName: {
    ...typography.subtitle,
    color: colors.text,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
});

import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button} from '../../components/common/Button';
import { Chip } from '../../components/common/Chip';
import {Input} from '../../components/common/Input';
import { NestedCategorySheet } from '../../components/common/NestedCategorySheet';
import {SkeletonList} from '../../components/common/Skeleton';
import {Text} from '../../components/common/Text';
import type {GarageStackParamList} from '../../navigation/types';
import {getParts} from '../../services/api';
import {useGarageStore} from '../../store/garageStore';
import type {
  CatalogPartOption,
  PartCategoryOption,
  PartPriority,
} from '../../types';
import {formatCategoryPath} from '../../utils/formatCategoryPath';
import {getCatalogPartDefaults} from '../../utils/getCatalogPartDefaults';
import { colors, layout, spacing } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<GarageStackParamList, 'AddPart'>;

const PRIORITIES: PartPriority[] = ['urgent', 'soon', 'someday'];
const SAVE_VALIDATION_ERROR = 'Name is required.';

export function AddPartScreen({navigation, route}: Props) {
  const { bottom } = useSafeAreaInsets();
  const { vehicleId } = route.params;
  const apiBaseUrl = useGarageStore(s => s.settings.apiBaseUrl);
  const addTrackedPart = useGarageStore(s => s.addTrackedPart);

  const [manual, setManual] = useState(false);
  const [query, setQuery] = useState('');
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [categoryPath, setCategoryPath] = useState<PartCategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<PartCategoryOption | null>(null);
  const [catalogParts, setCatalogParts] = useState<CatalogPartOption[]>([]);
  const [results, setResults] = useState<CatalogPartOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCatalog, setSelectedCatalog] =
    useState<CatalogPartOption | null>(null);

  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<PartPriority>('soon');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');

  const showDetails = manual || selectedCatalog != null;

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

  const filterResults = (parts: CatalogPartOption[], search: string) => {
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
    cat: PartCategoryOption,
    path: PartCategoryOption[],
  ) => {
    setSelectedCategory(cat);
    setCategoryPath(path);
    setCategory(formatCategoryPath(path) || cat.name);
    setSelectedCatalog(null);
    setManual(false);
    setLoading(true);
    setError('');
    try {
      const data = await getParts(apiBaseUrl, cat.id);
      setCatalogParts(data);
      setResults(filterResults(data, query));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load parts';
      setError(message);
      setCatalogParts([]);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (!name.trim()) {
      setError(SAVE_VALIDATION_ERROR);
      return;
    }
    addTrackedPart({
      vehicleId,
      name: name.trim(),
      partNumber: partNumber.trim(),
      category: category.trim() || 'General',
      priority,
      status: 'needed',
      estimatedCost: Number(estimatedCost) || 0,
      notes: notes.trim() || undefined,
    });
    navigation.goBack();
  };

  const categoryLabel =
    formatCategoryPath(categoryPath) ||
    selectedCategory?.name ||
    'Choose a category';
  const canRetryLoad =
    error !== '' &&
    error !== SAVE_VALIDATION_ERROR &&
    selectedCategory != null;

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: bottom }]}
          keyboardShouldPersistTaps="handled"
        >
          {error ? (
            <View style={styles.errorRow}>
              <Text variant="caption" tone="danger" style={styles.error}>
                {error}
              </Text>
              {canRetryLoad ? (
                <Button
                  label="Retry"
                  variant="ghost"
                  size="sm"
                  onPress={() => {
                    if (selectedCategory == null) {
                      return;
                    }
                    loadByCategory(selectedCategory, categoryPath);
                  }}
                />
              ) : null}
            </View>
          ) : null}

          <Text tone="muted">
            Start from the catalogue. If the part isn’t listed, enter it
            yourself.
          </Text>

          <Pressable
            style={styles.categoryField}
            onPress={() => setCategorySheetOpen(true)}
          >
            <Text variant="label" tone="muted">
              Category
            </Text>
            <Text variant="subtitle">{categoryLabel}</Text>
          </Pressable>

          {selectedCategory && !manual && selectedCatalog == null ? (
            <Input
              placeholder="Filter by name"
              value={query}
              onChangeText={setQuery}
              accessibilityLabel="Filter catalog parts by name"
            />
          ) : null}

          {!manual && loading ? <SkeletonList count={5} /> : null}

          {!manual && selectedCategory && !loading && selectedCatalog == null
            ? results.map(part => (
                <Pressable
                  key={part.id}
                  style={styles.result}
                  onPress={() => setSelectedCatalog(part)}
                >
                  <Text tone="muted">{part.name}</Text>
                </Pressable>
              ))
            : null}

          {!manual && selectedCatalog ? (
            <Pressable
              onPress={() => setSelectedCatalog(null)}
              style={styles.result}
            >
              <Text variant="label" tone="muted">
                Selected
              </Text>
              <Text variant="subtitle">{selectedCatalog.name}</Text>
              <Text size="sm" tone="muted">
                Choose a different part
              </Text>
            </Pressable>
          ) : null}

          {!manual &&
          selectedCategory &&
          !loading &&
          selectedCatalog == null &&
          results.length === 0 ? (
            <Text variant="caption" tone="muted" style={styles.emptyResults}>
              Nothing in this category matches.
            </Text>
          ) : null}

          {!manual ? (
            <Pressable
              onPress={() => {
                setManual(true);
                setSelectedCatalog(null);
              }}
              style={styles.manualLink}
            >
              <Text weight="medium">Can’t find it? Enter it manually</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setManual(false)}
              style={styles.manualLink}
            >
              <Text tone="muted">Back to catalogue</Text>
            </Pressable>
          )}

          {showDetails ? (
            <View style={styles.details}>
              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                containerStyle={styles.field}
              />
              <Input
                label="Part number"
                value={partNumber}
                onChangeText={setPartNumber}
                containerStyle={styles.field}
              />
              <Input
                label="Estimated cost"
                value={estimatedCost}
                onChangeText={setEstimatedCost}
                keyboardType="decimal-pad"
                containerStyle={styles.field}
              />
              <Input
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                containerStyle={styles.field}
              />
              <Text variant="label" tone="muted">
                Priority
              </Text>
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
            </View>
          ) : null}
        </ScrollView>
        {showDetails ? (
          <View style={[styles.footer, { paddingBottom: bottom + spacing.md }]}>
            <Button label="Save to this build" onPress={save} />
          </View>
        ) : null}
      </KeyboardAvoidingView>

      <NestedCategorySheet
        visible={categorySheetOpen}
        baseUrl={apiBaseUrl}
        selectedId={selectedCategory?.id}
        onClose={() => setCategorySheetOpen(false)}
        onSelect={loadByCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  categoryField: {
    paddingVertical: spacing.md,
    borderBottomWidth: layout.hairline,
    borderBottomColor: colors.borderSubtle,
    gap: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyResults: {
    paddingVertical: spacing.sm,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  error: {
    flex: 1,
  },
  result: {
    paddingVertical: spacing.md,
    borderBottomWidth: layout.hairline,
    borderBottomColor: colors.borderSubtle,
  },
  field: {
    marginBottom: spacing.sm,
  },
  details: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  manualLink: {
    paddingVertical: spacing.md,
  },
  footer: {
    paddingHorizontal: layout.gutter,
    paddingVertical: spacing.md,
    borderTopWidth: layout.hairline,
    borderTopColor: colors.borderSubtle,
  },
});

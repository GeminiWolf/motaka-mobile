import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button} from '../components/common/Button';
import {ModalScreen} from '../components/common/ModalScreen';
import {SearchableBottomSheet} from '../components/common/SearchableBottomSheet';
import {SectionHeader} from '../components/common/SectionHeader';
import type {GarageStackParamList} from '../navigation/types';
import {getMakes, getModels, getModelYears} from '../services/api';
import {useGarageStore} from '../store/garageStore';
import type {Make, Model, ModelYear} from '../types';
import {colors, radius, spacing, typography} from '../theme';

type Props = NativeStackScreenProps<GarageStackParamList, 'AddVehicle'>;
type SheetKind = 'makes' | 'models' | 'years';

export function AddVehicleScreen({navigation}: Props) {
  const apiBaseUrl = useGarageStore(s => s.settings.apiBaseUrl);
  const addVehicle = useGarageStore(s => s.addVehicle);

  const [makes, setMakes] = useState<Make[]>([]);
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelYears, setModelYears] = useState<ModelYear[]>([]);
  const [selectedModelYear, setSelectedModelYear] = useState<ModelYear | null>(
    null,
  );
  const [openSheet, setOpenSheet] = useState<SheetKind | null>(null);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoadingMakes(true);
    setError('');
    getMakes(apiBaseUrl)
      .then(data => {
        if (!cancelled) {
          setMakes(data);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'Failed to load makes');
          setMakes([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingMakes(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!selectedMake) {
      return;
    }
    let cancelled = false;
    setLoadingModels(true);
    setError('');
    getModels(apiBaseUrl, selectedMake.id)
      .then(data => {
        if (!cancelled) {
          setModels(data);
          setSelectedModel(null);
          setModelYears([]);
          setSelectedModelYear(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'Failed to load models');
          setModels([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingModels(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedMake, apiBaseUrl]);

  useEffect(() => {
    if (!selectedModel) {
      return;
    }
    let cancelled = false;
    setLoadingYears(true);
    setError('');
    getModelYears(apiBaseUrl, selectedModel.id)
      .then(data => {
        if (!cancelled) {
          setModelYears(data);
          setSelectedModelYear(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'Failed to load years');
          setModelYears([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingYears(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedModel, apiBaseUrl]);

  const makeOptions = useMemo(
    () => makes.map(m => ({key: m.id, label: m.name})),
    [makes],
  );
  const modelOptions = useMemo(
    () => models.map(m => ({key: m.id, label: m.name})),
    [models],
  );
  const yearOptions = useMemo(
    () => modelYears.map(y => ({key: y.id, label: String(y.year)})),
    [modelYears],
  );

  const sheetConfig = useMemo(() => {
    switch (openSheet) {
      case 'makes':
        return {
          title: 'Select make',
          options: makeOptions,
          selectedKey: selectedMake?.id,
          searchPlaceholder: 'Search makes',
          onSelect: (key: string) => {
            const make = makes.find(m => m.id === key) ?? null;
            setSelectedMake(make);
            setValidationError('');
          },
        };
      case 'models':
        return {
          title: 'Select model',
          options: modelOptions,
          selectedKey: selectedModel?.id,
          searchPlaceholder: 'Search models',
          onSelect: (key: string) => {
            const model = models.find(m => m.id === key) ?? null;
            setSelectedModel(model);
            setValidationError('');
          },
        };
      case 'years':
        return {
          title: 'Select year',
          options: yearOptions,
          selectedKey: selectedModelYear?.id,
          searchPlaceholder: 'Search years',
          onSelect: (key: string) => {
            const year = modelYears.find(y => y.id === key) ?? null;
            setSelectedModelYear(year);
            setValidationError('');
          },
        };
      default:
        return null;
    }
  }, [
    openSheet,
    makeOptions,
    modelOptions,
    yearOptions,
    makes,
    models,
    modelYears,
    selectedMake?.id,
    selectedModel?.id,
    selectedModelYear?.id,
  ]);

  const save = () => {
    if (!selectedMake || !selectedModel || !selectedModelYear) {
      const missing = [
        !selectedMake ? 'make' : null,
        !selectedModel ? 'model' : null,
        !selectedModelYear ? 'year' : null,
      ].filter(Boolean);
      setValidationError(`Choose ${missing.join(', ')} to save.`);
      return;
    }
    setValidationError('');
    const id = addVehicle({
      year: selectedModelYear.year,
      make: selectedMake.name,
      model: selectedModel.name,
      trim: 'Standard',
      modelYearId: selectedModelYear.id,
    });
    navigation.replace('CarDashboard', {vehicleId: id});
  };

  return (
    <ModalScreen scroll onClose={() => navigation.goBack()}>
      <SectionHeader title="Add vehicle" subtitle="Make → model → year" />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {validationError ? (
        <Text style={styles.error}>{validationError}</Text>
      ) : null}

      <View style={styles.block}>
        <FieldButton
          label="Make"
          value={selectedMake?.name || 'Choose make'}
          hint={loadingMakes ? 'Loading makes…' : undefined}
          loading={loadingMakes}
          onPress={() => setOpenSheet('makes')}
        />
        <FieldButton
          label="Model"
          value={selectedModel?.name || 'Choose model'}
          hint={
            !selectedMake
              ? 'Pick a make first'
              : loadingModels
                ? 'Loading models…'
                : undefined
          }
          disabled={!selectedMake || loadingModels}
          loading={loadingModels}
          onPress={() => setOpenSheet('models')}
        />
        <FieldButton
          label="Year"
          value={
            selectedModelYear
              ? String(selectedModelYear.year)
              : 'Choose year'
          }
          hint={
            !selectedModel
              ? 'Pick a model first'
              : loadingYears
                ? 'Loading years…'
                : undefined
          }
          disabled={!selectedModel || loadingYears}
          loading={loadingYears}
          onPress={() => setOpenSheet('years')}
        />
        <Button
          label="Save to garage"
          onPress={save}
          disabled={loadingMakes || loadingModels || loadingYears}
          style={{marginTop: spacing.md}}
        />
      </View>

      <SearchableBottomSheet
        visible={sheetConfig != null}
        title={sheetConfig?.title ?? ''}
        options={sheetConfig?.options ?? []}
        selectedKey={sheetConfig?.selectedKey}
        searchPlaceholder={sheetConfig?.searchPlaceholder}
        onClose={() => setOpenSheet(null)}
        onSelect={option => sheetConfig?.onSelect(option.key)}
      />
    </ModalScreen>
  );
}

function FieldButton({
  label,
  value,
  hint,
  disabled,
  loading,
  onPress,
}: {
  label: string;
  value: string;
  hint?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value}`}
      accessibilityHint={hint}
      accessibilityState={{disabled: !!disabled}}
      style={[styles.field, disabled && styles.disabled]}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {loading ? <ActivityIndicator color={colors.accent} size="small" /> : null}
      </View>
      <Text style={styles.fieldValue}>{value}</Text>
      {hint && !loading ? <Text style={styles.fieldHint}>{hint}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.sm,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  field: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  disabled: {
    opacity: 0.45,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  fieldValue: {
    ...typography.body,
    color: colors.text,
  },
  fieldHint: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: 4,
  },
});

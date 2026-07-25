import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button} from '../components/common/Button';
import {Chip} from '../components/common/Chip';
import {EmptyState} from '../components/common/EmptyState';
import {Screen} from '../components/common/Screen';
import {SectionHeader} from '../components/common/SectionHeader';
import type {GarageStackParamList} from '../navigation/types';
import {useGarageStore} from '../store/garageStore';
import type {PartPriority, PartStatus} from '../types';
import {colors, radius, spacing, typography} from '../theme';

type Props = NativeStackScreenProps<GarageStackParamList, 'PartDetail'>;

const PRIORITIES: PartPriority[] = ['urgent', 'soon', 'someday'];
const STATUSES: PartStatus[] = ['needed', 'sourcing', 'ordered', 'installed'];
const SAVE_DEBOUNCE_MS = 500;

type PartDraft = {
  estimatedCost: string;
  actualCost: string;
  source: string;
  notes: string;
};

export function PartDetailScreen({navigation, route}: Props) {
  const {partId} = route.params;
  const part = useGarageStore(s => s.trackedParts.find(p => p.id === partId));
  const updateTrackedPart = useGarageStore(s => s.updateTrackedPart);
  const removeTrackedPart = useGarageStore(s => s.removeTrackedPart);

  const [draft, setDraft] = useState<PartDraft>({
    estimatedCost: '',
    actualCost: '',
    source: '',
    notes: '',
  });
  const [savedVisible, setSavedVisible] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!part) {
      return;
    }
    setDraft({
      estimatedCost:
        part.estimatedCost != null ? String(part.estimatedCost) : '',
      actualCost: part.actualCost != null ? String(part.actualCost) : '',
      source: part.source || '',
      notes: part.notes || '',
    });
  }, [partId]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const flashSaved = () => {
    setSavedVisible(true);
    if (savedTimerRef.current) {
      clearTimeout(savedTimerRef.current);
    }
    savedTimerRef.current = setTimeout(() => setSavedVisible(false), 1500);
  };

  const persistDraft = (next: PartDraft) => {
    if (!part) {
      return;
    }
    updateTrackedPart(part.id, {
      estimatedCost: Number(next.estimatedCost) || 0,
      actualCost:
        next.actualCost.trim() === ''
          ? undefined
          : Number(next.actualCost) || 0,
      source: next.source.trim() || undefined,
      notes: next.notes.trim() || undefined,
    });
    flashSaved();
  };

  const queueDraftSave = (next: PartDraft) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => persistDraft(next), SAVE_DEBOUNCE_MS);
  };

  const updateDraftField = <K extends keyof PartDraft>(
    key: K,
    value: PartDraft[K],
  ) => {
    setDraft(prev => {
      const next = {...prev, [key]: value};
      queueDraftSave(next);
      return next;
    });
  };

  if (!part) {
    return (
      <Screen>
        <EmptyState
          title="Part not found"
          actionLabel="Back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{part.name}</Text>
          <Text style={styles.number}>#{part.partNumber}</Text>
          <Text style={styles.meta}>{part.category}</Text>
        </View>
        {savedVisible ? <Text style={styles.saved}>Saved</Text> : null}
      </View>

      <SectionHeader title="Status" subtitle="Tap to update" />
      <View style={styles.chips}>
        {STATUSES.map(s => (
          <Chip
            key={s}
            label={s}
            selected={part.status === s}
            onPress={() => {
              updateTrackedPart(part.id, {status: s});
              flashSaved();
            }}
          />
        ))}
      </View>

      <SectionHeader title="Priority" subtitle="Tap to update" />
      <View style={styles.chips}>
        {PRIORITIES.map(p => (
          <Chip
            key={p}
            label={p}
            selected={part.priority === p}
            onPress={() => {
              updateTrackedPart(part.id, {priority: p});
              flashSaved();
            }}
          />
        ))}
      </View>

      <Field
        label="Estimated cost"
        value={draft.estimatedCost}
        onChangeText={v => updateDraftField('estimatedCost', v)}
        keyboardType="decimal-pad"
      />
      <Field
        label="Actual cost"
        value={draft.actualCost}
        onChangeText={v => updateDraftField('actualCost', v)}
        keyboardType="decimal-pad"
      />
      <Field
        label="Source"
        value={draft.source}
        onChangeText={v => updateDraftField('source', v)}
      />
      <Field
        label="Notes"
        value={draft.notes}
        onChangeText={v => updateDraftField('notes', v)}
      />

      <Button
        label="Delete tracked part"
        variant="danger"
        onPress={() => {
          Alert.alert('Delete part', 'Remove this part from the tracker?', [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                removeTrackedPart(part.id);
                navigation.goBack();
              },
            },
          ]);
        }}
        style={{marginTop: spacing.xl}}
      />
    </Screen>
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
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  number: {
    ...typography.mono,
    color: colors.textMuted,
    marginTop: 4,
  },
  meta: {
    ...typography.caption,
    color: colors.textDim,
  },
  saved: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
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
});

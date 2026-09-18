import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button} from '../../components/common/Button';
import {Chip} from '../../components/common/Chip';
import {EmptyState} from '../../components/common/EmptyState';
import {Input} from '../../components/common/Input';
import {Screen} from '../../components/common/Screen';
import {SectionHeader} from '../../components/common/SectionHeader';
import {Text} from '../../components/common/Text';
import type {GarageStackParamList} from '../../navigation/types';
import {useGarageStore} from '../../store/garageStore';
import type {PartPriority, PartStatus} from '../../types';
import {spacing} from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<GarageStackParamList, 'PartDetail'>;

const PRIORITIES: PartPriority[] = ['urgent', 'soon', 'someday'];
const STATUSES: PartStatus[] = ['needed', 'sourcing', 'ordered', 'installed'];
const SAVE_DEBOUNCE_MS = 500;

type PartDraft = {
  name: string;
  partNumber: string;
  estimatedCost: string;
  actualCost: string;
  source: string;
  notes: string;
};

export function PartDetailScreen({navigation, route}: Props) {
  const { bottom } = useSafeAreaInsets();
  const {partId} = route.params;
  const part = useGarageStore(s => s.trackedParts.find(p => p.id === partId));
  const updateTrackedPart = useGarageStore(s => s.updateTrackedPart);
  const removeTrackedPart = useGarageStore(s => s.removeTrackedPart);

  const [draft, setDraft] = useState<PartDraft>({
    name: '',
    partNumber: '',
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
      name: part.name,
      partNumber: part.partNumber,
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
      name: next.name.trim() || part.name,
      partNumber: next.partNumber.trim() || part.partNumber,
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
        <Text variant="caption" tone="dim">
          {part.category}
        </Text>
        {savedVisible ? (
          <Text variant="caption" tone="accent" weight="semibold">
            Saved
          </Text>
        ) : null}
      </View>

      <Input
        label="Name"
        value={draft.name}
        onChangeText={v => updateDraftField('name', v)}
        containerStyle={styles.field}
      />
      <Input
        label="Part number"
        value={draft.partNumber}
        onChangeText={v => updateDraftField('partNumber', v)}
        containerStyle={styles.field}
      />

      <SectionHeader title="Status" />
      <View style={styles.chips}>
        {STATUSES.map(s => (
          <Chip
            key={s}
            label={s}
            selected={part.status === s}
            onPress={() => {
              updateTrackedPart(part.id, { status: s });
              flashSaved();
            }}
          />
        ))}
      </View>

      <SectionHeader title="Priority" />
      <View style={styles.chips}>
        {PRIORITIES.map(p => (
          <Chip
            key={p}
            label={p}
            selected={part.priority === p}
            onPress={() => {
              updateTrackedPart(part.id, { priority: p });
              flashSaved();
            }}
          />
        ))}
      </View>

      <Input
        label="Estimated cost"
        value={draft.estimatedCost}
        onChangeText={v => updateDraftField('estimatedCost', v)}
        keyboardType="decimal-pad"
        containerStyle={styles.field}
      />
      <Input
        label="Actual cost"
        value={draft.actualCost}
        onChangeText={v => updateDraftField('actualCost', v)}
        keyboardType="decimal-pad"
        containerStyle={styles.field}
      />
      <Input
        label="Source"
        value={draft.source}
        onChangeText={v => updateDraftField('source', v)}
        containerStyle={styles.field}
      />
      <Input
        label="Notes"
        value={draft.notes}
        onChangeText={v => updateDraftField('notes', v)}
        containerStyle={styles.field}
      />

      <Button
        label="Remove from this build"
        variant="danger"
        onPress={() => {
          Alert.alert('Delete part', 'Remove this part from the tracker?', [
            { text: 'Cancel', style: 'cancel' },
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
        style={{ marginTop: spacing.xl, marginBottom: bottom + spacing.md }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.sm,
  },
});

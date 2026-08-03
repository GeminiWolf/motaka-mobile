import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { Button } from '../components/common/Button';
import { Chip } from '../components/common/Chip';
import { SearchableBottomSheet } from '../components/common/SearchableBottomSheet';
import { probeApiHealth } from '../services/api';
import { useGarageStore } from '../store/garageStore';
import type { CurrencyCode } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import { Badge, type BadgeTone } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Text } from '../components/common/Text';
import { Input } from '../components/common/Input';
import { regionOptions } from '../utils/constants';
import { withOpacity } from '../utils/withOpacity';

const CURRENCIES: CurrencyCode[] = ['ZAR', 'USD', 'EUR'];

const REGION_SHEET_OPTIONS = regionOptions.map(option => ({
  key: option.value,
  label: option.label,
}));

type ProbeState = 'idle' | 'checking' | 'ok' | 'fail';

const PROBE_BADGE: Record<ProbeState, { label: string; tone: BadgeTone }> = {
  idle: { label: 'Not checked', tone: 'muted' },
  checking: { label: 'Checking…', tone: 'info' },
  ok: { label: 'Connected', tone: 'accent' },
  fail: { label: 'Unreachable', tone: 'warning' },
};

export function SettingsScreen() {
  const settings = useGarageStore(s => s.settings);
  const updateSettings = useGarageStore(s => s.updateSettings);
  const clearGarage = useGarageStore(s => s.clearGarage);
  const hasHydrated = useGarageStore(s => s.hasHydrated);

  const [apiUrlDraft, setApiUrlDraft] = useState(settings.apiBaseUrl);
  const [tokenDraft, setTokenDraft] = useState(settings.apiBearerToken);
  const [probe, setProbe] = useState<ProbeState>('idle');

  const [openRegionSheet, setOpenRegionSheet] = useState(false);

  const regionLabel =
    regionOptions.find(option => option.value === settings.region)?.label ??
    settings.region;

  useEffect(() => {
    setApiUrlDraft(settings.apiBaseUrl);
  }, [settings.apiBaseUrl]);

  useEffect(() => {
    setTokenDraft(settings.apiBearerToken);
  }, [settings.apiBearerToken]);

  const runProbe = async (url = settings.apiBaseUrl) => {
    setProbe('checking');
    const ok = await probeApiHealth(url);
    setProbe(ok ? 'ok' : 'fail');
  };

  useEffect(() => {
    if (hasHydrated) {
      runProbe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, settings.apiBaseUrl, settings.apiBearerToken]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.sidePadding]}>
        <Text size="lg" tone="white">
          Settings & API
        </Text>
        <Text tone="slate">Preferences and backend integrations</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Card gap="md">
          <Text tone="white">Display Currency</Text>
          <View style={styles.chips}>
            {CURRENCIES.map(code => (
              <Chip
                key={code}
                label={code}
                selected={settings.currency === code}
                onPress={() => updateSettings({ currency: code })}
                stretch
              />
            ))}
          </View>
        </Card>

        <Card gap="md">
          <Text tone="white">Region</Text>
          <Pressable
            style={styles.flex}
            onPress={() => setOpenRegionSheet(true)}
            accessibilityRole="button"
            accessibilityLabel={`Region, ${regionLabel}`}
          >
            <Card backgroundColor="surface" bordered>
              <Text tone="white">{regionLabel}</Text>
            </Card>
          </Pressable>
        </Card>

        <Card gap="md">
          <View style={styles.statusRow}>
            <Text tone="white">API Connection Status</Text>
            <Badge
              label={PROBE_BADGE[probe].label}
              tone={PROBE_BADGE[probe].tone}
              leftSection={
                probe === 'checking' ? (
                  <ActivityIndicator size="small" color={colors.info} />
                ) : (
                  <View style={[styles.statusDot, styles[`dot_${probe}`]]} />
                )
              }
            />
          </View>

          <Text>Base Endpoint</Text>
          <Input
            value={apiUrlDraft}
            onChangeText={setApiUrlDraft}
            placeholder="https://api.example.com"
            placeholderTextColor={colors.textDim}
          />

          <View style={styles.row}>
            <Button
              label="Save API"
              onPress={() => {
                updateSettings({
                  apiBaseUrl: apiUrlDraft.trim(),
                  apiBearerToken: tokenDraft.trim(),
                });
                runProbe(apiUrlDraft.trim());
              }}
              style={styles.flex}
            />
            <Button
              label="Probe"
              variant="secondary"
              onPress={() => {
                updateSettings({
                  apiBaseUrl: apiUrlDraft.trim(),
                  apiBearerToken: tokenDraft.trim(),
                });
                runProbe(apiUrlDraft.trim());
              }}
              style={styles.flex}
            />
          </View>
        </Card>

        <Card style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={styles.switchTitle}>Notifications</Text>
            <Text style={styles.switchSub}>Coming soon</Text>
          </View>
          <Switch
            value={false}
            disabled
            trackColor={{ false: colors.border, true: colors.accentDim }}
            thumbColor={colors.textDim}
          />
        </Card>

        <Card style={styles.dangerCard}>
          <Text tone="danger">Danger Zone</Text>
          <View style={styles.dangerButtonContainer}>
            <Text tone="dim">Wipe local garage cache and reset all data</Text>
            <Button
              label="Clear garage"
              variant="danger"
              onPress={() => {
                Alert.alert(
                  'Clear garage',
                  'Remove all vehicles and tracked parts? Settings kept except garage data.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear',
                      style: 'destructive',
                      onPress: clearGarage,
                    },
                  ],
                );
              }}
            />
          </View>
        </Card>
      </ScrollView>

      <SearchableBottomSheet
        visible={openRegionSheet}
        title="Region"
        options={REGION_SHEET_OPTIONS}
        selectedKey={settings.region}
        searchable={false}
        onClose={() => setOpenRegionSheet(false)}
        onSelect={option => updateSettings({ region: option.key })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  headerContainer: {
    gap: spacing.xs,
  },
  sidePadding: {
    paddingHorizontal: spacing.md,
  },
  contentContainer: {
    gap: spacing.lg,
    marginHorizontal: spacing.md,
  },
  dangerCard: {
    backgroundColor: withOpacity(colors.danger, 0.1),
    borderColor: colors.danger,
    gap: spacing.md,
  },
  dangerButtonContainer: {
    gap: spacing.sm,
  },
  brand: {
    ...typography.hero,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 4,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  helper: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dot_idle: {
    backgroundColor: colors.slate400,
  },
  dot_ok: {
    backgroundColor: colors.accent,
  },
  dot_fail: {
    backgroundColor: colors.warning,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  switchTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  switchSub: {
    ...typography.caption,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  probe: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    minHeight: 24,
    justifyContent: 'center',
  },
  probeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  ok: {
    color: colors.accent,
  },
  fail: {
    color: colors.warning,
  },
});

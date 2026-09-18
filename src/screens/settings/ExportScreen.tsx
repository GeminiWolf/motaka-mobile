import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { EmptyState } from '../../components/common/EmptyState';
import { List } from '../../components/common/List';
import { Text } from '../../components/common/Text';
import { ApiError, exportVehiclePdf } from '../../services/api';
import { useGarageStore } from '../../store/garageStore';
import { colors, layout, spacing } from '../../theme';
import type { Vehicle } from '../../types';
import {
  buildGarageExportPayload,
  getPartsExportDescription,
  getTrackedPartsForVehicle,
  getVehicleExportLabel,
} from '../../utils/garageExport';
import { sharePdfFile } from '../../utils/sharePdf';

export default function ExportScreen() {
  const vehicles = useGarageStore(s => s.vehicles);
  const trackedParts = useGarageStore(s => s.trackedParts);
  const settings = useGarageStore(s => s.settings);
  const [exportingVehicleId, setExportingVehicleId] = useState<string | null>(
    null,
  );

  const runExport = async (vehicle: Vehicle) => {
    if (exportingVehicleId != null) {
      return;
    }

    setExportingVehicleId(vehicle.id);
    try {
      const vehicleParts = getTrackedPartsForVehicle(trackedParts, vehicle.id);
      const payload = buildGarageExportPayload({
        vehicles: [vehicle],
        trackedParts: vehicleParts,
        settings,
      });
      const { path, filename } = await exportVehiclePdf(
        settings.apiBaseUrl,
        payload,
      );
      await sharePdfFile(path, filename);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Could not export this vehicle.';
      Alert.alert('Export failed', message);
    } finally {
      setExportingVehicleId(null);
    }
  };

  const exportVehicle = (vehicle: Vehicle) => {
    if (exportingVehicleId != null) {
      return;
    }

    Alert.alert(
      'Export this build',
      'Sends this car, its parts, and budget settings to generate a PDF.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            runExport(vehicle);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {vehicles.length === 0 ? (
        <EmptyState
          title="Nothing to export"
          subtitle="Add a car to the garage first."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text tone="muted">
            Export one build at a time. The PDF is generated on the server.
          </Text>
          <List.View>
            {vehicles.map(vehicle => {
              const partCount = getTrackedPartsForVehicle(
                trackedParts,
                vehicle.id,
              ).length;
              const isExporting = exportingVehicleId === vehicle.id;
              return (
                <List.Item
                  key={vehicle.id}
                  label={getVehicleExportLabel(vehicle)}
                  description={getPartsExportDescription(partCount)}
                  onPress={() => exportVehicle(vehicle)}
                  rightSection={
                    isExporting ? (
                      <ActivityIndicator color={colors.accent} />
                    ) : undefined
                  }
                />
              );
            })}
          </List.View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: layout.gutter,
  },
  contentContainer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
});

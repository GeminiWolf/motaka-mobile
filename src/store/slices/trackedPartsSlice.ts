import {createId} from '../../utils/createId';
import type {NewTrackedPart, TrackedPart} from '../../types/garage';
import type {GarageSlice, TrackedPartsSlice} from '../types';

function toTrackedPart(part: NewTrackedPart, id: string): TrackedPart {
  const next: TrackedPart = {
    id,
    vehicleId: part.vehicleId,
    name: part.name,
    partNumber: part.partNumber,
    category: part.category,
    priority: part.priority,
    status: part.status,
    estimatedCost: part.estimatedCost,
  };
  if (part.actualCost != null) {
    next.actualCost = part.actualCost;
  }
  if (part.notes) {
    next.notes = part.notes;
  }
  if (part.source) {
    next.source = part.source;
  }
  return next;
}

export const createTrackedPartsSlice: GarageSlice<TrackedPartsSlice> = set => ({
  trackedParts: [],

  addTrackedPart: part => {
    const id = part.id ?? createId('part');
    const next = toTrackedPart(part, id);
    set(state => ({trackedParts: [...state.trackedParts, next]}));
    return id;
  },

  updateTrackedPart: (id, patch) => {
    set(state => ({
      trackedParts: state.trackedParts.map(part =>
        part.id === id
          ? {...part, ...patch, id: part.id, vehicleId: part.vehicleId}
          : part,
      ),
    }));
  },

  removeTrackedPart: id => {
    set(state => ({
      trackedParts: state.trackedParts.filter(part => part.id !== id),
    }));
  },
});

import React from 'react';
import { Text } from '../../components/common/Text';
import { useGarageStore } from '../../store/garageStore';

type Props = {
  partId: string;
};

export function PartHeaderTitle({ partId }: Props) {
  const part = useGarageStore(s => s.trackedParts.find(p => p.id === partId));

  return (
    <Text variant="subtitle" numberOfLines={1}>
      {part?.name ?? 'Part'}
    </Text>
  );
}

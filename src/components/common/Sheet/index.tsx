import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { WINDOW_HEIGHT } from '../../../utils/device';
import {
  fullSheetHeight,
  normalizePoints,
  pickReleaseTarget,
  resolvePointHeights,
  snapTranslateY,
  type SheetPoint,
} from './sheetPoints';

export type { SheetPoint };

const HANDLE_AREA_HEIGHT = 28;
const DISMISS_THRESHOLD = 80;

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  points?: SheetPoint | SheetPoint[];
  hideBackdrop?: boolean;
  sheetColor?: string;
};

export function Sheet({
  visible,
  onClose,
  children,
  points,
  hideBackdrop = false,
  sheetColor = colors.surface,
}: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(WINDOW_HEIGHT)).current;
  const dragStartY = useRef(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [measured, setMeasured] = useState(false);
  const [snapIndex, setSnapIndex] = useState(0);

  const pointList = useMemo(() => normalizePoints(points), [points]);
  const bottomPad = Math.max(insets.bottom, spacing.md);
  const fitHeight = HANDLE_AREA_HEIGHT + contentHeight + bottomPad;
  const layoutHeight = fullSheetHeight({
    windowHeight: WINDOW_HEIGHT,
    topInset: insets.top,
    fitHeight,
  });

  const heights = useMemo(
    () =>
      resolvePointHeights(pointList, {
        windowHeight: WINDOW_HEIGHT,
        topInset: insets.top,
        fitHeight,
      }),
    [pointList, insets.top, fitHeight],
  );

  const snapYs = useMemo(
    () => heights.map(height => snapTranslateY(height, layoutHeight)),
    [heights, layoutHeight],
  );

  const ready = !pointList.includes('fit') || measured;
  const fillContent = !pointList.includes('fit');

  const latest = useRef({
    snapYs,
    layoutHeight,
    onClose,
    setSnapIndex,
    translateY,
  });
  latest.current = { snapYs, layoutHeight, onClose, setSnapIndex, translateY };

  useEffect(() => {
    if (!visible) {
      translateY.setValue(WINDOW_HEIGHT);
      setSnapIndex(0);
      setMeasured(false);
      setContentHeight(0);
    }
  }, [visible, translateY]);

  useEffect(() => {
    if (!visible || !ready) {
      return;
    }
    const target =
      snapYs[Math.min(snapIndex, Math.max(snapYs.length - 1, 0))] ?? 0;
    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: true,
      tension: 68,
      friction: 12,
    }).start();
  }, [visible, ready, snapIndex, snapYs, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > 4 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: () => {
        latest.current.translateY.stopAnimation(value => {
          dragStartY.current = value;
        });
      },
      onPanResponderMove: (_, g) => {
        const minY = Math.min(...latest.current.snapYs);
        const next = dragStartY.current + g.dy;
        latest.current.translateY.setValue(Math.max(minY, next));
      },
      onPanResponderRelease: (_, g) => {
        const {
          snapYs: ys,
          layoutHeight: maxH,
          onClose: close,
          translateY: ty,
          setSnapIndex: setIndex,
        } = latest.current;
        const minY = Math.min(...ys);
        const current = Math.max(minY, dragStartY.current + g.dy);
        const target = pickReleaseTarget(current, ys, g.vy, DISMISS_THRESHOLD);
        if (target === 'close') {
          Animated.timing(ty, {
            toValue: maxH + 40,
            duration: 180,
            useNativeDriver: true,
          }).start(() => close());
          return;
        }
        setIndex(target);
        Animated.spring(ty, {
          toValue: ys[target],
          useNativeDriver: true,
          tension: 68,
          friction: 12,
        }).start();
      },
    }),
  ).current;

  const backdropOpacity = translateY.interpolate({
    inputRange: [0, Math.max(layoutHeight, 1)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.root} pointerEvents="box-none">
        {!hideBackdrop ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        ) : null}
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <Animated.View
          style={[
            styles.sheet,
            {
              height: layoutHeight,
              backgroundColor: sheetColor,
              paddingBottom: bottomPad,
              transform: [{ translateY }],
            },
          ]}
        >
          <View
            style={styles.handleArea}
            {...panResponder.panHandlers}
            accessibilityRole="adjustable"
            accessibilityLabel="Drag sheet"
          >
            <View style={styles.handle} />
          </View>
          <View
            style={[styles.content, fillContent && styles.contentFill]}
            onLayout={event => {
              const next = event.nativeEvent.layout.height;
              setMeasured(true);
              setContentHeight(prev =>
                Math.abs(prev - next) < 1 ? prev : next,
              );
            }}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  dismissArea: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  handleArea: {
    height: HANDLE_AREA_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  content: {
    flexGrow: 0,
  },
  contentFill: {
    flex: 1,
  },
});

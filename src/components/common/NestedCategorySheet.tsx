import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCategories } from '../../services/api';
import type { PartCategory } from '../../types';
import { formatCategoryPath } from '../../utils/formatCategoryPath';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  visible: boolean;
  baseUrl: string;
  selectedId?: string | null;
  onClose: () => void;
  onSelect: (category: PartCategory, path: PartCategory[]) => void;
};

export function NestedCategorySheet({
  visible,
  baseUrl,
  selectedId,
  onClose,
  onSelect,
}: Props) {
  const insets = useSafeAreaInsets();
  const [path, setPath] = useState<PartCategory[]>([]);
  const [options, setOptions] = useState<PartCategory[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parentId = path.length > 0 ? path[path.length - 1].id : undefined;

  useEffect(() => {
    if (!visible) {
      return;
    }
    setPath([]);
    setQuery('');
    setError('');
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    getCategories(baseUrl, parentId)
      .then(data => {
        if (!cancelled) {
          setOptions(data);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'Failed to load categories');
          setOptions([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [visible, baseUrl, parentId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return options;
    }
    return options.filter(opt => opt.name.toLowerCase().includes(q));
  }, [options, query]);

  const breadcrumb = formatCategoryPath(path);

  const goBack = () => {
    setQuery('');
    setPath(prev => prev.slice(0, -1));
  };

  const selectCategory = (category: PartCategory, nextPath: PartCategory[]) => {
    onSelect(category, nextPath);
    onClose();
  };

  const openCategory = async (category: PartCategory) => {
    setLoading(true);
    setError('');
    try {
      const children = await getCategories(baseUrl, category.id);
      if (children.length > 0) {
        setQuery('');
        setPath(prev => [...prev, category]);
      } else {
        selectCategory(category, [...path, category]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to open category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, spacing.md) },
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.header}>
            {path.length > 0 ? (
              <Pressable
                onPress={goBack}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <Text style={styles.back}>Back</Text>
              </Pressable>
            ) : (
              <View style={styles.backSpacer} />
            )}
            <Text style={styles.title}>Category</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          {breadcrumb ? (
            <Text style={styles.breadcrumb} numberOfLines={2}>
              {breadcrumb}
            </Text>
          ) : (
            <Text style={styles.hint}>Browse categories</Text>
          )}

          {path.length > 0 ? (
            <Pressable
              style={styles.useCurrent}
              onPress={() => selectCategory(path[path.length - 1], path)}
            >
              <Text style={styles.useCurrentText}>
                Use “{path[path.length - 1].name}”
              </Text>
            </Pressable>
          ) : null}

          <TextInput
            style={styles.search}
            value={query}
            onChangeText={setQuery}
            placeholder="Search this level"
            placeholderTextColor={colors.textDim}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            accessibilityLabel="Search categories"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {loading ? (
            <ActivityIndicator color={colors.accent} style={styles.loader} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={item => item.id}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              ListEmptyComponent={
                <Text style={styles.empty}>No categories here</Text>
              }
              renderItem={({ item }) => {
                const selected = item.id === selectedId;
                return (
                  <Pressable
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => openCategory(item)}
                    accessibilityRole="button"
                    accessibilityLabel={item.name}
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                );
              }}
            />
          )}
        </View>
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
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    height: '78%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  back: {
    ...typography.caption,
    color: colors.accent,
    minWidth: 48,
  },
  backSpacer: {
    minWidth: 48,
  },
  close: {
    ...typography.caption,
    color: colors.textMuted,
    minWidth: 48,
    textAlign: 'right',
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  breadcrumb: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  useCurrent: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  useCurrentText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
  },
  search: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  loader: {
    marginTop: spacing.lg,
  },
  list: {
    flex: 1,
  },
  empty: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  optionSelected: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    borderBottomWidth: 0,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    paddingRight: spacing.sm,
  },
  optionTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
  chevron: {
    ...typography.title,
    color: colors.textDim,
  },
});

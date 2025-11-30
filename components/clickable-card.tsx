import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ClickableCardProps = {
  title: string;
  description: string;
  difficulty: string;
  ability: string;
  itemCount: number;
  status?: 'not-started' | 'in-progress' | 'completed' | 'failed';
  itemsCompleted?: number;
  onPress: () => void;
};

export function ClickableCard({
  title,
  description,
  difficulty,
  ability,
  itemCount,
  status = 'not-started',
  itemsCompleted = 0,
  onPress,
}: ClickableCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const cardBackground = colorScheme === 'dark' ? '#0B1528' : '#F7FBFF';
  const borderColor = colorScheme === 'dark' ? 'rgba(61,124,255,0.35)' : 'rgba(13,139,255,0.25)';
  const statusConfig = {
    'not-started': {
      label: 'Não iniciada',
      background: 'rgba(148,163,184,0.2)',
      text: colorScheme === 'dark' ? '#E2E8F0' : '#334155',
    },
    'in-progress': {
      label: `Em progresso (${itemsCompleted}/${itemCount})`,
      background: 'rgba(250,204,21,0.2)',
      text: '#92400e',
    },
    completed: {
      label: 'Concluída',
      background: 'rgba(34,197,94,0.2)',
      text: '#166534',
    },
    failed: {
      label: 'Reprovada',
      background: 'rgba(239,68,68,0.2)',
      text: '#991b1b',
    },
  }[status];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <View
        style={[
          styles.card,
          {
            borderColor,
            backgroundColor: cardBackground,
            shadowColor: palette.tint,
          },
        ]}>
        <View style={styles.header}>
          <View style={styles.titleArea}>
            <ThemedText type="subtitle" style={styles.titleText}>
              {title}
            </ThemedText>
          </View>
          <View
            style={[
              styles.pill,
              {
                backgroundColor: palette.tint,
                shadowColor: palette.tint,
              },
            ]}>
            <ThemedText type="defaultSemiBold" style={styles.pillText} adjustsFontSizeToFit>
              {difficulty}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.description}>{description}</ThemedText>

        <View style={styles.metaRow}>
          <View style={[styles.metaPill, { backgroundColor: palette.tint }]}>
            <ThemedText type="defaultSemiBold" style={styles.metaText}>
              {ability}
            </ThemedText>
          </View>
          <View
            style={[
              styles.metaPill,
              {
                backgroundColor: colorScheme === 'dark' ? 'rgba(226,232,240,0.08)' : '#E5F0FF',
                borderColor,
                borderWidth: 1,
              },
            ]}>
            <ThemedText style={styles.metaText}>
              {itemCount} {itemCount === 1 ? 'questão' : 'questões'}
            </ThemedText>
          </View>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: statusConfig.background,
            },
          ]}>
          <ThemedText style={[styles.statusText, { color: statusConfig.text }]}>
            {statusConfig.label}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 14,
    overflow: 'hidden',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  titleArea: {
    flex: 1,
  },
  titleText: {
    flexShrink: 1,
    lineHeight: 24,
  },
  description: {
    opacity: 0.85,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    minWidth: 78,
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  metaPill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  pillText: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 14,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

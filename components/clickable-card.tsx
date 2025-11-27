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
  status?: 'not-started' | 'in-progress' | 'completed';
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
  }[status];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <View
        style={[
          styles.card,
          {
            borderColor: palette.tint,
            backgroundColor: colorScheme === 'dark' ? '#0B1528' : '#fff',
          },
        ]}>
        <View style={styles.header}>
          <ThemedText type="subtitle">{title}</ThemedText>
          <View style={[styles.pill, { backgroundColor: palette.tint }]}>
            <ThemedText type="defaultSemiBold" style={styles.pillText}>
              {difficulty}
            </ThemedText>
          </View>
        </View>

        <ThemedText>{description}</ThemedText>

        <View style={styles.footer}>
          <ThemedText type="defaultSemiBold">{ability}</ThemedText>
          <ThemedText>
            {itemCount} {itemCount === 1 ? 'questão' : 'questões'}
          </ThemedText>
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
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'uppercase',
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
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

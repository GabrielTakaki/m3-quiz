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
  onPress: () => void;
};

export function ClickableCard({
  title,
  description,
  difficulty,
  ability,
  itemCount,
  onPress,
}: ClickableCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

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
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

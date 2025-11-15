import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type OptionButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  index: number;
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function OptionButton({ label, selected, onPress, index }: OptionButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: selected ? palette.tint : 'rgba(148,163,184,0.4)',
          backgroundColor: selected ? `${palette.tint}22` : 'transparent',
        },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.badge, { backgroundColor: palette.tint }]}>
        <ThemedText type="defaultSemiBold" style={styles.badgeText}>
          {LETTERS[index]}
        </ThemedText>
      </View>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
  },
  label: {
    flex: 1,
    fontFamily: Fonts.mono,
  },
});

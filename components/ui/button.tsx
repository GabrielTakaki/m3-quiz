import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];

  const isDisabled = disabled ?? false;
  const backgroundStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: palette.tint, borderColor: palette.tint },
    outline: { backgroundColor: 'transparent', borderColor: palette.tint },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  };

  const textColors: Record<ButtonVariant, string> = {
    primary: theme === 'dark' ? Colors.dark.background : '#fff',
    outline: palette.tint,
    ghost: palette.tint,
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled || loading}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        backgroundStyles[variant],
        isDisabled || loading ? styles.disabled : null,
        pressed && !(isDisabled || loading) ? styles.pressed : null,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <ThemedText type="defaultSemiBold" style={[styles.label, { color: textColors[variant] }]}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

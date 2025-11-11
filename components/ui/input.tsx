import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { useController, useFormContext } from 'react-hook-form';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type InputProps = TextInputProps & {
  name: string;
  label?: string;
  helperText?: string;
};

export function Input({ name, label, helperText, style, ...rest }: InputProps) {
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];
  const { control } = useFormContext();
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ control, name });

  const borderColor = error ? '#dc2626' : `${palette.icon}55`;
  const fieldBackground = theme === 'dark' ? '#0F1F3A' : '#F9FBFF';
  const helper = error?.message ?? helperText;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <ThemedText type="defaultSemiBold" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}

      <TextInput
        ref={ref}
        value={value ?? ''}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholderTextColor={`${palette.icon}99`}
        style={[
          styles.input,
          {
            borderColor,
            backgroundColor: fieldBackground,
            color: palette.text,
          },
          style,
        ]}
        {...rest}
      />

      {helper ? (
        <ThemedText style={[styles.helperText, error ? styles.errorText : undefined]}>
          {helper}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontSize: 14,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  helperText: {
    fontSize: 13,
    color: '#6b7280',
  },
  errorText: {
    color: '#dc2626',
  },
});

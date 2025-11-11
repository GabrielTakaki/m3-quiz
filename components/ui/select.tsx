import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useController, useFormContext } from 'react-hook-form';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  options: SelectOption[];
  disabled?: boolean;
};

export function Select({
  name,
  label,
  placeholder = 'Selecione uma opção',
  helperText,
  options,
  disabled,
}: SelectProps) {
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];
  const [isOpen, setIsOpen] = useState(false);
  const { control } = useFormContext();
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });

  const selected = options.find((option) => option.value === value);
  const borderColor = error ? '#dc2626' : `${palette.icon}55`;
  const fieldBackground = theme === 'dark' ? '#0F1F3A' : '#F9FBFF';
  const helper = error?.message ?? helperText;

  const close = () => {
    setIsOpen(false);
    onBlur();
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    close();
  };

  return (
    <View style={styles.wrapper}>
      {label ? (
        <ThemedText type="defaultSemiBold" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: isOpen }}
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={[
          styles.trigger,
          {
            borderColor,
            backgroundColor: fieldBackground,
          },
          disabled ? styles.disabled : null,
        ]}>
        <ThemedText
          style={[
            styles.triggerText,
            { color: selected ? palette.text : `${palette.icon}99` },
          ]}>
          {selected ? selected.label : placeholder}
        </ThemedText>
        <IconSymbol name="chevron.down" color={palette.icon} size={18} />
      </Pressable>

      {helper ? (
        <ThemedText style={[styles.helperText, error ? styles.errorText : undefined]}>
          {helper}
        </ThemedText>
      ) : null}

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={close} />
          <View
            style={[
              styles.sheet,
              { backgroundColor: theme === 'dark' ? '#07132A' : '#F1F6FF' },
            ]}>
            <ScrollView>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.option, isSelected ? styles.optionSelected : null]}
                    onPress={() => handleSelect(option.value)}>
                    <ThemedText
                      style={[
                        styles.optionLabel,
                        isSelected ? styles.optionLabelSelected : undefined,
                      ]}>
                      {option.label}
                    </ThemedText>
                    {isSelected ? (
                      <IconSymbol name="checkmark" size={16} color={palette.tint} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  trigger: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    fontSize: 16,
  },
  helperText: {
    fontSize: 13,
    color: '#6b7280',
  },
  errorText: {
    color: '#dc2626',
  },
  disabled: {
    opacity: 0.6,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderRadius: 16,
    maxHeight: '60%',
    paddingVertical: 12,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: 'rgba(44, 138, 247, 0.12)',
  },
  optionLabel: {
    fontSize: 16,
  },
  optionLabelSelected: {
    fontWeight: '600',
  },
});

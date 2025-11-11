import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getFirebaseErrorMessage } from '@/lib/firebase-errors';
import { useRegisterMutation } from './services/register-service';

const registerSchema = z.object({
  fullName: z
    .string({ required_error: 'Informe seu nome completo.' })
    .min(3, 'Digite pelo menos 3 caracteres.'),
  email: z
    .string({ required_error: 'Informe seu email.' })
    .email('Digite um email válido.'),
  password: z
    .string({ required_error: 'Crie uma senha.' })
    .min(6, 'A senha precisa ter ao menos 6 caracteres.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const handleRegister = methods.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await registerMutation.mutateAsync(values);
      Alert.alert('Conta criada', 'Seu cadastro foi concluído com sucesso!');
    } catch (error) {
      setSubmitError(getFirebaseErrorMessage(error));
    }
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            bounces={false}>
            <View style={styles.header}>
              <ThemedText type="title">Crie sua conta</ThemedText>
              <ThemedText>
                Configure seu perfil para começar a criar e compartilhar quizzes incríveis.
              </ThemedText>
            </View>

            <FormProvider {...methods}>
              <View style={styles.form}>
                <Input
                  name="fullName"
                  label="Nome completo"
                  placeholder="Maria Silva"
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <Input
                  name="email"
                  label="Email"
                  placeholder="maria.silva@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
                <Input
                  name="password"
                  label="Senha"
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  textContentType="password"
                />
                {submitError ? <ThemedText style={styles.submitError}>{submitError}</ThemedText> : null}
                <Button title="Criar conta" loading={registerMutation.isPending} onPress={handleRegister} />
              </View>
            </FormProvider>

            <View style={styles.footer}>
              <ThemedText>Já tem uma conta?</ThemedText>
              <Link href="/(auth)/login" style={styles.link}>
                <ThemedText type="link">Entrar</ThemedText>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 24,
  },
  header: {
    gap: 8,
  },
  form: {
    gap: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  link: {
    paddingVertical: 4,
  },
  submitError: {
    color: '#dc2626',
  },
});

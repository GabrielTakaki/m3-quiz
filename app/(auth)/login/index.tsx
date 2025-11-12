import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
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
import { useLoginMutation } from './services/login-service';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Informe seu email.' })
    .email('Digite um email válido.'),
  password: z
    .string({ required_error: 'Informe sua senha.' })
    .min(6, 'A senha precisa ter ao menos 6 caracteres.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();
  const router = useRouter();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = methods.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await loginMutation.mutateAsync(values);
      Alert.alert('Login realizado', 'Você entrou com sucesso!');
      router.replace('/(protected)/(tabs)/home');
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
              <ThemedText type="title">Bem-vindo de volta</ThemedText>
              <ThemedText>Entre para continuar criando e compartilhando quizzes.</ThemedText>
            </View>

            <FormProvider {...methods}>
              <View style={styles.form}>
                <Input
                  name="email"
                  label="Email"
                  placeholder="voce@exemplo.com"
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
                <Button title="Entrar" loading={loginMutation.isPending} onPress={handleLogin} />
              </View>
            </FormProvider>

            <View style={styles.footer}>
              <ThemedText>Ainda não tem conta?</ThemedText>
              <Link href="/(auth)/register" style={styles.link}>
                <ThemedText type="link">Crie agora</ThemedText>
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

import { Link } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import {
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
import {zodResolver} from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Informe seu email.' })
    .email('Digite um email válido.'),
  password: z
    .string({ required_error: 'Informe sua senha.' })
    .min(6, 'A senha precisa ter ao menos 6 caracteres.'),
  workspace: z
    .string({ required_error: 'Selecione um espaço de trabalho.' })
    .min(1, 'Selecione um espaço de trabalho.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      workspace: '',
    },
  });

  const handleLogin = methods.handleSubmit((values) => {
    console.log('login', values);
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
              <ThemedText>Entre para realizar quizzes fantásticos.</ThemedText>
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
                <Button title="Entrar" onPress={handleLogin} />
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
});

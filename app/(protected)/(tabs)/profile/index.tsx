import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const displayName = user?.displayName ?? 'Membro Felski';
  const email = user?.email ?? 'Email não informado';
  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : '—';
  const lastLogin = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
    : '—';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title">Perfil</ThemedText>
          <ThemedText style={styles.subtitle}>
            Revise seus dados vinculados e encerre a sessão quando terminar.
          </ThemedText>
        </View>

        <View style={styles.card}>
          <View>
            <ThemedText type="defaultSemiBold">Nome</ThemedText>
            <ThemedText>{displayName}</ThemedText>
          </View>
          <View>
            <ThemedText type="defaultSemiBold">Email</ThemedText>
            <ThemedText>{email}</ThemedText>
          </View>
          <View style={styles.row}>
            <View>
              <ThemedText type="defaultSemiBold">Conta criada</ThemedText>
              <ThemedText>{createdAt}</ThemedText>
            </View>
            <View>
              <ThemedText type="defaultSemiBold">Último acesso</ThemedText>
              <ThemedText>{lastLogin}</ThemedText>
            </View>
          </View>
        </View>

        <Button title="Fazer logout" variant="outline" onPress={logout} />
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
    padding: 24,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  subtitle: {
    opacity: 0.8,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});

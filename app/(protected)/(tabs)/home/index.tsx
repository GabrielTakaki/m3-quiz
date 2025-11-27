import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useUnits } from '@/hooks/use-units';
import { useQuizStore } from '@/stores/quiz-store';

export default function HomeScreen() {
  const router = useRouter();
  const { isLoading, isError, refetch } = useUnits();
  const status = useQuizStore((state) => state.status);
  const activeUnitId = useQuizStore((state) => state.activeUnitId);
  const units = useQuizStore((state) => state.units);
  const unitOrder = useQuizStore((state) => state.unitOrder);
  const isUnitsReady = useQuizStore((state) => state.isUnitsReady);

  const hasSession = status !== 'idle' && activeUnitId;
  const totalQuestions = unitOrder.reduce((count, unitId) => count + units[unitId].itemIds.length, 0);

  const handleNavigateUnits = () => {
    router.push('/(protected)/units-list');
  };

  const handleContinueSession = () => {
    const destination = status === 'finished' ? '/(protected)/quiz/results' : '/(protected)/quiz';
    router.push(destination);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.hero}>
          <ThemedText type="title">Bem-vindo!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Organize seus estudos de C explorando unidades temáticas e acompanhe o seu desempenho.
          </ThemedText>
          <Button title="Ver unidades" onPress={handleNavigateUnits} />
        </View>

        <View style={styles.overviewCard}>
          <ThemedText type="subtitle">Resumo rápido</ThemedText>
          <View style={styles.overviewRow}>
            <View>
              <ThemedText type="defaultSemiBold">
                {isUnitsReady ? unitOrder.length : '–'}
              </ThemedText>
              <ThemedText>Unidades</ThemedText>
            </View>
            <View>
              <ThemedText type="defaultSemiBold">
                {isUnitsReady ? totalQuestions : '–'}
              </ThemedText>
              <ThemedText>Questões</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.subtitle}>
            Domine fundamentos, condicionais e laços com exercícios contextualizados.
          </ThemedText>
        </View>

        <View style={styles.tipCard}>
          <ThemedText type="defaultSemiBold">Dica de estudo</ThemedText>
          <ThemedText>
            Reserve blocos curtos de 15 minutos para praticar cada unidade e use os resultados para
            identificar os temas que precisam de reforço.
          </ThemedText>
        </View>

        {!isUnitsReady && isLoading ? (
          <ThemedText>Buscando unidades no Firebase...</ThemedText>
        ) : null}
        {!isUnitsReady && isError ? (
          <View style={styles.sessionCard}>
            <ThemedText>Não foi possível carregar as unidades.</ThemedText>
            <Button title="Tentar novamente" variant="outline" onPress={() => refetch()} />
          </View>
        ) : null}

        {hasSession && activeUnitId ? (
          <View style={styles.sessionCard}>
            <ThemedText type="defaultSemiBold">
              Sessão em andamento: {units[activeUnitId].title}
            </ThemedText>
            <Button
              variant="outline"
              title={status === 'finished' ? 'Ver resultados' : 'Retomar quiz'}
              onPress={handleContinueSession}
            />
          </View>
        ) : null}
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
  hero: {
    gap: 12,
  },
  subtitle: {
    opacity: 0.8,
  },
  overviewCard: {
    borderWidth: 1,
    borderColor: 'rgba(13,139,255,0.2)',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(13,139,255,0.1)',
    gap: 8,
  },
  sessionCard: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
});

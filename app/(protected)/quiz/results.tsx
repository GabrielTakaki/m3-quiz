import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useUnits } from '@/hooks/use-units';
import { markUnitStarted } from '@/services/student-units.service';
import { useQuizStore } from '@/stores/quiz-store';

export default function ResultsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  useUnits();
  const results = useQuizStore((state) => state.results);
  const status = useQuizStore((state) => state.status);
  const activeUnitId = useQuizStore((state) => state.activeUnitId);
  const units = useQuizStore((state) => state.units);
  const startUnit = useQuizStore((state) => state.startUnit);
  const resetSession = useQuizStore((state) => state.resetSession);

  useEffect(() => {
    if (status !== 'finished' || !results) {
      router.replace('/(protected)/(tabs)/home');
    }
  }, [results, status, router]);

  if (!results || !activeUnitId) {
    return null;
  }

  const unit = units[activeUnitId];
  const incorrect = results.total - results.correct;
  const percentage = Math.round((results.correct / results.total) * 100);

  const handleRetry = async () => {
    if (user) {
      await markUnitStarted(user.uid, unit.id, unit.itemIds.length);
    }
    startUnit(unit.id, 0);
    router.replace('/(protected)/quiz');
  };

  const handleBackHome = () => {
    resetSession();
    router.replace('/(protected)/(tabs)/home');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ThemedText type="title">Resultados</ThemedText>
        <ThemedText type="defaultSemiBold">{unit.title}</ThemedText>

        <View style={styles.card}>
          <ThemedText type="subtitle">{percentage}% de aproveitamento</ThemedText>
          <View style={styles.row}>
            <ThemedText>Corretas</ThemedText>
            <ThemedText type="defaultSemiBold">{results.correct}</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText>Incorretas</ThemedText>
            <ThemedText type="defaultSemiBold">{incorrect}</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText>Total</ThemedText>
            <ThemedText type="defaultSemiBold">{results.total}</ThemedText>
          </View>
        </View>

        <Button title="Tentar novamente" onPress={handleRetry} />
        <Button title="Voltar para início" variant="outline" onPress={handleBackHome} />
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
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

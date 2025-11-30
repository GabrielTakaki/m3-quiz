import { FlatList, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { BottomSheet } from '@/components/bottom-sheet';
import { ClickableCard } from '@/components/clickable-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useStudentUnits } from '@/hooks/use-student-units';
import { useUnits } from '@/hooks/use-units';
import { getNextItemIndex } from '@/lib/progress-utils';
import { type StudentUnitProgress } from '@/services/student-units.service';
import { useQuizStore } from '@/stores/quiz-store';

export default function UnitsListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isLoading, isError, refetch } = useUnits();
  const { data: studentProgress } = useStudentUnits(user?.uid);
  const unitOrder = useQuizStore((state) => state.unitOrder);
  const units = useQuizStore((state) => state.units);
  const status = useQuizStore((state) => state.status);
  const isUnitsReady = useQuizStore((state) => state.isUnitsReady);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const selectedUnit = selectedUnitId ? units[selectedUnitId] : undefined;
  const progressMap =
    (studentProgress as any[])?.reduce<Record<string, StudentUnitProgress>>((acc, item) => {
      acc[item.unitId] = item;
      return acc;
    }, {}) ?? {};

  const handleStartUnit = () => {
    if (!selectedUnit) {
      return;
    }

    const selectedProgress = progressMap[selectedUnit.id];
    const startIndex = getNextItemIndex(selectedProgress ?? null, selectedUnit.itemIds.length);

    router.push({
      pathname: '/(protected)/unit-intro',
      params: { unitId: selectedUnit.id, startIndex: String(startIndex) },
    });
    setSelectedUnitId(null);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title">Unidades disponíveis</ThemedText>
        <ThemedText style={styles.subtitle}>
          Selecione um conteúdo para praticar com questões derivadas dos arquivos C do repositório.
        </ThemedText>

        {!isUnitsReady && isLoading ? <ThemedText>Carregando unidades...</ThemedText> : null}

        {!isUnitsReady && isError ? (
          <View style={styles.sessionCard}>
            <ThemedText>Não foi possível carregar as unidades.</ThemedText>
            <Button title="Tentar novamente" onPress={() => refetch()} />
          </View>
        ) : null}

        <FlatList
          data={unitOrder}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const unit = units[item];
            const progress = progressMap[unit.id];
            return (
              <ClickableCard
                title={unit.title}
                description={unit.description}
                difficulty={unit.difficulty}
                ability={unit.ability}
                itemCount={unit.itemIds.length}
                status={progress?.status ?? 'not-started'}
                itemsCompleted={progress?.itemsCompleted ?? 0}
                onPress={() => setSelectedUnitId(unit.id)}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </SafeAreaView>

      <BottomSheet visible={Boolean(selectedUnit)} onClose={() => setSelectedUnitId(null)}>
        {selectedUnit ? (
          <>
            <ThemedText type="title">{selectedUnit.title}</ThemedText>
            <ThemedText>{selectedUnit.description}</ThemedText>

            <View style={styles.metaRow}>
              <ThemedText type="defaultSemiBold">
                Dificuldade: {selectedUnit.difficulty}
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                Questões: {selectedUnit.itemIds.length}
              </ThemedText>
            </View>
            <ThemedText type="defaultSemiBold">Habilidade: {selectedUnit.ability}</ThemedText>

            <Button title="Começar unidade" onPress={handleStartUnit} />
            <Button title="Cancelar" variant="ghost" onPress={() => setSelectedUnitId(null)} />
          </>
        ) : null}
      </BottomSheet>
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
  subtitle: {
    opacity: 0.8,
  },
  listContent: {
    paddingBottom: 32,
    gap: 16,
  },
  sessionCard: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

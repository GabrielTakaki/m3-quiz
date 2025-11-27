import { FlatList, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { BottomSheet } from '@/components/bottom-sheet';
import { ClickableCard } from '@/components/clickable-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/stores/quiz-store';

export default function UnitsListScreen() {
  const router = useRouter();
  const unitOrder = useQuizStore((state) => state.unitOrder);
  const units = useQuizStore((state) => state.units);
  const status = useQuizStore((state) => state.status);
  const activeUnitId = useQuizStore((state) => state.activeUnitId);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const selectedUnit = selectedUnitId ? units[selectedUnitId] : undefined;
  const hasSession = status !== 'idle' && activeUnitId;

  const handleStartUnit = () => {
    if (!selectedUnit) {
      return;
    }

    router.push({
      pathname: '/(protected)/unit-intro',
      params: { unitId: selectedUnit.id },
    });
    setSelectedUnitId(null);
  };

  const handleContinueSession = () => {
    const destination = status === 'finished' ? '/(protected)/quiz/results' : '/(protected)/quiz';
    router.push(destination);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title">Unidades disponíveis</ThemedText>
        <ThemedText style={styles.subtitle}>
          Selecione um conteúdo para praticar com questões derivadas dos arquivos C do repositório.
        </ThemedText>

        {hasSession && activeUnitId ? (
          <View style={styles.sessionCard}>
            <ThemedText type="defaultSemiBold">
              Você parou em {units[activeUnitId].title}
            </ThemedText>
            <Button
              variant="outline"
              title={status === 'finished' ? 'Ver resultados' : 'Retomar quiz'}
              onPress={handleContinueSession}
            />
          </View>
        ) : null}

        <FlatList
          data={unitOrder}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const unit = units[item];
            return (
              <ClickableCard
                title={unit.title}
                description={unit.description}
                difficulty={unit.difficulty}
                ability={unit.ability}
                itemCount={unit.itemIds.length}
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

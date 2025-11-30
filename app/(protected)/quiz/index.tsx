import { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OptionButton } from '@/components/quiz/option-button';
import { Button } from '@/components/ui/button';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useUnits } from '@/hooks/use-units';
import { useUnitProgress } from '@/hooks/use-unit-progress';
import { markUnitCompleted, markUnitFailed, saveAnswer } from '@/services/student-units.service';
import { useQuizStore } from '@/stores/quiz-store';
import { useQueryClient } from '@tanstack/react-query';

export default function QuizScreen() {
  const qc = useQueryClient();

  const router = useRouter();
  const { user } = useAuth();
  useUnits();
  const activeUnitId = useQuizStore((state) => state.activeUnitId);
  const units = useQuizStore((state) => state.units);
  const items = useQuizStore((state) => state.items);
  const currentIndex = useQuizStore((state) => state.currentIndex);
  const answers = useQuizStore((state) => state.answers);
  const answerItem = useQuizStore((state) => state.answerItem);
  const goToNext = useQuizStore((state) => state.goToNext);
  const goToPrevious = useQuizStore((state) => state.goToPrevious);
  const finishUnit = useQuizStore((state) => state.finishUnit);
  const resetSession = useQuizStore((state) => state.resetSession);
  useUnitProgress(activeUnitId);

  useEffect(() => {
    if (!activeUnitId) {
      router.replace('/(protected)/(tabs)/home');
    }
  }, [activeUnitId, router]);

  if (!activeUnitId) {
    return null;
  }

  const unit = units[activeUnitId];
  const currentItemId = unit.itemIds[currentIndex];
  const currentItem = items[currentItemId];
  const userAnswer = answers[currentItemId];
  const isLastQuestion = currentIndex === unit.itemIds.length - 1;
  const answeredCount = Object.values(answers).filter(Boolean).length;

  const handleSelect = async (optionId: string) => {
    answerItem(currentItemId, optionId);

    if (user) {
      const nextItemsCompleted = Math.min(
        unit.itemIds.length,
        answeredCount + (userAnswer ? 0 : 1)
      );

      await saveAnswer(
        user.uid,
        unit.id,
        currentItemId,
        optionId,
        optionId === currentItem.correctOptionId,
        nextItemsCompleted
      );
      await qc.invalidateQueries({ queryKey: ['student-units', user.uid] });
    }
  };

  const handleExit = () => {
    resetSession();
    router.replace('/(protected)/(tabs)/home');
  };

  const handleNext = async () => {
    if (!userAnswer) {
      return;
    }

    if (isLastQuestion) {
      if (user) {
        const totalItems = unit.itemIds.length;
        const correctCount = unit.itemIds.reduce((count, id) => {
          const item = items[id];
          return count + (answers[id] === item.correctOptionId ? 1 : 0);
        }, 0);
        const percentage = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;

        if (percentage < 70) {
          await markUnitFailed(user.uid, unit.id, totalItems);
        } else {
          await markUnitCompleted(user.uid, unit.id, totalItems);
        }
        qc.invalidateQueries({ queryKey: ['student-units', user.uid] });
      }
      finishUnit();
      router.replace('/(protected)/quiz/results');
      return;
    }

    goToNext();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <Pressable onPress={handleExit}>
            <ThemedText type="defaultSemiBold">Voltar ao início</ThemedText>
          </Pressable>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{unit.ability}</ThemedText>
          </View>
        </View>
        <ThemedText type="title">{unit.title}</ThemedText>
        <ThemedText type="defaultSemiBold">
          Questão {currentIndex + 1} de {unit.itemIds.length}
        </ThemedText>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle">{currentItem.title}</ThemedText>
          <ThemedText>{currentItem.prompt}</ThemedText>

          {currentItem.code ? (
            <View style={styles.codeBlock}>
              <ThemedText style={styles.code}>{currentItem.code}</ThemedText>
            </View>
          ) : null}

          <View style={styles.options}>
            {currentItem.options.map((option, idx) => (
              <OptionButton
                key={option.id}
                label={option.label}
                index={idx}
                selected={userAnswer === option.id}
                onPress={() => handleSelect(option.id)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.navigation}>
          <Button
            title="Questão anterior"
            variant="outline"
            onPress={goToPrevious}
            disabled={currentIndex === 0}
          />
          <Button
            title={isLastQuestion ? 'Finalizar unidade' : 'Próxima questão'}
            onPress={handleNext}
            disabled={!userAnswer}
          />
        </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(13,139,255,0.15)',
  },
  badgeText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 32,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    backgroundColor: 'rgba(15,23,42,0.05)',
  },
  code: {
    fontFamily: Fonts.mono,
    lineHeight: 20,
  },
  options: {
    gap: 12,
  },
  navigation: {
    gap: 12,
  },
});

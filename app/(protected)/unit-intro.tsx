import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUnitProgress } from '@/hooks/use-unit-progress';
import { markUnitStarted } from '@/services/student-units.service';
import { useQuizStore } from '@/stores/quiz-store';

export default function UnitIntroScreen() {
  const router = useRouter();
  const { unitId, startIndex: startIndexParam } = useLocalSearchParams<{ unitId?: string; startIndex?: string }>();
  const { user } = useAuth();
  const { progress, status, nextItemIndex } = useUnitProgress(unitId);
  const units = useQuizStore((state) => state.units);
  const allItems = useQuizStore((state) => state.items);
  const startUnit = useQuizStore((state) => state.startUnit);
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  useEffect(() => {
    if (!unitId || !units[unitId]) {
      router.replace('/(protected)/(tabs)/home');
    }
  }, [unitId, units, router]);

  useEffect(() => {
    if (contentHeight > 0 && containerHeight > 0 && contentHeight <= containerHeight) {
      setHasReachedEnd(true);
    }
  }, [contentHeight, containerHeight]);

  if (!unitId || !units[unitId]) {
    return null;
  }

  const unit = units[unitId];
  const totalQuestions = unit.itemIds.length;
  const estimatedMinutes = Math.max(5, Math.round(totalQuestions * 1.5));
  const prepTips = [
    'Leia o enunciado devagar e destaque mentalmente variáveis e efeitos colaterais.',
    'Busque pistas no código antes de olhar as opções; muitas respostas são “pegadinhas” de C.',
    'Use o voltar se precisar revisar uma escolha — suas respostas são salvas enquanto navega.',
    `Reserve ~${estimatedMinutes} min para focar sem interrupções.`,
  ];
  const flowSteps = [
    'Leitura rápida: entenda o cenário do exercício e o objetivo.',
    'Analise o código: procure mudanças de estado, ponteiros e ordem de execução.',
    'Marque sua resposta: escolha a opção mais consistente com a execução prevista.',
  ];
  const neutralBorder = colorScheme === 'dark' ? 'rgba(148,163,184,0.45)' : 'rgba(148,163,184,0.35)';
  const infoBackground = colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(148,163,184,0.08)';
  const summaryBackground = colorScheme === 'dark' ? 'rgba(61,124,255,0.15)' : 'rgba(13,139,255,0.08)';
  const metricBackground = colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)';
  const stepBackground = colorScheme === 'dark' ? 'rgba(61,124,255,0.2)' : 'rgba(13,139,255,0.18)';
  const previewItems = unit.itemIds
    .map((id) => allItems[id])
    .filter(Boolean)
    .slice(0, 4);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 24;
    const reached =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (reached) {
      setHasReachedEnd(true);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  };

  const handleContentSizeChange = (_: number, height: number) => {
    setContentHeight(height);
  };

  const handleStart = async () => {
    const parsedStart = Number(startIndexParam);
    const startIndex = Number.isFinite(parsedStart) ? parsedStart : nextItemIndex;
    const initialAnswers: Record<string, string> = {};

    if (progress?.answers && status === 'in-progress') {
      Object.entries(progress.answers).forEach(([itemId, answer]) => {
        if (answer.selectedOptionId) {
          initialAnswers[itemId] = answer.selectedOptionId;
        }
      });
    }

    if (user) {
      if (status === 'not-started' || status === 'completed') {
        await markUnitStarted(user.uid, unit.id, unit.itemIds.length);
      }
    }
    startUnit(unit.id, startIndex, initialAnswers);
    router.replace('/(protected)/quiz');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={handleBack}>
            <ThemedText type="defaultSemiBold">Voltar</ThemedText>
          </Pressable>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>{unit.difficulty}</ThemedText>
            </View>
            <View style={styles.badgeSecondary}>
              <ThemedText style={styles.badgeText}>{unit.ability}</ThemedText>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          onLayout={handleLayout}
          onContentSizeChange={handleContentSizeChange}
          scrollEventThrottle={16}
        >
          <ThemedText type="title">{unit.title}</ThemedText>
          <ThemedText style={styles.subtitle}>{unit.description}</ThemedText>

          <View
            style={[
              styles.summaryCard,
              { borderColor: palette.tint, backgroundColor: summaryBackground },
            ]}
          >
            <ThemedText type="subtitle">Resumo rápido</ThemedText>
            <View style={styles.metricsRow}>
              <View style={[styles.metric, { backgroundColor: metricBackground, borderColor: neutralBorder }]}>
                <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                  {totalQuestions}
                </ThemedText>
                <ThemedText style={styles.metricLabel}>questões</ThemedText>
              </View>
              <View style={[styles.metric, { backgroundColor: metricBackground, borderColor: neutralBorder }]}>
                <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                  ~{estimatedMinutes} min
                </ThemedText>
                <ThemedText style={styles.metricLabel}>tempo sugerido</ThemedText>
              </View>
              <View style={[styles.metric, { backgroundColor: metricBackground, borderColor: neutralBorder }]}>
                <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                  {status === 'completed' ? 'Revisão' : 'Preparação'}
                </ThemedText>
                <ThemedText style={styles.metricLabel}>
                  {status === 'completed' ? 'refaça para fixar' : 'comece do início'}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={[styles.infoCard, { borderColor: neutralBorder, backgroundColor: infoBackground }]}>
            <ThemedText type="subtitle">Conteúdo da unidade</ThemedText>
            <ThemedText style={styles.paragraph}>
              Nesta trilha você vai aplicar a habilidade "{unit.ability}" em nível {unit.difficulty},
              resolvendo situações reais extraídas dos arquivos C do repositório.
            </ThemedText>
            {previewItems.length ? (
              <View style={styles.topicList}>
                {previewItems.map((item, idx) => (
                  <View key={item.id} style={styles.topicRow}>
                    <View style={[styles.topicIndex, { backgroundColor: palette.tint }]}>
                      <ThemedText style={styles.topicIndexText}>{idx + 1}</ThemedText>
                    </View>
                    <ThemedText style={styles.paragraph}>{item.title}</ThemedText>
                  </View>
                ))}
                {unit.itemIds.length > previewItems.length ? (
                  <ThemedText style={styles.moreTopics}>
                    +{unit.itemIds.length - previewItems.length} exercícios adicionais para consolidar.
                  </ThemedText>
                ) : null}
              </View>
            ) : (
              <ThemedText style={styles.paragraph}>
                Estamos preparando os exercícios desta unidade. Volte em instantes.
              </ThemedText>
            )}
          </View>

          <View style={[styles.infoCard, { borderColor: neutralBorder, backgroundColor: infoBackground }]}>
            <ThemedText type="subtitle">Por que esta unidade importa</ThemedText>
            <ThemedText style={styles.paragraph}>
              Ela reforça a habilidade "{unit.ability}" com cenários que espelham bugs e armadilhas
              de código vistos em produção. A dificuldade "{unit.difficulty}" define o ritmo: use-a
              para calibrar seu foco e revisar conceitos-chave antes de avançar.
            </ThemedText>
          </View>

          <View style={[styles.infoCard, { borderColor: neutralBorder, backgroundColor: infoBackground }]}>
            <ThemedText type="subtitle">Checklist relâmpago</ThemedText>
            {prepTips.map((tip, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: palette.tint }]} />
                <ThemedText style={styles.paragraph}>{tip}</ThemedText>
              </View>
            ))}
          </View>

          <View style={[styles.infoCard, { borderColor: neutralBorder, backgroundColor: infoBackground }]}>
            <ThemedText type="subtitle">Como vai funcionar</ThemedText>
            {flowSteps.map((step, idx) => (
              <View key={idx} style={styles.flowRow}>
                <View style={[styles.stepBadge, { backgroundColor: stepBackground, borderColor: palette.tint }]}>
                  <ThemedText style={styles.stepBadgeText}>{idx + 1}</ThemedText>
                </View>
                <ThemedText style={styles.paragraph}>{step}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.divider} />
          <ThemedText type="subtitle">Contexto e pontos de atenção</ThemedText>
          {unit.introContent.map((paragraph, idx) => (
            <ThemedText key={idx} style={styles.paragraph}>
              {paragraph}
            </ThemedText>
          ))}
        </ScrollView>

        {hasReachedEnd ? (
          <Button title="Consolidar conhecimento" onPress={handleStart} />
        ) : (
          <View style={styles.helper}>
            <ThemedText>Role até o fim para liberar o botão</ThemedText>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(13,139,255,0.15)',
  },
  badgeSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.2)',
  },
  badgeText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 48,
  },
  subtitle: {
    opacity: 0.8,
  },
  summaryCard: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(13,139,255,0.25)',
    backgroundColor: 'rgba(13,139,255,0.08)',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metric: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  metricValue: {
    fontSize: 18,
  },
  metricLabel: {
    opacity: 0.75,
  },
  infoCard: {
    gap: 10,
    padding: 16,
    paddingRight: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    backgroundColor: 'rgba(148,163,184,0.08)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginVertical: 8,
  },
  paragraph: {
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bulletDot: {
    marginTop: 8,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#0D8BFF',
  },
  topicList: {
    gap: 8,
  },
  topicRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  topicIndex: {
    marginTop: 1,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIndexText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  moreTopics: {
    opacity: 0.8,
  },
  flowRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 30,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13,139,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(13,139,255,0.35)',
  },
  stepBadgeText: {
    fontWeight: '700',
  },
  helper: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    borderRadius: 12,
    alignItems: 'center',
  },
});

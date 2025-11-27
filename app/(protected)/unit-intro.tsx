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
import { useUnitProgress } from '@/hooks/use-unit-progress';
import { markUnitStarted } from '@/services/student-units.service';
import { useQuizStore } from '@/stores/quiz-store';

export default function UnitIntroScreen() {
  const router = useRouter();
  const { unitId, startIndex: startIndexParam } = useLocalSearchParams<{ unitId?: string; startIndex?: string }>();
  const { user } = useAuth();
  const { status, nextItemIndex } = useUnitProgress(unitId);
  const units = useQuizStore((state) => state.units);
  const startUnit = useQuizStore((state) => state.startUnit);
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

    if (user) {
      if (status === 'not-started' || status === 'completed') {
        await markUnitStarted(user.uid, unit.id, unit.itemIds.length);
      }
    }
    startUnit(unit.id, startIndex);
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

          <View style={styles.divider} />
          <ThemedText type="subtitle">O que você vai ver</ThemedText>
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginVertical: 8,
  },
  paragraph: {
    lineHeight: 20,
  },
  helper: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    borderRadius: 12,
    alignItems: 'center',
  },
});

import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {SafeAreaView} from "react-native-safe-area-context";

export default function ExercisesScreen() {
  return (
        <ThemedView style={styles.container}>
      <SafeAreaView>
          <ThemedText type="title">Exercícios</ThemedText>
          <ThemedText>Em breve você poderá praticar com listas personalizadas.</ThemedText>
      </SafeAreaView>
        </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
});

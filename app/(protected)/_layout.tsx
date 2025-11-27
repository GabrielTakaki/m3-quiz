import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { useUnits } from '@/hooks/use-units';

export default function ProtectedLayout() {
  const { isLoading, user } = useAuth();
  useUnits({ enabled: Boolean(user) });

  console.log("hererererere")

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="units-list" options={{ headerShown: false }} />
      <Stack.Screen name="unit-intro" options={{ headerShown: false }} />
      <Stack.Screen name="quiz" options={{ headerShown: false }} />
      <Stack.Screen name="quiz/results" options={{ headerShown: false }} />
    </Stack>
  );
}

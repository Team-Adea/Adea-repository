import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/theme";

export default function RootLayout() {
  const { colors } = useTheme();
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.ink,
          contentStyle: { backgroundColor: colors.paper },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Adea" }} />
        <Stack.Screen name="login" options={{ title: "Sign in" }} />
      </Stack>
    </SafeAreaProvider>
  );
}

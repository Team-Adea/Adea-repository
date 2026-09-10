import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LIFE_AREAS, tokens } from "@adea/core";
import { useTheme } from "@/theme";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { colors, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.paper }]}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24 }}
    >
      <Text style={[styles.greeting, { color: colors.ink }]}>
        {email ? `Welcome back` : "Welcome to Adea"}
      </Text>
      <Text style={[styles.sub, { color: colors.inkSoft }]}>
        {email ?? "Your partner in life — 12 areas, one connected system."}
      </Text>

      <View style={styles.grid}>
        {LIFE_AREAS.map((area) => (
          <View
            key={area.id}
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: radii.md },
            ]}
          >
            <Text style={styles.icon}>{area.icon}</Text>
            <Text style={[styles.cardName, { color: colors.ink }]}>{area.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  greeting: { fontSize: tokens.typeScale.display.size, fontWeight: "700", marginBottom: 4 },
  sub: { fontSize: tokens.typeScale.body.size, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "47%",
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  icon: { fontSize: 24 },
  cardName: { fontSize: tokens.typeScale.label.size, fontWeight: "600" },
});

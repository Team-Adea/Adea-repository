import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { tokens } from "@adea/core";
import { useTheme } from "@/theme";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const { colors, radii } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace("/");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.paper }]}>
      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.inkSoft}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          { borderColor: colors.line, color: colors.ink, borderRadius: radii.sm },
        ]}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.inkSoft}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[
          styles.input,
          { borderColor: colors.line, color: colors.ink, borderRadius: radii.sm },
        ]}
      />
      {error ? <Text style={{ color: colors.coral }}>{error}</Text> : null}
      <Pressable
        onPress={signIn}
        disabled={busy}
        style={[
          styles.button,
          { backgroundColor: colors.teal, borderRadius: radii.md, opacity: busy ? 0.6 : 1 },
        ]}
      >
        <Text style={styles.buttonText}>{busy ? "Signing in…" : "Sign in"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: "center" },
  input: { borderWidth: 1, padding: 14, fontSize: tokens.typeScale.body.size },
  button: { padding: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: tokens.typeScale.body.size },
});

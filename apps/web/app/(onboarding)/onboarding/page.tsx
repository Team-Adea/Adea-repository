import { createClient } from "@/lib/supabase/server";
import { loadOnboarding } from "@/lib/onboarding";
import OnboardingFlow from "@/components/OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const state = await loadOnboarding(supabase, user!.id);

  return <OnboardingFlow initialAnswers={state.answers} returning={state.seen} />;
}

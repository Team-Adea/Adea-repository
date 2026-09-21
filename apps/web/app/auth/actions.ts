"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Where this request came from, so emailed links point back at the right site (local or live). */
async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    fail("/signup", "Those passwords don't match.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${await siteOrigin()}/auth/callback?next=/` },
  });

  if (error) {
    fail("/signup", error.message);
  }

  // With email confirmation on, there is no session yet: ask them to check their inbox.
  if (!data.session) {
    redirect(`/check-email?email=${encodeURIComponent(email)}`);
  }

  redirect("/");
}

export async function resendConfirmation(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string).trim();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${await siteOrigin()}/auth/callback?next=/` },
  });

  if (error) {
    redirect(
      `/check-email?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}&resent=1`);
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    fail("/login", error.message);
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string).trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteOrigin()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    fail("/forgot-password", error.message);
  }

  redirect("/login?resetSent=1");
}

/** Runs from the reset-password page, where the emailed link has already signed the user in. */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    fail("/reset-password", "Those passwords don't match.");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    fail("/reset-password", error.message);
  }

  redirect("/");
}

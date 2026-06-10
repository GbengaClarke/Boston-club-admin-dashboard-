// // src/features/admins/adminApi.ts

import { supabase } from "./supabase";

// import { supabase } from "./supabase";

// export interface NewAdminPayload {
//   email: string;
//   fullName: string;
//   phone?: string;
//   role: "admin" | "customer";
// }

// export async function registerAdminUser(payload: NewAdminPayload) {
//   if (!supabase) throw new Error("Supabase client is not initialized.");

//   // Generate a random, temporary high-entropy password during initialization
//   const temporaryPassword = Math.random().toString(36).slice(-10) + "A1!";

//   // Execute an invocation call directly to your secure Edge Function
//   const { data, error } = await supabase.functions.invoke("create-admin-user", {
//     body: { ...payload, password: temporaryPassword },
//   });

//   if (error) throw new Error(error.message);
//   if (data?.error) throw new Error(data.error);

//   return data;
// }

export interface NewAdminPayload {
  email: string;
  fullName: string;
  phone?: string;
  role: "admin" | "customer";
}

/**
 * Registers a user profile using a secure Edge Function, then automatically
 * dispatches an authentication password-reset link to their email.
 */
export async function registerAdminUser(
  payload: NewAdminPayload
): Promise<{ success: boolean; data: any }> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Generate a random, temporary high-entropy password to satisfy base registration constraints
  const temporaryPassword = Math.random().toString(36).slice(-10) + "A1!";

  // 1. Invoke the secure edge function to handle row insertions and bypass triggers
  const { data, error: functionError } = await supabase.functions.invoke(
    "create-admin-user",
    {
      body: { ...payload, password: temporaryPassword },
    }
  );

  if (functionError) throw new Error(functionError.message);
  if (data?.error) throw new Error(data.error);

  // 2. Fire the magic onboarding link to the newly created user's inbox
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    payload.email,
    {
      redirectTo: `${window.location.origin}/update-password`,
    }
  );

  if (resetError)
    throw new Error(
      `User created, but invitation failed: ${resetError.message}`
    );

  return data;
}

/**
 * Updates the password for the currently authenticated user session.
 */
export async function updateSessionPassword(password: string): Promise<void> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

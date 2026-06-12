import { supabase } from "./supabase";

export interface NewAdminPayload {
  email: string;
  fullName: string;
  phone?: string;
  role: "admin" | "customer";
}

// export async function registerAdminUser(
//   payload: NewAdminPayload
// ): Promise<{ success: boolean; userId: string; devLink?: string }> {
//   if (!supabase) throw new Error("Supabase client is not initialized.");

//   const temporaryPassword = Math.random().toString(36).slice(-10) + "A1!";

//   // 1. Invoke the secure edge function
//   const { data, error: functionError } = await supabase.functions.invoke(
//     "create-admin-user",
//     {
//       body: { ...payload, password: temporaryPassword },
//     }
//   );

//   if (functionError) {
//     try {
//       const errorBody = await functionError.context.json();
//       if (errorBody?.error) {
//         throw new Error(errorBody.error);
//       }
//     } catch (e: any) {
//       if (e instanceof Error) throw e;
//       throw new Error(
//         functionError.message || "An unexpected network error occurred."
//       );
//     }
//   }

//   // Handle successful inline object validation flags
//   if (data?.error) throw new Error(data.error);

//   const userId = data?.userId;

//   try {
//     // 2. Dispatch onboarding link to user inbox
//     const { error: resetError } = await supabase.auth.resetPasswordForEmail(
//       payload.email,
//       { redirectTo: `${window.location.origin}/update-password` }
//     );

//     if (resetError) throw resetError;
//     return { success: true, userId };
//   } catch (resetError: any) {
//     if (resetError.message?.includes("rate limit exceeded")) {
//       const devLink = `${window.location.origin}/update-password#user_id=${userId}`;
//       return { success: true, userId, devLink };
//     }
//     throw new Error(
//       `User created, but invitation failed: ${resetError.message}`
//     );
//   }
// }

export async function registerAdminUser(
  payload: NewAdminPayload
): Promise<{ success: boolean; userId: string; devLink?: string }> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // 1. Invoke the secure edge function to create the account credentials
  const { data, error: functionError } = await supabase.functions.invoke(
    "create-admin-user",
    {
      body: payload,
    }
  );

  // Unpack Edge Function validation/database errors ("Email already in use", etc.)
  if (functionError) {
    try {
      const errorBody = await functionError.context.json();
      if (errorBody?.error) throw new Error(errorBody.error);
    } catch (e: any) {
      if (e instanceof Error) throw e;
      throw new Error(
        functionError.message || "An unexpected network error occurred."
      );
    }
  }

  if (data?.error) throw new Error(data.error);
  const userId = data?.userId;

  try {
    // 2. Dispatch onboarding link to user inbox immediately
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      payload.email,
      { redirectTo: `${window.location.origin}/update-password` }
    );

    if (resetError) throw resetError;

    // Everything worked beautifully!
    return { success: true, userId };
  } catch (resetError: any) {
    // --- CRITICAL FIX: IF EMAIL LIMIT MET, ROLL BACK ACCOUNT CREATION ---
    if (
      resetError.message?.includes("rate limit exceeded") ||
      resetError.status === 429
    ) {
      // Tell the Edge Function to clean up and delete the orphaned user account we just made
      await supabase.functions.invoke("create-admin-user", {
        body: { action: "cleanup-rollback", rollbackUserId: userId },
      });

      // Throw a specific error text that our React Query hook can catch and turn into a toast
      throw new Error(
        "Email invitation limit reached. Account creation aborted. Please try again in an hour."
      );
    }

    // Fallback for other invitation failures
    throw new Error(`Invitation setup failed: ${resetError.message}`);
  }
}
/**
 * Re-routes the new password directly to the secure admin Edge Function endpoint,
 * explicitly updating the targeted profile shell without modifying local login state.
 */
// export async function finalizeTargetedPassword(
//   userId: string,
//   password: string
// ): Promise<void> {
//   if (!supabase) throw new Error("Supabase client is not initialized.");

//   const { data, error } = await supabase.functions.invoke("create-admin-user", {
//     body: { action: "update-password", userId, password },
//   });

//   if (error) throw new Error(error.message);
//   if (data?.error) throw new Error(data.error);

//   // Cleanly log out the temporary shadow-session that Supabase creates from clicking the link
//   await supabase.auth.signOut();
// }

export async function finalizeTargetedPassword(
  password: string
): Promise<void> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Supabase automatically knows who this is based on the underlying token session!
  const { error } = await supabase.auth.updateUser({ password });

  if (error) throw error;

  // Sign out cleanly immediately after to wipe the temporary token out of storage
  await supabase.auth.signOut();
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "customer";
  image: string | null;
}

/**
 * Fetches the currently authenticated session user and matches
 * their ID with the corresponding row in the public profiles table.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // 1. Get the current active user session metadata
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  // 2. Fetch the descriptive row metrics matching that specific ID from profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, image")
    .eq("id", user.id)
    .single();

  if (profileError) {
    // If a profile record doesn't exist yet, return basic fallback authentication credentials
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || "Admin User",
      email: user.email || null,
      role: user.user_metadata?.role || "admin",
      image: null,
    };
  }

  return profile;
}


import { supabase } from "./supabase";

export interface UpdateProfilePayload {
  userId: string;
  fullName: string;
  avatarFile?: File | null;
  oldPassword?: string; 
  newPassword?: string;
}

export async function updateCurrentUserProfile({
  userId,
  fullName,
  avatarFile,
  oldPassword,
  newPassword,
}: UpdateProfilePayload) {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  let publicAvatarUrl: string | null = null;

  // Handle image binary upload to storage buckets if provided
  if (avatarFile) {
    const fileExtension = avatarFile.name.split(".").pop();
    const fileName = `${userId}.${fileExtension}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, avatarFile, { cacheControl: "3600", upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    publicAvatarUrl = publicUrlData.publicUrl;
  }

  // Perform metadata sync update inside public.profiles
  const updateFields: Record<string, any> = { full_name: fullName };
  if (publicAvatarUrl) updateFields.image = publicAvatarUrl;

  const { error: profileError } = await supabase
    .from("profiles")
    .update(updateFields)
    .eq("id", userId);

  if (profileError) throw profileError;

  //  SECURE PASSWORDS RE-AUTHENTICATION SEQUENCE
  if (newPassword && newPassword.trim().length >= 6) {
    if (!oldPassword) {
      throw new Error("You must provide your current password to assign a new password.");
    }

    // Retrieve active user email address factor securely from state instance
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) throw new Error("Could not verify active session context.");

    // Verify the old password by performing a background re-authentication handshake
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (verifyError) {
      throw new Error("Current password verification failed. Please try again.");
    }

    // Once verified, overwrite with the new high-entropy credential string
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (authError) throw authError;
  }

  return { success: true };
}
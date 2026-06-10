import { supabase } from "./supabase";

export interface ProfileFetchParams {
  roleFilter: string;
}

export async function getProfiles({ roleFilter }: ProfileFetchParams) {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Target 'orders' count while filtering down to matching status keys
  let query = supabase
    .from("profiles")
    .select(
      `
      *,
      orders(count)
    `
    )
    .eq("orders.status", "shipped");

  // Apply role parameters if the selection is distinct from 'all'
  if (roleFilter !== "all") {
    query = query.eq("role", roleFilter);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data || [];
}

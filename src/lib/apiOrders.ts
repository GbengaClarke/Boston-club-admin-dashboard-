import { supabase } from "./supabase";

export interface FetchOrdersParams {
  statusFilter: string;
}

export const fetchOrdersApi = async ({ statusFilter }: FetchOrdersParams) => {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Fetch all items belonging to the selected filter type to allow local cache mutations
  let query = supabase.from("orders").select("*, profiles(full_name, email)");
  // let query = supabase.from("orders").select("*, customers(full_name, email)");

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const updateOrderStatusApi = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOrderTrackingApi = async ({
  id,
  code,
}: {
  id: string;
  code: string;
}) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ tracking_number: code, status: "shipped" })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// import { supabase } from "./supabase";

// export interface FetchOrdersParams {
//   page: number;
//   pageSize: number;
//   statusFilter: string;
//   sortBy: string;
//   sortOrder: "asc" | "desc";
// }

// export const fetchOrdersApi = async ({
//   page,
//   pageSize,
//   statusFilter,
//   sortBy,
//   sortOrder,
// }: FetchOrdersParams) => {
//   if (!supabase) throw new Error("Supabase client is not initialized.");

//   // Calculate strict offset limits for server-side SQL pagination
//   const from = (page - 1) * pageSize;
//   const to = from + pageSize - 1;

//   // 1. Core query requesting specific row counts from Postgres
//   let query = supabase
//     .from("orders")
//     .select("*, customers(full_name, email)", { count: "exact" });

//   // 2. Conditional status filtering directly inside the query pipeline
//   if (statusFilter !== "all") {
//     query = query.eq("status", statusFilter);
//   }

//   // 3. Dynamic server-side sorting assignment
//   query = query.order(sortBy, { ascending: sortOrder === "asc" });

//   // 4. Implement range capping
//   const { data, error, count } = await query.range(from, to);

//   if (error) throw error;

//   return {
//     orders: data || [],
//     totalCount: count || 0,
//   };
// };

// export const updateOrderStatusApi = async ({
//   id,
//   status,
// }: {
//   id: string;
//   status: string;
// }) => {
//   const { data, error } = await supabase
//     .from("orders")
//     .update({ status })
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// };

// export const updateOrderTrackingApi = async ({
//   id,
//   code,
// }: {
//   id: string;
//   code: string;
// }) => {
//   const { data, error } = await supabase
//     .from("orders")
//     .update({ tracking_number: code, status: "shipped" })
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// };

import { supabase } from "./supabase";

export interface FetchOrdersParams {
  statusFilter: string;
}

export const fetchOrdersApi = async ({ statusFilter }: FetchOrdersParams) => {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Fetch all items belonging to the selected filter type to allow local cache mutations
  let query = supabase.from("orders").select("*, customers(full_name, email)");

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

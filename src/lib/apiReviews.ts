import { supabase } from "../lib/supabase";

export async function fetchReviewsApi({
  displayFilter,
}: {
  displayFilter: string;
}) {
  let query = supabase.from("reviews").select(`
      *,
      product:products(name),
      customer:customers(full_name, email)
    `);

  if (displayFilter === "displayed") {
    query = query.eq("is_displayed", true);
  } else if (displayFilter === "hidden") {
    query = query.eq("is_displayed", false);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateReviewDisplayApi({
  id,
  is_displayed,
}: {
  id: string;
  is_displayed: boolean;
}) {
  const { data, error } = await supabase
    .from("reviews")
    .update({ is_displayed })
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteReviewApi(id: string) {
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}

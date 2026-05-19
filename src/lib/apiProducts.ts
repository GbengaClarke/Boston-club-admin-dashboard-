import { supabase } from "./supabase";

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error(error.message);
  }

  return data;
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error(error.message);
  }

  return data;
};

export async function deleteProduct(id: string | number) {
  const { data, error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Product could not be deleted");
  }

  return data;
}

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

type AddProductInput = {
  name: string;
  description: string;
  regularPrice: number;
  discount: number;
  isNewArrival: boolean;
  category: string;
  material: string;

  color_name: string;
  color_hex: string;

  images: File[];
};

export async function addProduct(productData: AddProductInput) {
  const {
    name,
    description,
    regularPrice,
    discount,
    isNewArrival,
    category,
    material,
    color_name,
    color_hex,
    images,
  } = productData;

  // =========================
  // 1. CREATE PRODUCT
  // =========================
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert([
      {
        name,
        description,
        regularPrice,
        discount,
        isNewArrival,
        category,
        material,
      },
    ])
    .select()
    .single();

  if (productError) {
    throw new Error(productError.message);
  }

  // =========================
  // 2. UPLOAD IMAGES
  // =========================

  const uploadedImages = await Promise.all(
    images.map(async (image, index) => {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: storageError } = await supabase.storage
        .from("product-images")
        .upload(fileName, image);

      if (storageError) {
        throw new Error(storageError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(fileName);

      return {
        product_id: product.id,
        image_url: publicUrl,
        color_name,
        color_hex,
        is_main: index === 0,
      };
    })
  );

  // =========================
  // 3. INSERT PRODUCT IMAGES
  // =========================

  const { error: imageError } = await supabase
    .from("product_images")
    .insert(uploadedImages);

  if (imageError) {
    throw new Error(imageError.message);
  }

  return product;
}

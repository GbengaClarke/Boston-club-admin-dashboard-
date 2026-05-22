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

export interface AddVariantPayload {
  product_id: string;
  color_name: string;
  color_hex: string;
  images: File[];
}

const uploadImage = async (file: File, productId: string) => {
  const filePath = `${productId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const addProductVariant = async (payload: AddVariantPayload) => {
  const { product_id, color_name, color_hex, images } = payload;

  const uploadedImages = await Promise.all(
    images.map((file) => uploadImage(file, product_id))
  );

  const rows = uploadedImages.map((url, index) => ({
    product_id,
    image_url: url,
    color_name,
    color_hex,
    is_main: index === 0, // first image = main
  }));

  const { data, error } = await supabase
    .from("product_images")
    .insert(rows)
    .select();

  if (error) throw error;

  return data;
};

export async function deleteVariant({
  product_id,
  color_name,
}: {
  product_id: string;
  color_name: string;
}) {
  // 1. Delete variant (all images of that color)
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", product_id)
    .eq("color_name", color_name);

  if (deleteError) throw deleteError;

  // 2. Check if ANY variants remain
  const { data: remaining, error: fetchError } = await supabase
    .from("product_images")
    .select("id")
    .eq("product_id", product_id)
    .limit(1);

  if (fetchError) throw fetchError;

  const hasNoVariants = !remaining || remaining.length === 0;

  // 3. If none remain → delete product
  if (hasNoVariants) {
    const { error: productDeleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", product_id);

    if (productDeleteError) throw productDeleteError;
  }

  return {
    deletedVariant: true,
    deletedProduct: hasNoVariants,
  };
}

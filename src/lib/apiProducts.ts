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

// export const getProducts = async () => {
//   const { data, error } = await supabase
//     .from("products")
//     .select("*, product_images(*)")
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error("Supabase Error:", error.message);
//     throw new Error(error.message);
//   }

//   return data;
// };

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_archived", false) // Filters out archived products
    .eq("product_images.is_archived", false) // Filters out archived images/variants
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error(error.message);
  }

  return data;
};



// export async function deleteProduct(id: string | number) {
//   const { data, error } = await supabase
//     .from("products")
//     .update({ is_archived: true })
//     .eq("id", id)
//     .select();
//   if (error) {
//     console.error(error);
//     throw new Error("Product could not be archived");
//   }

//   return data;
// }

export async function deleteProduct(id: string | number) {
  // Execute both table updates concurrently
  const [productResponse, imagesResponse] = await Promise.all([
    supabase
      .from("products")
      .update({ is_archived: true })
      .eq("id", id)
      .select(),
    
    supabase
      .from("product_images")
      .update({ is_archived: true })
      .eq("product_id", id)
  ]);

  // Handle product update errors
  if (productResponse.error) {
    console.error("Product Archive Error:", productResponse.error.message);
    throw new Error("Product could not be archived");
  }

  // Handle images/variants update errors
  if (imagesResponse.error) {
    console.error("Product Images Archive Error:", imagesResponse.error.message);
    throw new Error("Product variants could not be fully archived");
  }

  // Return the updated product data
  return productResponse.data;
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

  // 3. INSERT PRODUCT IMAGES

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
  product_id: string | number;
  color_name: string;
}) {
  // Archive the variant (all images of that color)
  const { error: variantArchiveError } = await supabase
    .from("product_images")
    .update({ is_archived: true })
    .eq("product_id", product_id)
    .eq("color_name", color_name);

  if (variantArchiveError) {
    console.error("Failed to archive variant images:", variantArchiveError.message);
    throw variantArchiveError;
  }

  //  Check if ANY ACTIVE variants remain
  const { data: remaining, error: fetchError } = await supabase
    .from("product_images")
    .select("id")
    .eq("product_id", product_id)
    .eq("is_archived", false) 
    .limit(1);

  if (fetchError) {
    console.error("Error checking remaining variants:", fetchError.message);
    throw fetchError;
  }

  const hasNoVariants = !remaining || remaining.length === 0;

  //  If none remain → archive the entire parent product
  if (hasNoVariants) {
    const { error: productArchiveError } = await supabase
      .from("products")
      .update({ is_archived: true })
      .eq("id", product_id);

    if (productArchiveError) {
      console.error("Failed to archive product after last variant:", productArchiveError.message);
      throw productArchiveError;
    }
  }

  return {
    archivedVariant: true,
    archivedProduct: hasNoVariants,
  };
}



export interface UpdateProductPayload {
  productId: string;
  name: string;
  description: string;
  regularPrice: number;
  discount: number;
  isNewArrival: boolean;
  category: string;
  material: string;
  variantConfigurations: {
    color_name: string;
    color_hex: string;
    mode: "keep" | "overwrite" | "append";
    newFiles: File[];
  }[];
}

export async function updateProductAndVariants(payload: UpdateProductPayload) {
  const {
    productId,
    name,
    description,
    regularPrice,
    discount,
    isNewArrival,
    category,
    material,
    variantConfigurations,
  } = payload;

  //  UPDATE BASE PRODUCT DETAILS
  const { error: productUpdateError } = await supabase
    .from("products")
    .update({
      name,
      description,
      regularPrice,
      discount,
      isNewArrival,
      category,
      material,
    })
    .eq("id", productId);

  if (productUpdateError)
    throw new Error(`Product update failed: ${productUpdateError.message}`);

  //  PROCESS VARIANTS SEQUENTIALLY
  for (const config of variantConfigurations) {
    // Skip if user is keeping existing images and didn't add files
    if (config.mode === "keep" || config.newFiles.length === 0) continue;

    // OVERWRITE: Delete existing files from storage & rows from table
    if (config.mode === "overwrite") {
      const { data: records } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", productId)
        .eq("color_name", config.color_name);

      if (records && records.length > 0) {
        const filePaths = records
          .map((r) => {
            const parts = r.image_url.split("/product-images/");
            return parts.length > 1 ? parts[1] : null;
          })
          .filter(Boolean) as string[];

        if (filePaths.length > 0) {
          await supabase.storage.from("product-images").remove(filePaths);
        }
      }

      // Clear the rows
      await supabase
        .from("product_images")
        .delete()
        .eq("product_id", productId)
        .eq("color_name", config.color_name);
    }

    // Upload new files to bucket storage path
    const uploadedUrls = await Promise.all(
      config.newFiles.map(async (file) => {
        const filePath = `${productId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        return data.publicUrl;
      })
    );

    // Check if the product has ANY main image left to prevent breaking table layouts
    const { data: existingMain } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .eq("is_main", true)
      .limit(1);

    const needsMainImage = !existingMain || existingMain.length === 0;

    // Transform array to data rows
    const rowsToInsert = uploadedUrls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      color_name: config.color_name,
      color_hex: config.color_hex,
      is_main: needsMainImage && index === 0,
    }));

    const { error: insertError } = await supabase
      .from("product_images")
      .insert(rowsToInsert);

    if (insertError) throw insertError;
  }

  return { success: true };
}

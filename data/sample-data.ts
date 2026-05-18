// import { supabase } from "@/src/lib/supabase";
// import {
//   Category,
//   ColorOption,
//   Material,
//   Product,
//   ProductImage,
// } from "@/src/pages/Products";

// /**
//  * Script to batch upload 20 products to Supabase with 2 color variants each.
//  * Uses permanent public storage URLs for images.
//  */
// const uploadBostonClubCatalog = async (): Promise<void> => {
//   const categories: Category[] = ["clogs", "sandals", "slides"];
//   const materials: Material[] = ["suede", "leather"];

//   // Mapping categories to your specific public storage URLs
//   const imageMap: Record<Category, string> = {
//     clogs:
//       "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/clog.webp",
//     slides:
//       "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/slide.jpeg",
//     sandals:
//       "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/sandal.jpeg",
//   };

//   const colorPalette: ColorOption[] = [
//     { name: "Midnight Black", hex: "#1A1A1A" },
//     { name: "Tan Suede", hex: "#D2B48C" },
//     { name: "Espresso", hex: "#3E2723" },
//     { name: "Stone Grey", hex: "#9E9E9E" },
//     { name: "Olive Drab", hex: "#556B2F" },
//   ];

//   console.log("🚀 Starting batch upload...");

//   for (let i = 1; i <= 20; i++) {
//     const selectedCategory =
//       categories[Math.floor(Math.random() * categories.length)];
//     const selectedMaterial =
//       materials[Math.floor(Math.random() * materials.length)];

//     // 1. Insert the Parent Product
//     const { data: product, error: productError } = await supabase
//       .from("products")
//       .insert({
//         name: `Boston ${
//           selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)
//         } ${selectedCategory.slice(0, -1)} ${i}`,
//         description: `Premium ${selectedMaterial} ${selectedCategory} featuring the iconic Boston Club silhouette and comfort-first footbed.`,
//         regularPrice: Math.floor(Math.random() * (180 - 95) + 95),
//         discount: 15,
//         isNewArrival: i <= 5,
//         category: selectedCategory,
//         material: selectedMaterial,
//       } as Product)
//       .select("id")
//       .single();

//     if (productError || !product) {
//       console.error(`❌ Failed to insert product ${i}:`, productError?.message);
//       continue;
//     }

//     // 2. Randomly select 2 unique colors for variants
//     const shuffledColors = [...colorPalette].sort(() => 0.5 - Math.random());
//     const selectedColors = shuffledColors.slice(0, 2);

//     // 3. Prepare Image entries linked to the Product ID
//     const imageEntries: ProductImage[] = selectedColors.map((color, index) => ({
//       product_id: product.id,
//       image_url: imageMap[selectedCategory], // Picks the correct URL from your storage
//       color_name: color.name,
//       color_hex: color.hex,
//       is_main: index === 0, // First color is marked as the main thumbnail
//     }));

//     // 4. Insert the images into the product_images table
//     const { error: imageError } = await supabase
//       .from("product_images")
//       .insert(imageEntries);

//     if (imageError) {
//       console.error(
//         `❌ Image error for product ${product.id}:`,
//         imageError.message
//       );
//     } else {
//       console.log(
//         `✅ Success: Added ${selectedMaterial} ${selectedCategory} (${product.id})`
//       );
//     }
//   }

//   console.log("✨ All 20 products and 40 variants have been processed.");
// };

// export default uploadBostonClubCatalog;

import { supabase } from "@/src/lib/supabase";
import {
  Category,
  ColorOption,
  Material,
  Product,
  ProductImage,
} from "@/src/pages/Products";

/**
 * Script to reset the catalog and upload 20 products with Naira pricing.
 */
const uploadBostonClubCatalog = async (): Promise<void> => {
  const categories: Category[] = ["clogs", "sandals", "slides"];
  const materials: Material[] = ["suede", "leather"];

  const imageMap: Record<Category, string> = {
    clogs:
      "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/clog.webp",
    slides:
      "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/slide.jpeg",
    sandals:
      "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/sandal.jpeg",
  };

  const colorPalette: ColorOption[] = [
    { name: "Midnight Black", hex: "#1A1A1A" },
    { name: "Tan Suede", hex: "#D2B48C" },
    { name: "Espresso", hex: "#3E2723" },
    { name: "Stone Grey", hex: "#9E9E9E" },
    { name: "Olive Drab", hex: "#556B2F" },
  ];

  console.log("🧹 Cleaning existing catalog...");

  // 1. Delete all existing records
  // Note: Due to Foreign Key constraints, deleting from 'products'
  // should cascade and delete 'product_images' if your DB is set up that way.
  // If not, we delete images first.
  await supabase
    .from("product_images")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  const { error: clearError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Standard hack to delete all rows

  if (clearError) {
    console.error("❌ Error clearing table:", clearError.message);
    return;
  }

  console.log("🚀 Starting fresh batch upload...");

  for (let i = 1; i <= 20; i++) {
    const selectedCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const selectedMaterial =
      materials[Math.floor(Math.random() * materials.length)];

    // Pricing logic: Random value between 9,000 and 45,000
    const nairaPrice = Math.floor(Math.random() * (45000 - 9000) + 9000);

    // 2. Insert the Parent Product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: `Boston ${
          selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)
        } ${selectedCategory.slice(0, -1)} ${i}`,
        description: `Premium ${selectedMaterial} ${selectedCategory} featuring the iconic Boston Club silhouette.`,
        regularPrice: nairaPrice,
        discount: 10,
        isNewArrival: i <= 5,
        category: selectedCategory,
        material: selectedMaterial,
      } as Product)
      .select("id")
      .single();

    if (productError || !product) {
      console.error(`❌ Failed to insert product ${i}:`, productError?.message);
      continue;
    }

    // 3. Handle Variants
    const shuffledColors = [...colorPalette].sort(() => 0.5 - Math.random());
    const selectedColors = shuffledColors.slice(0, 2);

    const imageEntries: ProductImage[] = selectedColors.map((color, index) => ({
      product_id: product.id,
      image_url: imageMap[selectedCategory],
      color_name: color.name,
      color_hex: color.hex,
      is_main: index === 0,
    }));

    const { error: imageError } = await supabase
      .from("product_images")
      .insert(imageEntries);

    if (imageError) {
      console.error(
        `❌ Image error for product ${product.id}:`,
        imageError.message
      );
    } else {
      console.log(
        `✅ Success: Added ${product.name} at ₦${nairaPrice.toLocaleString()}`
      );
    }
  }

  console.log("✨ Catalog reset and updated with 20 new items.");
};

export default uploadBostonClubCatalog;

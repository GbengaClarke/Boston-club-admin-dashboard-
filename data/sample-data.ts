
// import { supabase } from "@/src/lib/supabase";
// import {
//   Category,
//   Material,
//   Product,
//   ProductImage,
//   OrderStatus,
//   CreateOrderInput,
//   CreateOrderItemInput,
// } from "@/src/types/ProductTypes";

// // Local structural type definition for colors
// export interface ColorOption {
//   name: string;
//   hex: string;
// }

// const imageMap: Record<Category, string> = {
//   clogs:
//     "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/clog.webp",
//   slides:
//     "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/slide.jpeg",
//   sandals:
//     "https://iievuxppbwdnakmepltl.supabase.co/storage/v1/object/public/product-images/sandal.jpeg",
// };

// const colorPalette: ColorOption[] = [
//   { name: "Midnight Black", hex: "#1A1A1A" },
//   { name: "Tan Suede", hex: "#D2B48C" },
//   { name: "Espresso", hex: "#3E2723" },
//   { name: "Stone Grey", hex: "#9E9E9E" },
//   { name: "Olive Drab", hex: "#556B2F" },
// ];

// /**
//  * 🧹 Core database cleaner helper function
//  * Empties order details and catalog data systematically to respect relations.
//  */
// async function clearEntireDatabase() {
//   console.log("🧹 Clearing cascading database tables...");

//   // Wiping item content records first
//   await supabase
//     .from("order_items")
//     .delete()
//     .neq("id", "00000000-0000-0000-0000-000000000000");
//   await supabase
//     .from("orders")
//     .delete()
//     .neq("id", "00000000-0000-0000-0000-000000000000");
//   await supabase
//     .from("product_images")
//     .delete()
//     .neq("id", "00000000-0000-0000-0000-000000000000");

//   const { error: productClearError } = await supabase
//     .from("products")
//     .delete()
//     .neq("id", "00000000-0000-0000-0000-000000000000");

//   if (productClearError) {
//     throw new Error(`Failed to empty tables: ${productClearError.message}`);
//   }
// }

// /**
//  * Script to reset the database and upload 20 fresh products.
//  */
// export const uploadBostonClubCatalog = async (): Promise<void> => {
//   await clearEntireDatabase();
//   console.log("🚀 Starting fresh product catalog seed...");

//   const categories: Category[] = ["clogs", "sandals", "slides"];
//   const materials: Material[] = ["suede", "leather"];

//   for (let i = 1; i <= 20; i++) {
//     const selectedCategory =
//       categories[Math.floor(Math.random() * categories.length)];
//     const selectedMaterial =
//       materials[Math.floor(Math.random() * materials.length)];
//     const nairaPrice = Math.floor(Math.random() * (45000 - 9000) + 9000);

//     const { data: product, error: productError } = await supabase
//       .from("products")
//       .insert({
//         name: `Boston ${
//           selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)
//         } ${selectedCategory.slice(0, -1)} ${i}`,
//         description: `Premium ${selectedMaterial} ${selectedCategory} featuring the iconic Boston Club silhouette.`,
//         regularPrice: nairaPrice,
//         discount: 10,
//         isNewArrival: i <= 5,
//         category: selectedCategory,
//         material: selectedMaterial,
//       })
//       .select("id, name")
//       .single();

//     if (productError || !product) {
//       console.error(`❌ Failed to insert product ${i}:`, productError?.message);
//       continue;
//     }

//     const shuffledColors = [...colorPalette].sort(() => 0.5 - Math.random());
//     const selectedColors = shuffledColors.slice(0, 2);

//     const imageEntries = selectedColors.map((color, index) => ({
//       product_id: product.id,
//       image_url: imageMap[selectedCategory],
//       color_name: color.name,
//       color_hex: color.hex,
//       is_main: index === 0,
//     }));

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
//         `✅ Added ${product.name} at ₦${nairaPrice.toLocaleString()}`
//       );
//     }
//   }
//   console.log("✨ Catalog successfully initialized.");
// };

// /**
//  * Script to reset the database, assert base operational products exist,
//  * and construct 12 transactional orders mapped to 30 relational line items.
//  */
// export const seedOrdersAndItems = async (): Promise<void> => {
//   // 1. Wipe everything to secure explicit baseline state
//   await clearEntireDatabase();

//   // 2. Fetch a valid customer profile reference to fulfill constraints
//   let { data: customerRow, error: customerErr } = await supabase
//     .from("profiles")
//     .select("id")
//     .limit(1)
//     .maybeSingle();

//   // ✨ FIX: If no customer exists, dynamically spawn a dummy one!
//   if (!customerRow) {
//     console.log("👤 No customers found. Spawning a dummy customer profile...");

//     const { data: newCustomer, error: createCustomerErr } = await supabase
//       .from("profiles")
//       .insert({
//         // Adapt these fields to match your actual 'customers' table schema
//         full_name: "John Doe (Seed Account)",
//         email: "john.doe@example.com",
//         phone: "+2348000000000",
//       })
//       .select("id")
//       .single();

//     if (createCustomerErr || !newCustomer) {
//       throw new Error(
//         `Failed to auto-create a seed customer: ${createCustomerErr?.message}`
//       );
//     }

//     customerRow = newCustomer;
//   }

//   const customerId = customerRow.id;

//   console.log("📦 Creating base product items for orders mapping...");
//   // 3. Generate baseline items to guarantee data to link up with
//   const baseCategories: Category[] = ["clogs", "slides"];
//   const targetProductIds: string[] = [];
//   const targetVariantIds: string[] = [];
//   const variantPrices: Record<string, number> = {};

//   for (let p = 1; p <= 5; p++) {
//     const category = baseCategories[p % baseCategories.length];
//     const basePrice = 25000 + p * 2000;

//     const { data: prod } = await supabase
//       .from("products")
//       .insert({
//         name: `Order Core ${category.toUpperCase()} Prototype v${p}`,
//         description: "Seed anchor context variant item.",
//         regularPrice: basePrice,
//         discount: 0,
//         isNewArrival: false,
//         category: category,
//         material: "leather" as Material,
//       })
//       .select("id")
//       .single();

//     if (prod) {
//       targetProductIds.push(prod.id);

//       const { data: img } = await supabase
//         .from("product_images")
//         .insert({
//           product_id: prod.id,
//           image_url: imageMap[category],
//           color_name: "Raw Charcoal",
//           color_hex: "#222222",
//           is_main: true,
//         })
//         .select("id")
//         .single();

//       if (img) {
//         targetVariantIds.push(img.id);
//         variantPrices[img.id] = basePrice;
//       }
//     }
//   }

//   if (targetProductIds.length === 0 || targetVariantIds.length === 0) {
//     throw new Error(
//       "Aborting seed operation: Base production entities failed initialization lifecycle steps."
//     );
//   }

//   console.log("📝 Building out 12 detailed mock orders...");
//   const statuses: OrderStatus[] = [
//     "pending",
//     "paid",
//     "processing",
//     "shipped",
//     "delivered",
//   ];
//   const orderIds: string[] = [];

//   // 4. Inject 12 Base Orders
//   for (let o = 1; o <= 12; o++) {
//     const selectedStatus = statuses[o % statuses.length];
//     const orderPayload: CreateOrderInput = {
//       customer_id: customerId,
//       total_price: 0, // Calculated dynamically during item generation mapping
//       status: selectedStatus,
//     };

//     const { data: newOrder, error: orderErr } = await supabase
//       .from("orders")
//       .insert(orderPayload)
//       .select("id")
//       .single();

//     if (orderErr || !newOrder) {
//       console.error(
//         "❌ Critical breakdown inserting order instance row:",
//         orderErr?.message
//       );
//       continue;
//     }
//     orderIds.push(newOrder.id);
//   }

//   console.log(
//     "🔗 Binding 30 contextual transactional lines across active orders..."
//   );
//   // 5. Structure exactly 30 distributed order item rows
//   const itemsCountTarget = 30;
//   const itemsBuffer: CreateOrderItemInput[] = [];
//   const orderCalculatedTotals: Record<string, number> = {};

//   for (let itemIdx = 0; itemIdx < itemsCountTarget; itemIdx++) {
//     // Distribute systematically across generated order lines
//     const assignedOrderId = orderIds[itemIdx % orderIds.length];

//     // Choose random baseline reference item variant configurations
//     const variantIdChoice = targetVariantIds[itemIdx % targetVariantIds.length];
//     const matchingProductId =
//       targetProductIds[targetVariantIds.indexOf(variantIdChoice)];
//     const itemUnitPrice = variantPrices[variantIdChoice];
//     const purchasedQuantity = (itemIdx % 3) + 1; // Produces varied mix values: 1, 2, or 3 units

//     itemsBuffer.push({
//       order_id: assignedOrderId,
//       product_id: matchingProductId,
//       variant_id: variantIdChoice,
//       quantity: purchasedQuantity,
//       unit_price: itemUnitPrice,
//     });

//     // Track total billing tallies per envelope container
//     const totalLineCost = itemUnitPrice * purchasedQuantity;
//     orderCalculatedTotals[assignedOrderId] =
//       (orderCalculatedTotals[assignedOrderId] || 0) + totalLineCost;
//   }

//   // Flush buffer data directly into Supabase
//   const { error: lineItemsFlushError } = await supabase
//     .from("order_items")
//     .insert(itemsBuffer);

//   if (lineItemsFlushError) {
//     console.error(
//       "❌ Massive failure stacking order context item array elements:",
//       lineItemsFlushError.message
//     );
//     return;
//   }

//   // 6. Sync computed checkout monetary pricing values back down to target parent records
//   console.log(
//     "🔄 Updating final aggregated billing figures on parent envelopes..."
//   );
//   for (const orderId of orderIds) {
//     const finalBillAmount = orderCalculatedTotals[orderId] || 0;
//     await supabase
//       .from("orders")
//       .update({ total_price: finalBillAmount })
//       .eq("id", orderId);
//   }

//   console.log(
//     "✨ Complete seeding structural execution finished successfully!"
//   );
// };

import { supabase } from "@/src/lib/supabase";
import {
  Category,
  Material,
  Product,
  ProductImage,
  OrderStatus,
  CreateOrderInput,
  CreateOrderItemInput,
} from "@/src/types/ProductTypes";

// Local structural type definition for colors
export interface ColorOption {
  name: string;
  hex: string;
}

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

const MOCK_COMMENTS = [
  "Incredibly comfortable! Feels premium and fits perfectly true to size.",
  "The suede finish is absolutely stunning. Love the attention to detail.",
  "Fast shipping here to Lagos. Highly recommend this brand!",
  "Extremely stylish and versatile. Perfect for both casual and semi-formal wear.",
  "The leather is exceptionally soft. Excellent value for money.",
  "Got so many compliments wearing these slides today. Outstanding craftsmanship!",
  "Exactly as described, maybe even better in person. 10/10 comfortable soles."
];

/**
 * 🧹 Core database cleaner helper function
 * Empties order details, reviews, and catalog data systematically to respect relational cascades.
 */
async function clearEntireDatabase() {
  console.log("🧹 Clearing cascading database tables...");

  // 1. Wipe dependent reviews first to clear product foreign key constraints
  await supabase
    .from("reviews")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  // 2. Wipe item content records
  await supabase
    .from("order_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  // 3. Wipe parent orders
  await supabase
    .from("orders")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  // 4. Wipe product images
  await supabase
    .from("product_images")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  // 5. Delete products catalog
  const { error: productClearError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (productClearError) {
    throw new Error(`Failed to empty tables: ${productClearError.message}`);
  }
}

/**
 * Resolves a customer profile ID, creating a fallback John Doe customer if none exists.
 */
async function getOrCreateCustomer(): Promise<string> {
  let { data: customerRow } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!customerRow) {
    console.log("👤 No customers found. Spawning a dummy customer profile...");

    const { data: newCustomer, error: createCustomerErr } = await supabase
      .from("profiles")
      .insert({
        full_name: "John Doe (Seed Account)",
        email: "john.doe@example.com",
        phone: "+2348000000000",
      })
      .select("id")
      .single();

    if (createCustomerErr || !newCustomer) {
      throw new Error(
        `Failed to auto-create a seed customer: ${createCustomerErr?.message}`
      );
    }
    return newCustomer.id;
  }

  return customerRow.id;
}

/**
 * Script to reset the database and upload 20 fresh products along with corresponding reviews.
 */
export const uploadBostonClubCatalog = async (): Promise<void> => {
  await clearEntireDatabase();
  console.log("🚀 Starting fresh product catalog seed...");

  const customerId = await getOrCreateCustomer();
  const categories: Category[] = ["clogs", "sandals", "slides"];
  const materials: Material[] = ["suede", "leather"];

  for (let i = 1; i <= 20; i++) {
    const selectedCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const selectedMaterial =
      materials[Math.floor(Math.random() * materials.length)];
    const nairaPrice = Math.floor(Math.random() * (45000 - 9000) + 9000);
    const productName = `Boston ${
      selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)
    } ${selectedCategory.slice(0, -1)} ${i}`;

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: productName,
        description: `Premium ${selectedMaterial} ${selectedCategory} featuring the iconic Boston Club silhouette.`,
        regularPrice: nairaPrice,
        discount: 10,
        isNewArrival: i <= 5,
        category: selectedCategory,
        material: selectedMaterial,
      })
      .select("id, name")
      .single();

    if (productError || !product) {
      console.error(`❌ Failed to insert product ${i}:`, productError?.message);
      continue;
    }

    // Insert Product Colors and Images
    const shuffledColors = [...colorPalette].sort(() => 0.5 - Math.random());
    const selectedColors = shuffledColors.slice(0, 2);

    const imageEntries = selectedColors.map((color, index) => ({
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
      console.error(`❌ Image error for product ${product.id}:`, imageError.message);
    } else {
      console.log(`✅ Added ${product.name} at ₦${nairaPrice.toLocaleString()}`);
    }

    // Insert Product Reviews (1 to 2 random positive reviews per product)
    const reviewsToCreate = Math.floor(Math.random() * 2) + 1;
    const reviewPayloads = [];

    for (let r = 0; r < reviewsToCreate; r++) {
      const commentIndex = Math.floor(Math.random() * MOCK_COMMENTS.length);
      reviewPayloads.push({
        product_id: product.id,
        customer_id: customerId,
        rating: Math.floor(Math.random() * 2) + 4, // Generates 4 or 5 stars
        comment: MOCK_COMMENTS[commentIndex],
        is_displayed: true,
        product_name: product.name,
      });
    }

    const { error: reviewError } = await supabase
      .from("reviews")
      .insert(reviewPayloads);

    if (reviewError) {
      console.error(`❌ Review seeding error for product ${product.id}:`, reviewError.message);
    } else {
      console.log(`💬 Added ${reviewsToCreate} review(s) for ${product.name}`);
    }
  }
  console.log("✨ Catalog successfully initialized with reviews.");
};

/**
 * Script to reset the database, assert base operational products exist,
 * and construct 12 transactional orders mapped to 30 relational line items and custom reviews.
 */
export const seedOrdersAndItems = async (): Promise<void> => {
  // 1. Wipe everything to secure explicit baseline state
  await clearEntireDatabase();

  // 2. Fetch or create customer profile
  const customerId = await getOrCreateCustomer();

  console.log("📦 Creating base product items for orders mapping...");
  // 3. Generate baseline items to guarantee link relationships
  const baseCategories: Category[] = ["clogs", "slides"];
  const targetProductIds: string[] = [];
  const targetVariantIds: string[] = [];
  const variantPrices: Record<string, number> = {};

  for (let p = 1; p <= 5; p++) {
    const category = baseCategories[p % baseCategories.length];
    const basePrice = 25000 + p * 2000;
    const productName = `Order Core ${category.toUpperCase()} Prototype v${p}`;

    const { data: prod } = await supabase
      .from("products")
      .insert({
        name: productName,
        description: "Seed anchor context variant item.",
        regularPrice: basePrice,
        discount: 0,
        isNewArrival: false,
        category: category,
        material: "leather" as Material,
      })
      .select("id, name")
      .single();

    if (prod) {
      targetProductIds.push(prod.id);

      const { data: img } = await supabase
        .from("product_images")
        .insert({
          product_id: prod.id,
          image_url: imageMap[category],
          color_name: "Raw Charcoal",
          color_hex: "#222222",
          is_main: true,
        })
        .select("id")
        .single();

      if (img) {
        targetVariantIds.push(img.id);
        variantPrices[img.id] = basePrice;
      }

      // Add simple review validation to base orders products as well
      const commentIndex = Math.floor(Math.random() * MOCK_COMMENTS.length);
      await supabase.from("reviews").insert({
        product_id: prod.id,
        customer_id: customerId,
        rating: 5,
        comment: MOCK_COMMENTS[commentIndex],
        is_displayed: true,
        product_name: prod.name,
      });
    }
  }

  if (targetProductIds.length === 0 || targetVariantIds.length === 0) {
    throw new Error(
      "Aborting seed operation: Base production entities failed initialization lifecycle steps."
    );
  }

  console.log("📝 Building out 12 detailed mock orders...");
  const statuses: OrderStatus[] = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
  ];
  const orderIds: string[] = [];

  // 4. Inject 12 Base Orders
  for (let o = 1; o <= 12; o++) {
    const selectedStatus = statuses[o % statuses.length];
    const orderPayload: CreateOrderInput = {
      customer_id: customerId,
      total_price: 0,
      status: selectedStatus,
    };

    const { data: newOrder, error: orderErr } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    if (orderErr || !newOrder) {
      console.error(
        "❌ Critical breakdown inserting order instance row:",
        orderErr?.message
      );
      continue;
    }
    orderIds.push(newOrder.id);
  }

  console.log(
    "🔗 Binding 30 contextual transactional lines across active orders..."
  );
  // 5. Structure exactly 30 distributed order item rows
  const itemsCountTarget = 30;
  const itemsBuffer: CreateOrderItemInput[] = [];
  const orderCalculatedTotals: Record<string, number> = {};

  for (let itemIdx = 0; itemIdx < itemsCountTarget; itemIdx++) {
    const assignedOrderId = orderIds[itemIdx % orderIds.length];
    const variantIdChoice = targetVariantIds[itemIdx % targetVariantIds.length];
    const matchingProductId =
      targetProductIds[targetVariantIds.indexOf(variantIdChoice)];
    const itemUnitPrice = variantPrices[variantIdChoice];
    const purchasedQuantity = (itemIdx % 3) + 1;

    itemsBuffer.push({
      order_id: assignedOrderId,
      product_id: matchingProductId,
      variant_id: variantIdChoice,
      quantity: purchasedQuantity,
      unit_price: itemUnitPrice,
    });

    const totalLineCost = itemUnitPrice * purchasedQuantity;
    orderCalculatedTotals[assignedOrderId] =
      (orderCalculatedTotals[assignedOrderId] || 0) + totalLineCost;
  }

  // Flush buffer data directly into Supabase
  const { error: lineItemsFlushError } = await supabase
    .from("order_items")
    .insert(itemsBuffer);

  if (lineItemsFlushError) {
    console.error(
      "❌ Massive failure stacking order context item array elements:",
      lineItemsFlushError.message
    );
    return;
  }

  // 6. Sync computed checkout totals back to parent records
  console.log(
    "🔄 Updating final aggregated billing figures on parent envelopes..."
  );
  for (const orderId of orderIds) {
    const finalBillAmount = orderCalculatedTotals[orderId] || 0;
    await supabase
      .from("orders")
      .update({ total_price: finalBillAmount })
      .eq("id", orderId);
  }

  console.log(
    "✨ Complete seeding structural execution finished successfully!"
  );
};
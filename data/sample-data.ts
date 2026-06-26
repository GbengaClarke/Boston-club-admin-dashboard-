import { supabase } from "@/src/lib/supabase";
import {
  Category,
  Material,
  OrderStatus,
} from "@/src/types/ProductTypes";

interface SeedProduct {
  name: string;
  category: Category;
  material: Material;
  description: string;
  basePrice: number;
  discount: number; // Stored as absolute flat Naira values
  isNewArrival: boolean;
  images: { url: string; colorName: string; colorHex: string }[];
}

// 1. Curated Footwear Catalog conforming strictly to Category and Material types
const FOOTWEAR_CATALOG: SeedProduct[] = [
  {
    name: "Aero Stratus Slide",
    category: "slides",
    material: "leather",
    description: "Ultra-cushioned recovery slides designed with ergonomic leather arch support and a lightweight responsive sole.",
    basePrice: 24500,
    discount: 0, // ₦1,500 off
    isNewArrival: true,
    images: [
      { url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80", colorName: "Bone White", colorHex: "#F5F5DC" },
      { url: "https://images.unsplash.com/photo-1622141992941-114d49d0658e?auto=format&fit=crop&w=600&q=80", colorName: "Midnight Slate", colorHex: "#2F4F4F" }
    ]
  },
  {
    name: "Vanguard Nubuck Clog",
    category: "clogs",
    material: "suede",
    description: "Premium water-resistant nubuck upper paired with a contoured cork footbed that molds perfectly to your footprint.",
    basePrice: 58000,
    discount: 5000, // ₦5,000 off
    isNewArrival: false,
    images: [
      { url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80", colorName: "Taupe Suede", colorHex: "#B38B6D" },
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80", colorName: "Espresso", colorHex: "#3E2723" }
    ]
  },
  {
    name: "Nomad Woven Sandal",
    category: "sandals",
    material: "leather",
    description: "Handcrafted full-grain leather straps with a reinforced high-traction rubber outsole made for city tracking.",
    basePrice: 42000,
    discount: 0, //
    isNewArrival: true,
    images: [
      { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80", colorName: "Tan Leather", colorHex: "#A0522D" },
      { url: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=600&q=80", colorName: "Onyx Black", colorHex: "#111111" }
    ]
  },
  {
    name: "Zenith Minimalist Slide",
    category: "slides",
    material: "leather",
    description: "Sleek, architectural lines structured from single-piece butter soft calfskin leather for high-end lounging.",
    basePrice: 35000,
    discount: 3000, // ₦3,000 off
    isNewArrival: false,
    images: [
      { url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80", colorName: "Caramel", colorHex: "#C68E17" },
      { url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80", colorName: "Chalk", colorHex: "#EAEAEA" }
    ]
  },
  {
    name: "Meridian Trail Sandal",
    category: "sandals",
    material: "leather",
    description: "Heavy-duty utilitarian trail sandal featuring fast-drying tech straps and shock-absorbing premium leather wrap linings.",
    basePrice: 48500,
    discount: 800, // ₦800 off
    isNewArrival: false,
    images: [
      { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80", colorName: "Sage Green", colorHex: "#8F9779" },
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", colorName: "Crimson Accent", colorHex: "#990000" }
    ]
  },
  {
    name: "Harbor Suede Mule",
    category: "clogs",
    material: "suede",
    description: "An elegant closed-toe transition slipper lined with deep shearling wool insulation for premier luxury comfort.",
    basePrice: 62000,
    discount: 6500, // ₦6,500 off
    isNewArrival: false,
    images: [
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80", colorName: "Sand Suede", colorHex: "#E6C2A0" },
      { url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80", colorName: "Charcoal Grey", colorHex: "#555555" }
    ]
  },
  {
    name: "Apex Hydro Slide",
    category: "slides",
    material: "leather",
    description: "Waterproof Treated leather slides engineered for wet transitions, featuring channeled footbeds for instant drainage.",
    basePrice: 19000,
    discount: 1200, // ₦1,200 off
    isNewArrival: false,
    images: [
      { url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80", colorName: "Pacific Blue", colorHex: "#4682B4" },
      { url: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=600&q=80", colorName: "Signal Orange", colorHex: "#FF4500" }
    ]
  },
  {
    name: "Terrace Classic Clog",
    category: "clogs",
    material: "leather",
    description: "Vintage-inspired heritage clogs fitted with an oiled pull-up leather shell and durable brass structural rivets.",
    basePrice: 55000,
    discount: 4000, // ₦4,000 off
    isNewArrival: true,
    images: [
      { url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80", colorName: "Chestnut", colorHex: "#8B4513" },
      { url: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=600&q=80", colorName: "Black Grain", colorHex: "#1C1C1C" }
    ]
  },
  {
    name: "Odyssey Exploration Sandal",
    category: "sandals",
    material: "leather",
    description: "Multi-terrain outsoles coupled with variable lock buckle architectures, offering stability on variable surfaces.",
    basePrice: 51000,
    discount: 1000, // ₦1,000 off
    isNewArrival: false,
    images: [
      { url: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=600&q=80", colorName: "Desert Mud", colorHex: "#705335" },
      { url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80", colorName: "Stealth", colorHex: "#232323" }
    ]
  },
  {
    name: "Garrison Utility Clog",
    category: "clogs",
    material: "suede",
    description: "Industrial strength composite architecture paired with a rich weatherized suede layer for durability and design.",
    basePrice: 33000,
    discount: 0, 
    isNewArrival: false,
    images: [
      { url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80", colorName: "Industrial Navy", colorHex: "#002040" },
      { url: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&w=600&q=80", colorName: "Ash Grey", colorHex: "#B0C4DE" }
    ]
  }
];

// 2. Comprehensive Review Pools (Balanced Sentiments)
const POSITIVE_COMMENTS = [
  "Incredibly comfortable! Feels premium and fits perfectly true to size.",
  "The suede finish is absolutely stunning. Love the attention to detail.",
  "Fast shipping here to Lagos. Highly recommend this brand!",
  "Extremely stylish and versatile. Perfect for daily wear.",
  "The leather is exceptionally soft. Excellent value for money."
];

const BAD_COMMENTS = [
  "The sole started splitting after just two weeks of use. Disappointed for this price point.",
  "Sizing runs way too tight and narrow across the bridge. Consider sizing up.",
  "Shipping took forever to get to Ikeja, and the original box arrived completely smashed.",
  "The material feels much stiffer in person than the luxury product description suggests.",
  "Gave me rough blisters on my heel during the first walk. The inner stitching feels unrefined."
];

// 3. High-Quality Nigerian Address Vectors
const REALISTIC_ADDRESSES = [
  "Block 42, Flat 4, Alhaji Masha Road, Surulere, Lagos",
  "12 Banana Island Road, Ikoyi, Lagos",
  "Apt 3B, 15 Ademola Adetokunbo Crescent, Wuse II, Abuja",
  "45 Ghafe Close, off Peter Odili Road, Port Harcourt, Rivers",
  "76 Ring Road, near Challenge Roundabout, Ibadan, Oyo",
  "5B Admiralty Way, Lekki Phase 1, Lagos"
];

/**
 * Ensures the target seed customer exists and returns its primary key ID.
 */
async function getOrCreateTargetCustomer(): Promise<string> {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", "sample@test.com")
    .maybeSingle();

  if (existingProfile) {
    return existingProfile.id;
  }

  console.log("👤 Provisioning central test user profile (sample@test.com)...");
  const { data: newProfile, error: profileErr } = await supabase
    .from("profiles")
    .insert({
      full_name: "Micheal O. (Sample Account)",
      email: "sample@test.com",
      phone: "+2348030001122",
    })
    .select("id")
    .single();

  if (profileErr || !newProfile) {
    throw new Error(`Failed to initialize central profile target: ${profileErr?.message}`);
  }

  return newProfile.id;
}

export async function clearEntireDatabase() {
  console.log("🧹 Clearing cascading database tables safely...");
  await supabase.from("reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("order_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("product_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}

/**
 * 🚀 MAIN STOREFRONT SEED PIPELINE
 */
export const seedCompleteStoreDataset = async (): Promise<void> => {
  try {
    await clearEntireDatabase();
    console.log("🚀 Starting fresh analytical database seed...");

    // Resolve unified customer profile context
    const masterCustomerId = await getOrCreateTargetCustomer();

    console.log("👟 Provisioning catalog products and variant configurations...");
    const injectedProducts: { id: string; name: string; regularPrice: number; discount: number }[] = [];
    const productToVariantMap: Record<string, string[]> = {};
    const variantPriceMap: Record<string, number> = {};

    for (const item of FOOTWEAR_CATALOG) {
      const { data: prod, error: pErr } = await supabase
        .from("products")
        .insert({
          name: item.name,
          description: item.description,
          regularPrice: item.basePrice,
          discount: item.discount, 
          isNewArrival: item.isNewArrival,
          category: item.category,
          material: item.material,
        })
        .select("id, name, regularPrice, discount")
        .single();

      if (pErr || !prod) {
        console.error(`❌ Setup failed for ${item.name}:`, pErr?.message);
        continue;
      }

      injectedProducts.push(prod);
      productToVariantMap[prod.id] = [];

      // Add minimum 2 carousel image variants per item
      for (let idx = 0; idx < item.images.length; idx++) {
        const imgAsset = item.images[idx];
        const { data: vRow } = await supabase
          .from("product_images")
          .insert({
            product_id: prod.id,
            image_url: imgAsset.url,
            color_name: imgAsset.colorName,
            color_hex: imgAsset.colorHex,
            is_main: idx === 0,
          })
          .select("id")
          .single();

        if (vRow) {
          productToVariantMap[prod.id].push(vRow.id);
          // Variant baseline checkout captures calculation: BasePrice minus Flat Discount
          variantPriceMap[vRow.id] = Math.max(0, prod.regularPrice - prod.discount);
        }
      }

      // Add structured sentiment reviews per product
      const leavesPositive = Math.random() > 0.3; 
      const reviewComment = leavesPositive 
        ? POSITIVE_COMMENTS[Math.floor(Math.random() * POSITIVE_COMMENTS.length)]
        : BAD_COMMENTS[Math.floor(Math.random() * BAD_COMMENTS.length)];
      const reviewRating = leavesPositive ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 2) + 1;

      await supabase.from("reviews").insert({
        product_id: prod.id,
        customer_id: masterCustomerId,
        rating: reviewRating,
        comment: reviewComment,
        is_displayed: true,
        product_name: prod.name,
      });
    }

    // 4. Construct 30 Time-Distributed Orders
    console.log("📝 Disbursing 30 analytical order fields over a 90-day trajectory...");
    const orderIdsPool: string[] = [];

    for (let oIdx = 1; oIdx <= 30; oIdx++) {
      const targetAddress = REALISTIC_ADDRESSES[oIdx % REALISTIC_ADDRESSES.length];
      
      // Dynamic metric weights for status distributions
      let computedStatus: OrderStatus = "delivered";
      if (oIdx % 9 === 0) computedStatus = "cancelled";
      else if (oIdx % 7 === 0) computedStatus = "refunded";
      else if (oIdx % 5 === 0) computedStatus = "pending";
      else if (oIdx % 4 === 0) computedStatus = "shipped";
      else if (oIdx % 3 === 0) computedStatus = "processing";

      // Linear historical mathematical spread
      const daysAgo = Math.floor((oIdx / 30) * 90) + (oIdx % 3);
      const generatedDate = new Date();
      generatedDate.setDate(generatedDate.getDate() - daysAgo);

      const { data: newOrder, error: oErr } = await supabase
        .from("orders")
        .insert({
          customer_id: masterCustomerId,
          total_price: 0, // Calculated dynamically below
          status: computedStatus,
          shipping_address: targetAddress,
          created_at: generatedDate.toISOString(),
          updated_at: generatedDate.toISOString(),
        })
        .select("id")
        .single();

      if (oErr || !newOrder) {
        console.error(`❌ Order creation fault at index ${oIdx}:`, oErr?.message);
        continue;
      }
      orderIdsPool.push(newOrder.id);
    }

    // 5. Populate relational order items and finalize calculations
    console.log("🔗 Binding distributed line item purchases...");
    const orderTotalsMap: Record<string, number> = {};

    for (let iIdx = 0; iIdx < orderIdsPool.length; iIdx++) {
      const assignedOrderId = orderIdsPool[iIdx];
      const itemsToBuy = (iIdx % 5 === 0) ? 2 : 1; // Mixed item clusters

      for (let purchaseNum = 0; purchaseNum < itemsToBuy; purchaseNum++) {
        const selectedProd = injectedProducts[(iIdx + purchaseNum) % injectedProducts.length];
        const variantsAvailable = productToVariantMap[selectedProd.id];
        
        if (!variantsAvailable || variantsAvailable.length === 0) continue;
        
        const selectedVariantId = variantsAvailable[purchaseNum % variantsAvailable.length];
        const computedCheckoutPrice = variantPriceMap[selectedVariantId];
        const qty = (iIdx % 2) + 1; // Quantities of 1 or 2 items

        await supabase.from("order_items").insert({
          order_id: assignedOrderId,
          product_id: selectedProd.id,
          variant_id: selectedVariantId,
          quantity: qty,
          unit_price: computedCheckoutPrice,
        });

        orderTotalsMap[assignedOrderId] = (orderTotalsMap[assignedOrderId] || 0) + (computedCheckoutPrice * qty);
      }
    }

    // 6. Re-sync calculated aggregates back to parent records
    console.log("🔄 Finalizing financial aggregations across parent tables...");
    for (const orderId of orderIdsPool) {
      const billAmount = orderTotalsMap[orderId] || 0;
      await supabase
        .from("orders")
        .update({ total_price: billAmount })
        .eq("id", orderId);
    }

    console.log("✨ Database successfully seeded! All dashboard metrics are live.");
  } catch (error: any) {
    console.error("❌ Master seed script encountered an unhandled exception:", error.message);
  }
};
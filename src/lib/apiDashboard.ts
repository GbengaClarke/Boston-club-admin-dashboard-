
import { supabase } from "./supabase";

export interface DashboardStats {
  totalRevenue: number;
  averageOrderValue: number;
  activeFulfillmentCount: number;
  cancellationRate: number;
  categoryData: { name: string; value: number }[];
  materialData: { name: string; value: number }[];
  statusTimeline: { status: string; count: number }[];
  timelineData: { name: string; value: number }[];
  salesFlow: {
    grossBooked: number;
    finalizedRevenue: number;
    heldInPipeline: number;
    lostVolume: number;
  };
  recentOrders: any[];
}

export async function getDashboardAnalytics(daysRange: number): Promise<DashboardStats> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Calculate the target ISO timestamp threshold based on the active selection filter
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysRange);
  const cutoffString = cutoffDate.toISOString();

  // 1. Core Fetch: Extract orders with nested profiles & items joined to product dimensions
  const { data: rawOrders, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      profiles(full_name, email),
      order_items(
        quantity,
        unit_price,
        products(category, material)
      )
    `)
    .order("created_at", { ascending: false });

  if (orderError) throw orderError;
  const allOrders = rawOrders || [];

  // 2. Filter down the dataset before doing any calculations
  const filteredOrders = allOrders.filter((order) => order.created_at >= cutoffString);

  // 3. Reset metric accumulation vectors
  let grossBooked = 0;
  let finalizedRevenue = 0;
  let heldInPipeline = 0;
  let lostVolume = 0;
  
  let validOrdersCount = 0;
  let activeFulfillmentCount = 0;
  let cancelledOrRefundedCount = 0;

  const categoryMap: Record<string, number> = { clogs: 0, sandals: 0, slides: 0 };
  const materialMap: Record<string, number> = { suede: 0, leather: 0 };
  const pipelineMap: Record<string, number> = {};

  // Initialize chronological daily keys to prevent charting gaps
  const timelineMap: Record<string, number> = {};
  for (let i = daysRange - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    timelineMap[label] = 0;
  }

  // 4. Aggregate metrics solely on filtered items
  filteredOrders.forEach((order) => {
    const orderValue = Number(order.total_price) || 0;
    grossBooked += orderValue;

    // Track state pipelines
    pipelineMap[order.status] = (pipelineMap[order.status] || 0) + 1;

    if (["delivered", "shipped"].includes(order.status)) {
      finalizedRevenue += orderValue;
    } else if (["pending", "paid", "processing"].includes(order.status)) {
      heldInPipeline += orderValue;
      activeFulfillmentCount++;
    } else if (["cancelled", "refunded"].includes(order.status)) {
      lostVolume += orderValue;
      cancelledOrRefundedCount++;
    }

    if (!["cancelled", "refunded"].includes(order.status)) {
      validOrdersCount++;

      // Extract line product categorical details with normalization checks
      order.order_items?.forEach((item: any) => {
        // Safe check: Handles both plural (products) and singular (product) relations
        const prod = item.products || item.product;
        
        if (prod) {
          const qty = Number(item.quantity) || 0;

          // Normalize strings (e.g. "Clogs" -> "clogs", "sandal" -> "sandals")
          let categoryKey = (prod.category || "").toLowerCase().trim();
          if (categoryKey === "clog") categoryKey = "clogs";
          if (categoryKey === "sandal") categoryKey = "sandals";
          if (categoryKey === "slide") categoryKey = "slides";

          let materialKey = (prod.material || "").toLowerCase().trim();
          if (materialKey === "suedes") materialKey = "suede";
          if (materialKey === "leathers") materialKey = "leather";

          // FIXED: Accumulate the raw dynamic quantity count here, NOT raw monetary currency
          if (categoryKey in categoryMap) {
            categoryMap[categoryKey] += qty;
          }
          if (materialKey in materialMap) {
            materialMap[materialKey] += qty;
          }
        }
      });

      // Populate timeline dataset
      const dateLabel = new Date(order.created_at).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
      });
      if (dateLabel in timelineMap) {
        timelineMap[dateLabel] += orderValue;
      }
    }
  });

  // Convert timeline maps into sorted chronological array structures
  const timelineData = Object.entries(timelineMap).map(([name, value]) => ({
    name,
    value,
  }));

  const statusTimeline = Object.entries(pipelineMap).map(([status, count]) => ({
    status,
    count: count as number,
  }));

  return {
    totalRevenue: finalizedRevenue,
    averageOrderValue: validOrdersCount > 0 ? finalizedRevenue / validOrdersCount : 0,
    activeFulfillmentCount,
    cancellationRate: filteredOrders.length > 0 ? (cancelledOrRefundedCount / filteredOrders.length) * 100 : 0,
    categoryData: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
    materialData: Object.entries(materialMap).map(([name, value]) => ({ name, value })),
    statusTimeline,
    timelineData,
    salesFlow: { grossBooked, finalizedRevenue, heldInPipeline, lostVolume },
    recentOrders: filteredOrders,
  };
}
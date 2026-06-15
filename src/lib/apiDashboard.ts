// src/features/lib/apiDashboard.ts
import { supabase } from "./supabase";

export interface DashboardStats {
  totalRevenue: number;
  averageOrderValue: number;
  activeFulfillmentCount: number;
  cancellationRate: number;
  categoryData: { name: string; value: number }[];
  materialData: { name: string; value: number }[];
  statusTimeline: { status: string; count: number }[];
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
  const orders = rawOrders || [];

  // 2. Localized Matrix Aggregations (Prevents multi-trip latency overhead)
  let revenueAccumulator = 0;
  let validOrdersCount = 0;
  let activeFulfillmentCount = 0;
  let cancelledOrRefundedCount = 0;

  const categoryMap: Record<string, number> = { clogs: 0, sandals: 0, slides: 0 };
  const materialMap: Record<string, number> = { suede: 0, leather: 0 };
  const pipelineMap: Record<string, number> = {};

  orders.forEach((order) => {
    // Pipeline configuration counter
    pipelineMap[order.status] = (pipelineMap[order.status] || 0) + 1;

    if (["pending", "paid", "processing", "shipped"].includes(order.status)) {
      activeFulfillmentCount++;
    }

    if (["cancelled", "refunded"].includes(order.status)) {
      cancelledOrRefundedCount++;
    } else {
      revenueAccumulator += order.total_price;
      validOrdersCount++;

      // Process product material/category segment distributions from line items
      order.order_items?.forEach((item: any) => {
        const prod = item.products;
        if (prod) {
          if (prod.category in categoryMap) {
            categoryMap[prod.category] += item.quantity;
          }
          if (prod.material in materialMap) {
            materialMap[prod.material] += item.quantity;
          }
        }
      });
    }
  });

  // 3. Filter orders to feed the time-windowed logs table
  const filteredRecentOrders = orders.filter((o) => o.created_at >= cutoffString);

  return {
    totalRevenue: revenueAccumulator,
    averageOrderValue: validOrdersCount > 0 ? revenueAccumulator / validOrdersCount : 0,
    activeFulfillmentCount,
    cancellationRate: orders.length > 0 ? (cancelledOrRefundedCount / orders.length) * 100 : 0,
    categoryData: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
    materialData: Object.entries(materialMap).map(([name, value]) => ({ name, value })),
    statusTimeline: Object.entries(pipelineMap).map(([status, count]) => ({ status, count })),
    recentOrders: filteredRecentOrders,
  };
}


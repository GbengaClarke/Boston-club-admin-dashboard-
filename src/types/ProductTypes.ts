export type Category = "clogs" | "sandals" | "slides";
export type Material = "suede" | "leather";

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  color_name: string;
  color_hex: string;
  is_main: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  regularPrice: number;
  discount: number;
  isNewArrival: boolean;
  category: Category;
  material: Material;
  sizes?: number[];
  product_images?: ProductImage[];
  created_at?: string;
}

// 1. ORDER STATUS TYPE ENUM
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

// 2. MAIN ORDERS INTERFACE (The Envelope)
export interface Order {
  id: string; // UUID maps to string
  order_number: number; // SERIAL auto-increment maps to number
  customer_id: string; // UUID maps to string
  total_price: number; // NUMERIC(10,2) maps to number
  status: OrderStatus; // Managed by our custom status type enum string
  created_at: string; // ISO Timestamp string format
  updated_at: string; // ISO Timestamp string format
}

// 3. ORDER ITEMS INTERFACE (The Contents)
export interface OrderItem {
  id: string; // UUID maps to string
  order_id: string; // Foreign key pointing to parent Order
  product_id: string; // Foreign key pointing to the shoe parent product
  variant_id: string; // Foreign key pointing to the specific stock variation profile
  quantity: number; // INT maps to number
  unit_price: number; // NUMERIC(10,2) captured checkout rate snapshot
  created_at: string; // ISO Timestamp string format
}

// -------------------------------------------------------------
// HELPER TYPES FOR API FEEDS & UTILITIES
// -------------------------------------------------------------

/**
 * Use this when fetching a comprehensive Order payload from Supabase / Postgres
 * that performs an internal itemized row join aggregation.
 */
export interface OrderWithDetails extends Order {
  order_items: OrderItem[];
}

/**
 * Useful when submitting data to an API endpoint to generate a fresh database row,
 * omitting structural auto-generated database metrics.
 */
export type CreateOrderInput = Omit<
  Order,
  "id" | "order_number" | "created_at" | "updated_at"
>;
export type CreateOrderItemInput = Omit<OrderItem, "id" | "created_at">;

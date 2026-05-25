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

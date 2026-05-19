import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category, Product } from "../types/ProductTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMainImage = (product: Product) => {
  if (!product.product_images || product.product_images.length === 0)
    return null;
  return (
    product.product_images.find((img) => img.is_main) ||
    product.product_images[0]
  );
};

export const getCategoryStyles = (category: Category) => {
  switch (category) {
    case "clogs":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "sandals":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "slides":
      return "bg-sky-50 text-sky-700 border-sky-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

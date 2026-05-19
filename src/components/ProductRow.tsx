import { motion } from "framer-motion";
import { Edit2, Trash2, ShoppingBag } from "lucide-react";
import { getCategoryStyles, getMainImage } from "../lib/utils";
import { Product } from "../types/ProductTypes";

interface ProductRowProps {
  product: Product;
  onSelect: (product: Product) => void;
  onDelete: (id: string | number) => void;
}

export function ProductRow({ product, onSelect, onDelete }: ProductRowProps) {
  const mainImage = getMainImage(product);

  return (
    <motion.tr
      onClick={() => onSelect(product)}
      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
    >
      <td className="px-6 py-4">
        <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-300 overflow-hidden">
          {mainImage?.image_url ? (
            <img
              src={mainImage.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ShoppingBag className="w-5 h-5" />
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
            {product.description}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-bold">
        <span
          className={`px-2.5 py-1 rounded-full border uppercase tracking-wider ${getCategoryStyles(
            product.category
          )}`}
        >
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-600 font-medium capitalize">
        {product.material}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">
            ₦{product.regularPrice.toLocaleString()}
          </span>
          {product.discount > 0 && (
            <span className="text-[10px] text-rose-500">
              -{product.discount}% off
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => product.id && onDelete(product.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

import { motion } from "framer-motion";
import { Edit2, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { getCategoryStyles, getMainImage } from "../lib/utils";
import { Product } from "../types/ProductTypes";

interface ProductRowProps {
  product: Product;
  onSelect: (product: Product) => void;
  onDelete: (id: string | number) => void;
  disabled: boolean;
}

export function ProductRow({
  product,
  onSelect,
  onDelete,
  disabled,
}: ProductRowProps) {
  const mainImage = getMainImage(product);

  return (
    <motion.tr
      // Prevent selection if disabled
      onClick={() => !disabled && onSelect(product)}
      initial={false}
      animate={{ opacity: disabled ? 0.6 : 1 }}
      className={`transition-colors group border-b border-slate-100 ${
        disabled
          ? "bg-slate-50/30 cursor-not-allowed"
          : "hover:bg-slate-50/50 cursor-pointer"
      }`}
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
          <span
            className={`font-bold text-slate-900 transition-colors ${
              !disabled && "group-hover:text-indigo-600"
            }`}
          >
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
          <button
            disabled={disabled}
            // title="Edit"
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            disabled={disabled}
            // title="Delete"
            onClick={() => product.id && onDelete(product.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[32px]"
          >
            {disabled ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

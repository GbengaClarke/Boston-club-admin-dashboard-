// import { motion } from "framer-motion";
// import { Edit2, Trash2, ShoppingBag, Loader2, Plus } from "lucide-react";
// import { formatCurrency, getCategoryStyles, getMainImage } from "../lib/utils";
// import { Product } from "../types/ProductTypes";

// interface ProductRowProps {
//   product: Product;
//   onSelect: (product: Product) => void;
//   onDelete: (id: string | number) => void;
//   disabled: boolean;
//   onAddVariant?: (product: Product) => void;
// }

// export function ProductRow({
//   product,
//   onSelect,
//   onDelete,
//   disabled,
//   onAddVariant,
// }: ProductRowProps) {
//   const mainImage = getMainImage(product);
//   const variantCount =
//     new Set(
//       product.product_images?.map((img) => img.color_hex ?? img.color_name)
//     ).size || 0;

//   const finalPrice = product.regularPrice - (product.discount || 0);

//   return (
//     <motion.tr
//       onClick={() => !disabled && onSelect(product)}
//       initial={false}
//       animate={{ opacity: disabled ? 0.6 : 1 }}
//       className={`transition-colors group border-b border-slate-100 ${
//         disabled
//           ? "bg-slate-50/30 cursor-not-allowed"
//           : "hover:bg-slate-50/50 cursor-pointer"
//       }`}
//     >
//       {/* IMAGE */}
//       <td className="px-6 py-4">
//         <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-300 overflow-hidden">
//           {mainImage?.image_url ? (
//             <img
//               src={mainImage.image_url}
//               alt={product.name}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <ShoppingBag className="w-5 h-5" />
//           )}
//         </div>
//       </td>

//       {/* PRODUCT INFO */}
//       <td className="px-6 py-4">
//         <div className="flex flex-col">
//           <span
//             className={`font-bold text-slate-900 transition-colors ${
//               !disabled && "group-hover:text-indigo-600"
//             }`}
//           >
//             {product.name}
//           </span>
//           <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
//             {product.description}
//           </span>
//         </div>
//       </td>

//       {/* CATEGORY */}
//       <td className="px-6 py-4 text-xs font-bold">
//         <span
//           className={`px-2.5 py-1 rounded-full border uppercase tracking-wider ${getCategoryStyles(
//             product.category
//           )}`}
//         >
//           {product.category}
//         </span>
//       </td>

//       {/* MATERIAL */}
//       <td className="px-6 py-4 text-slate-600 font-medium capitalize">
//         {product.material}
//       </td>

//       {/* PRICE */}
//       <td className="px-6 py-4">
//         <div className="flex flex-col">
//           <span className="font-bold text-slate-900">
//             {/* ₦{product.regularPrice.toLocaleString()} */}
//             {formatCurrency(finalPrice)}
//           </span>
//           {product.discount > 0 && (
//             <span className="text-[10px] text-rose-500">
//               -{Math.round((product.discount / product.regularPrice) * 100)}%
//             </span>
//           )}
//         </div>
//       </td>

//       {/* ACTIONS */}
//       <td className="px-6 py-4 text-right">
//         <div
//           className="flex items-center justify-end gap-1"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             type="button"
//             disabled={disabled}
//             title="Add variant"
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();

//               if (onAddVariant) {
//                 onAddVariant(product);
//               }
//             }}
//             className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Plus className="w-4 h-4" />

//             <span className="md:inline uppercase">
//               Variant
//               {variantCount > 0 && (
//                 <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
//                   {variantCount}
//                 </span>
//               )}
//             </span>
//           </button>

//           <button
//             disabled={disabled}
//             className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Edit2 className="w-4 h-4" />
//           </button>

//           <button
//             disabled={disabled}
//             onClick={() => product.id && onDelete(product.id)}
//             className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[32px]"
//           >
//             {disabled ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Trash2 className="w-4 h-4" />
//             )}
//           </button>
//         </div>
//       </td>
//     </motion.tr>
//   );
// }

import { motion } from "framer-motion";
import { Edit2, Trash2, ShoppingBag, Loader2, Plus } from "lucide-react";
import { formatCurrency, getCategoryStyles, getMainImage } from "../lib/utils";
import { Product } from "../types/ProductTypes";

interface ProductRowProps {
  product: Product;
  onSelect: (product: Product) => void;
  onDelete: (id: string | number) => void;
  onEdit: (product: Product) => void;
  disabled: boolean;
  onAddVariant?: (product: Product) => void;
}

export function ProductRow({
  product,
  onSelect,
  onDelete,
  onEdit,
  disabled,
  onAddVariant,
}: ProductRowProps) {
  const mainImage = getMainImage(product);
  const variantCount =
    new Set(
      product.product_images?.map((img) => img.color_hex ?? img.color_name)
    ).size || 0;

  const finalPrice = product.regularPrice - (product.discount || 0);

  return (
    <motion.tr
      onClick={() => !disabled && onSelect(product)}
      initial={false}
      animate={{ opacity: disabled ? 0.6 : 1 }}
      className={`transition-colors group border-b border-slate-100 ${
        disabled
          ? "bg-slate-50/30 cursor-not-allowed"
          : "hover:bg-slate-50/50 cursor-pointer"
      }`}
    >
      {/* IMAGE */}
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

      {/* PRODUCT INFO */}
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

      {/* CATEGORY */}
      <td className="px-6 py-4 text-xs font-bold">
        <span
          className={`px-2.5 py-1 rounded-full border uppercase tracking-wider ${getCategoryStyles(
            product.category
          )}`}
        >
          {product.category}
        </span>
      </td>

      {/* MATERIAL */}
      <td className="px-6 py-4 text-slate-600 font-medium capitalize">
        {product.material}
      </td>

      {/* PRICE */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">
            {formatCurrency(finalPrice)}
          </span>
          {product.discount > 0 && (
            <span className="text-[10px] text-rose-500">
              -{Math.round((product.discount / product.regularPrice) * 100)}%
            </span>
          )}
        </div>
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4 text-right">
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            disabled={disabled}
            title="Add variant"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onAddVariant) {
                onAddVariant(product);
              }
            }}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span className="md:inline uppercase">
              Variant
              {variantCount > 0 && (
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {variantCount}
                </span>
              )}
            </span>
          </button>

          {/* EDIT BUTTON (TRIGGER MODAL) */}
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(product);
            }}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={disabled}
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

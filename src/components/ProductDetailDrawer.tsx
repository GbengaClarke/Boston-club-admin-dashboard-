// import { motion } from "framer-motion";
// import { X, ShoppingBag, Sparkles } from "lucide-react";
// import { getMainImage } from "../lib/utils";
// import { Product } from "../types/ProductTypes";

// interface DrawerProps {
//   selectedProduct: Product;
//   onClose: () => void;
// }

// export function ProductDetailDrawer({ selectedProduct, onClose }: DrawerProps) {
//   const mainImage = getMainImage(selectedProduct);

//   console.log(selectedProduct);

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
//       />
//       <motion.div
//         initial={{ x: "100%" }}
//         animate={{ x: 0 }}
//         exit={{ x: "100%" }}
//         transition={{ type: "spring", damping: 25, stiffness: 200 }}
//         className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
//       >
//         <div className="p-6 flex items-center justify-between border-b border-slate-100">
//           <h2 className="font-bold text-slate-800 uppercase tracking-tight">
//             Product Preview
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-slate-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-slate-500" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-8">
//           <div className="aspect-square w-full bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-300 mb-6 overflow-hidden">
//             {mainImage?.image_url ? (
//               <img
//                 src={mainImage.image_url}
//                 alt={selectedProduct.name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <>
//                 <ShoppingBag className="w-12 h-12 mb-2" />
//                 <p className="text-[10px] font-bold uppercase tracking-widest">
//                   No Image Available
//                 </p>
//               </>
//             )}
//           </div>

//           <div className="space-y-6">
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="text-2xl font-bold text-slate-900">
//                   {selectedProduct.name}
//                 </h3>
//                 {selectedProduct.isNewArrival && (
//                   <Sparkles className="w-5 h-5 text-amber-500" />
//                 )}
//               </div>
//               <p className="text-slate-500 text-sm leading-relaxed">
//                 {selectedProduct.description}
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//                 <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
//                   Material
//                 </span>
//                 <span className="font-semibold text-slate-700 capitalize">
//                   {selectedProduct.material}
//                 </span>
//               </div>
//               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//                 <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
//                   Price
//                 </span>
//                 <span className="font-semibold text-slate-700">
//                   ₦{selectedProduct.regularPrice.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 border-t border-slate-100">
//           <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
//             Edit Details
//           </button>
//         </div>
//       </motion.div>
//     </>
//   );
// }

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, ShoppingBag, Sparkles } from "lucide-react";
import { getMainImage } from "../lib/utils";
import { Product } from "../types/ProductTypes";

interface DrawerProps {
  selectedProduct: Product;
  onClose: () => void;
}

export function ProductDetailDrawer({ selectedProduct, onClose }: DrawerProps) {
  // 1. Get unique color variants from the product_images array
  const colorVariants = useMemo(() => {
    const unique = new Map();
    selectedProduct.product_images?.forEach((img) => {
      if (!unique.has(img.color_name)) {
        unique.set(img.color_name, img);
      }
    });
    return Array.from(unique.values());
  }, [selectedProduct.product_images]);

  // 2. Set initial state to the main image's color or the first available color
  const initialColor =
    getMainImage(selectedProduct)?.color_name || colorVariants[0]?.color_name;
  const [selectedColor, setSelectedColor] = useState(initialColor);

  // 3. Filter images based on the selected color
  const displayImages = useMemo(() => {
    return (
      selectedProduct.product_images?.filter(
        (img) => img.color_name === selectedColor
      ) || []
    );
  }, [selectedColor, selectedProduct.product_images]);

  // Use the first image of the filtered set for the preview
  const currentPreviewImage = displayImages[0]?.image_url;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0  backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-bold text-slate-800 uppercase tracking-tight">
            Product Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="aspect-square w-full bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-300 mb-6 overflow-hidden">
            {currentPreviewImage ? (
              <motion.img
                key={currentPreviewImage} // Key helps Framer Motion trigger animations on change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={currentPreviewImage}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <ShoppingBag className="w-12 h-12 mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  No Image Available
                </p>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-slate-900">
                  {selectedProduct.name}
                </h3>
                {selectedProduct.isNewArrival && (
                  <Sparkles className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Material
                </span>
                <span className="font-semibold text-slate-700 capitalize">
                  {selectedProduct.material}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Price
                </span>
                <span className="font-semibold text-slate-700">
                  ₦{selectedProduct.regularPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* COLOR VARIANTS SECTION */}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">
                Available Colors
              </span>
              <div className="flex flex-wrap gap-3">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedColor(variant.color_name)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      selectedColor === variant.color_name
                        ? "border-indigo-600 bg-indigo-50/50"
                        : "border-slate-100 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: variant.color_hex }}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-tight ${
                        selectedColor === variant.color_name
                          ? "text-indigo-700"
                          : "text-slate-500"
                      }`}
                    >
                      {variant.color_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100">
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Edit Details
          </button>
        </div>
      </motion.div>
    </>
  );
}

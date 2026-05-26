// import { useState, useMemo, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
// import { getMainImage, formatCurrency } from "../lib/utils";
// import { Product } from "../types/ProductTypes";
// import { useDeleteVariant } from "../productFeatures/useDeleteVariant";
// import { Modal } from "../ui/Modal";
// // import { deleteProduct } from "../lib/apiProducts";
// import { LiaShoePrintsSolid } from "react-icons/lia";
// import { GiRolledCloth } from "react-icons/gi";
// import { useDeleteProduct } from "../productFeatures/useDeleteProduct";

// interface DrawerProps {
//   selectedProduct: Product;
//   onClose: () => void;
// }

// export function ProductDetailDrawer({ selectedProduct, onClose }: DrawerProps) {
//   const { mutate: deleteVariant, isPending } = useDeleteVariant();
//   const { isDeleting, deleteProduct } = useDeleteProduct();

//   const [selectedColor, setSelectedColor] = useState<string | undefined>();
//   const [variantToDelete, setVariantToDelete] = useState<string | null>(null);
//   const [deleteMode, setDeleteMode] = useState<"variant" | "product" | null>(
//     null
//   );

//   // ✅ LOCAL STATE FOR INSTANT UI UPDATE
//   const [localImages, setLocalImages] = useState(
//     selectedProduct.product_images || []
//   );

//   useEffect(() => {
//     setLocalImages(selectedProduct.product_images || []);
//   }, [selectedProduct]);

//   // 1. Logic for unique color variants
//   const colorVariants = useMemo(() => {
//     const map = new Map<string, any>();

//     localImages.forEach((img) => {
//       const keyName = img.color_name || img.color_hex || "default-color";
//       if (!map.has(keyName)) map.set(keyName, img);
//     });

//     return Array.from(map.values());
//   }, [localImages]);

//   const activeColor =
//     selectedColor ||
//     getMainImage({
//       ...selectedProduct,
//       product_images: localImages,
//     })?.color_name ||
//     colorVariants[0]?.color_name ||
//     "";

//   const displayImages = useMemo(() => {
//     return localImages.filter((img) => (img.color_name || "") === activeColor);
//   }, [activeColor, localImages]);

//   const preview = displayImages[0]?.image_url;

//   const handleDeleteClick = (colorName: string) => {
//     setVariantToDelete(colorName || "Unknown Color");
//     setDeleteMode(colorVariants.length === 1 ? "product" : "variant");
//   };

//   const confirmDelete = async () => {
//     if (!variantToDelete || !selectedProduct.id) return;

//     if (deleteMode === "variant") {
//       deleteVariant(
//         { product_id: selectedProduct.id, color_name: variantToDelete },
//         {
//           onSuccess: () => {
//             // ✅ INSTANT UI UPDATE (NO REFRESH NEEDED)
//             const updatedImages = localImages.filter(
//               (img) => img.color_name !== variantToDelete
//             );

//             setLocalImages(updatedImages);

//             if (selectedColor === variantToDelete) {
//               setSelectedColor(updatedImages[0]?.color_name);
//             }

//             setVariantToDelete(null);
//             setDeleteMode(null);
//           },
//         }
//       );
//     } else {
//       await deleteProduct(selectedProduct.id);
//       onClose();
//     }
//   };

//   const finalPrice =
//     selectedProduct.regularPrice - (selectedProduct.discount || 0);

//   return (
//     <AnimatePresence>
//       {/* BACKDROP */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 backdrop-blur-md z-[60]"
//       />

//       {/* DRAWER */}
//       <motion.div
//         initial={{ x: "100%" }}
//         animate={{ x: 0 }}
//         exit={{ x: "100%" }}
//         transition={{ type: "spring", damping: 25, stiffness: 200 }}
//         className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white z-[70] shadow-2xl flex flex-col"
//       >
//         {/* HEADER */}
//         <div className="px-6 py-4 border-b border-slate-100 flex justify-between w-full items-center bg-white sm:sticky fixed top-0 z-10">
//           <div>
//             <h2 className="text-lg font-bold text-slate-800">
//               Product Details
//             </h2>
//             <p className="text-xs text-slate-500 uppercase tracking-wider">
//               Inventory Management
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-slate-100 rounded-full transition-colors"
//           >
//             <X className="w-6 h-6 text-slate-500" />
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="flex-1 mt-17 sm:mt-0 overflow-y-auto overflow-x-hidden p-6 space-y-8">
//           {/* IMAGE */}
//           <section>
//             <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100 group">
//               {preview ? (
//                 <img
//                   src={preview}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                   alt={selectedProduct.name}
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full text-slate-300">
//                   <ShoppingBag className="w-12 h-12 mb-2" />
//                   <span className="text-sm">No image available</span>
//                 </div>
//               )}

//               {selectedProduct.isNewArrival && (
//                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-amber-100">
//                   <Sparkles className="w-3.5 h-3.5 text-amber-500" />
//                   <span className="text-[10px] font-bold text-amber-700 uppercase">
//                     New Arrival
//                   </span>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* INFO */}
//           <section className="space-y-2">
//             <div className="flex justify-between items-start gap-4">
//               <h3 className="text-2xl font-extrabold text-slate-900 leading-tight flex-1">
//                 {selectedProduct.name}
//               </h3>

//               <div className="flex flex-col items-end">
//                 <p className="text-xl font-bold text-indigo-600">
//                   {formatCurrency(finalPrice)}
//                 </p>

//                 {selectedProduct.discount > 0 && (
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-sm text-slate-400 line-through">
//                       {formatCurrency(selectedProduct.regularPrice)}
//                     </span>
//                     <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">
//                       -
//                       {Math.round(
//                         (selectedProduct.discount /
//                           selectedProduct.regularPrice) *
//                           100
//                       )}
//                       %
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center gap-4 text-sm text-slate-500">
//               <span className="flex items-center gap-1">
//                 <LiaShoePrintsSolid className="w-4 h-4" />
//                 {selectedProduct.category}
//               </span>
//               <span className="w-1 h-1 rounded-full bg-slate-300" />
//               <span className="flex items-center gap-1">
//                 <GiRolledCloth className="w-4 h-4" />
//                 {selectedProduct.material}
//               </span>
//             </div>
//           </section>

//           {/* DESCRIPTION */}
//           <section>
//             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
//               Description
//             </h4>
//             <p className="text-slate-600 leading-relaxed text-sm">
//               {selectedProduct.description}
//             </p>
//           </section>

//           {/* VARIANTS */}
//           <section className="pb-10">
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                 Available Variants
//               </h4>
//               <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
//                 {colorVariants.length}{" "}
//                 {colorVariants.length > 1 ? "Colors" : "Color"}
//               </span>
//             </div>

//             <div className="grid grid-cols-1 gap-3">
//               {colorVariants.map((v, i) => {
//                 const itemKey = `variant-color-${
//                   v.id || v.color_hex || "color"
//                 }-${i}`;
//                 const isItemActive = activeColor === v.color_name;

//                 return (
//                   <div
//                     key={itemKey}
//                     className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
//                       isItemActive
//                         ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
//                         : "border-slate-200 hover:border-slate-300 bg-white"
//                     }`}
//                   >
//                     <button
//                       type="button"
//                       onClick={() => setSelectedColor(v.color_name)}
//                       className="flex items-center gap-3 flex-1"
//                     >
//                       <span
//                         className="w-8 h-8 rounded-full border border-black/5 shadow-inner"
//                         style={{ backgroundColor: v.color_hex || "#e2e8f0" }}
//                       />
//                       <div className="text-left">
//                         <p className="text-sm font-bold text-slate-800">
//                           {v.color_name || "Standard Variant"}
//                         </p>
//                         <p className="text-[10px] text-slate-500 uppercase">
//                           {v.color_hex || "No hex"}
//                         </p>
//                       </div>
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => handleDeleteClick(v.color_name)}
//                       className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         </div>
//       </motion.div>

//       {/* MODAL */}
//       <Modal
//         isOpen={!!variantToDelete}
//         onClose={() => {
//           setVariantToDelete(null);
//           setDeleteMode(null);
//         }}
//         title={deleteMode === "product" ? "Delete Product?" : "Remove Variant?"}
//       >
//         <div className="space-y-4 pt-2">
//           <p className="text-sm text-slate-600 leading-relaxed">
//             {deleteMode === "product"
//               ? "Warning: This is the last variant. Deleting it will remove the entire product."
//               : `Are you sure you want to remove the ${variantToDelete} variant?`}
//           </p>

//           <div className="flex gap-3 pt-2">
//             <button
//               onClick={() => {
//                 setVariantToDelete(null);
//                 setDeleteMode(null);
//               }}
//               className="flex-1 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={confirmDelete}
//               disabled={isPending}
//               className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50"
//             >
//               {isPending ? "Processing..." : "Confirm Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </AnimatePresence>
//   );
// }

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { getMainImage, formatCurrency } from "../lib/utils";
import { Product } from "../types/ProductTypes";
import { useDeleteVariant } from "../productFeatures/useDeleteVariant";
import { Modal } from "../ui/Modal";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { GiRolledCloth } from "react-icons/gi";
import { useDeleteProduct } from "../productFeatures/useDeleteProduct";

interface DrawerProps {
  selectedProduct: Product;
  onClose: () => void;
}

export function ProductDetailDrawer({ selectedProduct, onClose }: DrawerProps) {
  const { mutate: deleteVariant, isPending: isVariantPending } =
    useDeleteVariant();
  const { isDeleting: isProductDeleting, deleteProduct: mutateDeleteProduct } =
    useDeleteProduct();

  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [variantToDelete, setVariantToDelete] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<"variant" | "product" | null>(
    null
  );

  // LOCAL STATE FOR INSTANT UI UPDATE
  const [localImages, setLocalImages] = useState(
    selectedProduct.product_images || []
  );

  useEffect(() => {
    setLocalImages(selectedProduct.product_images || []);
  }, [selectedProduct]);

  // 1. Logic for unique color variants
  const colorVariants = useMemo(() => {
    const map = new Map<string, any>();

    localImages.forEach((img) => {
      const keyName = img.color_name || img.color_hex || "default-color";
      if (!map.has(keyName)) map.set(keyName, img);
    });

    return Array.from(map.values());
  }, [localImages]);

  const activeColor =
    selectedColor ||
    getMainImage({
      ...selectedProduct,
      product_images: localImages,
    })?.color_name ||
    colorVariants[0]?.color_name ||
    "";

  const displayImages = useMemo(() => {
    return localImages.filter((img) => (img.color_name || "") === activeColor);
  }, [activeColor, localImages]);

  const preview = displayImages[0]?.image_url;

  const handleDeleteClick = (colorName: string) => {
    setVariantToDelete(colorName || "Unknown Color");
    setDeleteMode(colorVariants.length === 1 ? "product" : "variant");
  };

  const confirmDelete = () => {
    if (!variantToDelete || !selectedProduct.id) return;

    if (deleteMode === "variant") {
      deleteVariant(
        { product_id: selectedProduct.id, color_name: variantToDelete },
        {
          onSuccess: () => {
            const updatedImages = localImages.filter(
              (img) => img.color_name !== variantToDelete
            );

            setLocalImages(updatedImages);

            if (selectedColor === variantToDelete) {
              setSelectedColor(updatedImages[0]?.color_name);
            }

            setVariantToDelete(null);
            setDeleteMode(null);
          },
        }
      );
    } else {
      // Execute global mutation function cleanly with success callbacks
      mutateDeleteProduct(selectedProduct.id, {
        onSuccess: () => {
          setVariantToDelete(null);
          setDeleteMode(null);
          onClose(); // Safe unmount triggered exclusively upon completed database removal
        },
      });
    }
  };

  const finalPrice =
    selectedProduct.regularPrice - (selectedProduct.discount || 0);
  const isAnyMutationPending = isVariantPending || isProductDeleting;

  return (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 backdrop-blur-md z-[60]"
      />

      {/* DRAWER */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white z-[70] shadow-2xl flex flex-col"
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between w-full items-center bg-white sm:sticky fixed top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Product Details
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Inventory Management
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 mt-17 sm:mt-0 overflow-y-auto overflow-x-hidden p-6 space-y-8">
          {/* IMAGE */}
          <section>
            <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100 group">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover transition-transform duration-500 "
                  alt={selectedProduct.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <ShoppingBag className="w-12 h-12 mb-2" />
                  <span className="text-sm">No image available</span>
                </div>
              )}

              {selectedProduct.isNewArrival && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-amber-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-700 uppercase">
                    New Arrival
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* INFO */}
          <section className="space-y-2">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-2xl font-extrabold text-slate-900 leading-tight flex-1">
                {selectedProduct.name}
              </h3>

              <div className="flex flex-col items-end">
                <p className="text-xl font-bold text-indigo-600">
                  {formatCurrency(finalPrice)}
                </p>

                {selectedProduct.discount > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-400 line-through">
                      {formatCurrency(selectedProduct.regularPrice)}
                    </span>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">
                      -
                      {Math.round(
                        (selectedProduct.discount /
                          selectedProduct.regularPrice) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <LiaShoePrintsSolid className="w-4 h-4" />
                {selectedProduct.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1">
                <GiRolledCloth className="w-4 h-4" />
                {selectedProduct.material}
              </span>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Description
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              {selectedProduct.description}
            </p>
          </section>

          {/* VARIANTS */}
          <section className="pb-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Available Variants
              </h4>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                {colorVariants.length}{" "}
                {colorVariants.length > 1 ? "Colors" : "Color"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {colorVariants.map((v, i) => {
                const itemKey = `variant-color-${
                  v.id || v.color_hex || "color"
                }-${i}`;
                const isItemActive = activeColor === v.color_name;

                return (
                  <div
                    key={itemKey}
                    className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isItemActive
                        ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedColor(v.color_name)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-black/5 shadow-inner"
                        style={{ backgroundColor: v.color_hex || "#e2e8f0" }}
                      />
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">
                          {v.color_name || "Standard Variant"}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase">
                          {v.color_hex || "No hex"}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(v.color_name)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </motion.div>

      {/* CONFIRMATION DIALOG MODAL */}
      <Modal
        isOpen={!!variantToDelete}
        onClose={() => {
          if (!isAnyMutationPending) {
            setVariantToDelete(null);
            setDeleteMode(null);
          }
        }}
        title={deleteMode === "product" ? "Delete Product?" : "Remove Variant?"}
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-slate-600 leading-relaxed">
            {deleteMode === "product"
              ? "Warning: This is the last variant. Deleting it will remove the entire product."
              : `Are you sure you want to remove the ${variantToDelete} variant?`}
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={isAnyMutationPending}
              onClick={() => {
                setVariantToDelete(null);
                setDeleteMode(null);
              }}
              className="flex-1 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              disabled={isAnyMutationPending}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50"
            >
              {isAnyMutationPending ? "Processing..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

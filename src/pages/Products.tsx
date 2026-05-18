// import React, { useState } from "react";
// import { Plus, Edit2, Trash2, ShoppingBag, Sparkles, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useGetProducts } from "../productFeatures/useGetProducts";

// export type Category = "clogs" | "sandals" | "slides";
// export type Material = "suede" | "leather";

// export interface ProductImage {
//   id: string;
//   product_id: string;
//   image_url: string;
//   color_name: string;
//   color_hex: string;
//   is_main: boolean;
//   created_at: string;
// }

// export interface Product {
//   id?: string;
//   name: string;
//   description: string;
//   regularPrice: number;
//   discount: number;
//   isNewArrival: boolean;
//   category: Category;
//   material: Material;
//   sizes?: number[];
//   product_images?: ProductImage[]; // Added nested relationship
//   created_at?: string;
// }

// export function Products() {
//   const [showForm, setShowForm] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const { isLoading, products, error } = useGetProducts();

//   // console.log(products[0].product_images[0].image_url);

//   // products[0].product_images[0].image_url

//   const deleteProduct = (id: string | number) => {
//     confirm(`Are you sure you want to delete product ${id}?`);
//   };

//   return (
//     <div className="relative flex flex-col gap-6 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-slate-800 tracking-tight">
//             Boston Club Catalog
//           </h1>
//           <p className="text-sm text-slate-500">
//             Manage your premium footwear collection and variants
//           </p>
//         </div>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-sm font-medium"
//         >
//           {showForm ? (
//             "Cancel"
//           ) : (
//             <>
//               <Plus className="w-4 h-4" /> New Product
//             </>
//           )}
//         </button>
//       </div>

//       {/* Form Section */}
//       {showForm && (
//         <motion.form
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 gap-4 sm:grid-cols-3"
//         >
//           <div className="sm:col-span-2">
//             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//               Product Name
//             </label>
//             <input
//               type="text"
//               className="w-full border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="e.g. Boston Suede Clog"
//             />
//           </div>
//           <div>
//             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//               Base Price
//             </label>
//             <input
//               type="number"
//               className="w-full border-slate-200 rounded-lg text-sm"
//               placeholder="120"
//             />
//           </div>
//         </motion.form>
//       )}

//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm whitespace-nowrap">
//             <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
//               <tr>
//                 <th className="px-6 py-4">Preview</th>
//                 <th className="px-6 py-4">Product Details</th>
//                 <th className="px-6 py-4">Category</th>
//                 <th className="px-6 py-4">Material</th>
//                 <th className="px-6 py-4">Price</th>
//                 {/* <th className="px-6 py-4">Status</th> */}
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {/* Using your Product interface fields here */}
//               {(products || []).map((product: Product) => (
//                 <motion.tr
//                   key={product.id}
//                   onClick={() => setSelectedProduct(product)}
//                   className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
//                 >
//                   <td className="px-6 py-4">
//                     <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-300 overflow-hidden">
//                       {/* Optional chaining (?.) ensures the app doesn't crash if the array is empty */}
//                       {product.product_images?.[0]?.image_url ? (
//                         <img
//                           src={product.product_images[0].image_url}
//                           alt={product.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <ShoppingBag className="w-5 h-5" />
//                       )}
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
//                         {product.name}
//                       </span>
//                       <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
//                         {product.description}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
//                       {product.category}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className="text-slate-600 font-medium capitalize">
//                       {product.material}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="font-bold text-slate-900">
//                         ${product.regularPrice}
//                       </span>
//                       {product.discount > 0 && (
//                         <span className="text-[10px] text-rose-500">
//                           -{product.discount}% off
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   {/* <td className="px-6 py-4">
//                     {product.isNewArrival ? (
//                       <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
//                         <Sparkles className="w-3 h-3" /> New
//                       </span>
//                     ) : (
//                       <span className="text-slate-400 text-[10px] font-bold uppercase">
//                         Standard
//                       </span>
//                     )}
//                   </td> */}
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex items-center justify-end gap-1">
//                       <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => product.id && deleteProduct(product.id)}
//                         className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//           {(!products || products.length === 0) && (
//             <div className="py-20 text-center">
//               <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
//               <p className="text-slate-400 text-sm">
//                 No products found in the catalog.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Table Section */}
//       {/* <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm whitespace-nowrap">
//             <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
//               <tr>
//                 <th className="px-6 py-4">Preview</th>
//                 <th className="px-6 py-4">Product Details</th>
//                 <th className="px-6 py-4">Category</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {(products || []).map((product: Product) => (
//                 <motion.tr
//                   key={product.id}
//                   onClick={() => setSelectedProduct(product)}
//                   className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
//                 >
//                   <td className="px-6 py-4">
//                     <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-300">
//                       <ShoppingBag className="w-5 h-5" />
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
//                         {product.name}
//                       </span>
//                       <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
//                         {product.description}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
//                       {product.category}
//                     </span>
//                   </td>
//                   <td
//                     className="px-6 py-4 text-right"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <div className="flex items-center justify-end gap-1">
//                       <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => product.id && deleteProduct(product.id)}
//                         className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div> */}

//       {/* --- SIDE DRAWER MODAL --- */}
//       <AnimatePresence>
//         {selectedProduct && (
//           <>
//             {/* Overlay */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setSelectedProduct(null)}
//               className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
//             />
//             {/* Drawer */}
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
//             >
//               <div className="p-6 flex items-center justify-between border-b border-slate-100">
//                 <h2 className="font-bold text-slate-800 uppercase tracking-tight">
//                   Product Preview
//                 </h2>
//                 <button
//                   onClick={() => setSelectedProduct(null)}
//                   className="p-2 hover:bg-slate-100 rounded-full transition-colors"
//                 >
//                   <X className="w-5 h-5 text-slate-500" />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-8">
//                 <div className="aspect-square w-full bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-300 mb-6">
//                   <ShoppingBag className="w-12 h-12 mb-2" />
//                   <p className="text-[10px] font-bold uppercase tracking-widest">
//                     Image Placeholder
//                   </p>
//                 </div>

//                 <div className="space-y-6">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <h3 className="text-2xl font-bold text-slate-900">
//                         {selectedProduct.name}
//                       </h3>
//                       {selectedProduct.isNewArrival && (
//                         <Sparkles className="w-5 h-5 text-amber-500" />
//                       )}
//                     </div>
//                     <p className="text-slate-500 text-sm leading-relaxed">
//                       {selectedProduct.description}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//                       <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
//                         Material
//                       </span>
//                       <span className="font-semibold text-slate-700 capitalize">
//                         {selectedProduct.material}
//                       </span>
//                     </div>
//                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//                       <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
//                         Price
//                       </span>
//                       <span className="font-semibold text-slate-700">
//                         ${selectedProduct.regularPrice}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6 border-t border-slate-100 flex gap-3">
//                 <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
//                   Edit Details
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Plus, Edit2, Trash2, ShoppingBag, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts } from "../productFeatures/useGetProducts";

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
  id?: string;
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

export function Products() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isLoading, products, error } = useGetProducts();

  const deleteProduct = (id: string | number) => {
    confirm(`Are you sure you want to delete product ${id}?`);
  };

  // Helper logic to find the specific main image or fallback to the first index
  const getMainImage = (product: Product) => {
    if (!product.product_images || product.product_images.length === 0)
      return null;
    return (
      product.product_images.find((img) => img.is_main) ||
      product.product_images[0]
    );
  };

  return (
    <div className="relative flex flex-col gap-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Boston Club Catalog
          </h1>
          <p className="text-sm text-slate-500">
            Manage your premium footwear collection and variants
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-sm font-medium"
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-4 h-4" /> New Product
            </>
          )}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Boston Suede Clog"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Base Price
            </label>
            <input
              type="number"
              className="w-full border-slate-200 rounded-lg text-sm"
              placeholder="120"
            />
          </div>
        </motion.form>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(products || []).map((product: Product) => {
                const mainImage = getMainImage(product);
                return (
                  <motion.tr
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
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
                      <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium capitalize">
                      {product.material}
                    </td>
                    {/* <td className="px-6 py-4 font-bold text-slate-900">
                      ${product.regularPrice}
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">
                          ₦{product.regularPrice}
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
                          onClick={() =>
                            product.id && deleteProduct(product.id)
                          }
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {(!products || products.length === 0) && !isLoading && (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">
                No products found in the catalog.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- SIDE DRAWER MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
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
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="aspect-square w-full bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-300 mb-6 overflow-hidden">
                  {getMainImage(selectedProduct)?.image_url ? (
                    <img
                      src={getMainImage(selectedProduct)?.image_url}
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
                        ${selectedProduct.regularPrice}
                      </span>
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
        )}
      </AnimatePresence>
    </div>
  );
}

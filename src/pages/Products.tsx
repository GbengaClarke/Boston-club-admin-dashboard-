// import { useState } from "react";
// import { Plus, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useGetProducts } from "../productFeatures/useGetProducts";

// import { Product } from "../types/ProductTypes";
// import { ProductRow } from "../components/ProductRow";
// import { ProductDetailDrawer } from "../components/ProductDetailDrawer";
// import toast from "react-hot-toast";
// import { useDeleteProduct } from "../productFeatures/useDeleteProduct";
// import { Modal } from "../ui/Modal";

// const PAGE_SIZE = 10; // Adjust this number as needed

// export function Products() {
//   const [showForm, setShowForm] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<Product | null>(null);

//   const { isLoading, products = [], error } = useGetProducts();
//   const { isDeleting, deleteProduct: deleteMutation } = useDeleteProduct();

//   // --- Pagination Logic ---
//   const totalProducts = products.length;
//   const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

//   // Calculate which products to show on current page
//   const startIndex = (currentPage - 1) * PAGE_SIZE;
//   const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//     // Optional: Scroll to top of table when page changes
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const deleteProduct = (product: Product) => {
//     setProductToDelete(product);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (!productToDelete?.id) return;

//     deleteMutation(productToDelete.id, {
//       onSuccess: () => {
//         toast.success("Product successfully deleted");
//         setIsDeleteModalOpen(false);
//         setProductToDelete(null);
//         // Reset to page 1 if the current page becomes empty
//         if (paginatedProducts.length === 1 && currentPage > 1) {
//           setCurrentPage((prev) => prev - 1);
//         }
//       },
//       onError: (err: any) => {
//         toast.error(err.message || "Could not delete product");
//       },
//     });
//   };

//   return (
//     <div className="relative flex flex-col gap-6 min-h-screen">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-slate-800 tracking-tight">
//             Boston Club Catalog
//           </h1>
//           <p className="text-sm text-slate-500">
//             Manage your premium footwear collection ({totalProducts} items)
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
//               className="w-full border-slate-200 rounded-lg text-sm"
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

//       {/* Table Section */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm whitespace-nowrap">
//             <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
//               <tr>
//                 <th className="px-6 py-4">Preview</th>
//                 <th className="px-6 py-4">Product Details</th>
//                 <th className="px-6 py-4">Category</th>
//                 <th className="px-6 py-4">Material</th>
//                 <th className="px-6 py-4">Price</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {paginatedProducts.map((product: Product) => (
//                 <ProductRow
//                   key={product.id}
//                   product={product}
//                   onSelect={setSelectedProduct}
//                   onDelete={() => deleteProduct(product)}
//                   disabled={isDeleting}
//                 />
//               ))}
//             </tbody>
//           </table>

//           {totalProducts === 0 && !isLoading && (
//             <div className="py-20 text-center">
//               <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
//               <p className="text-slate-400 text-sm">
//                 No products found in the catalog.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* --- Pagination Footer --- */}
//         {totalPages > 1 && (
//           <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
//             <p className="text-xs text-slate-500">
//               Showing{" "}
//               <span className="font-medium text-slate-700">
//                 {startIndex + 1}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium text-slate-700">
//                 {Math.min(startIndex + PAGE_SIZE, totalProducts)}
//               </span>{" "}
//               of{" "}
//               <span className="font-medium text-slate-700">
//                 {totalProducts}
//               </span>{" "}
//               products
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronLeft className="w-4 h-4 text-slate-600" />
//               </button>

//               <div className="flex items-center gap-1">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (page) => (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
//                         currentPage === page
//                           ? "bg-indigo-600 text-white"
//                           : "text-slate-600 hover:bg-slate-200"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}
//               </div>

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronRight className="w-4 h-4 text-slate-600" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals & Drawers */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
//         title="Delete Product"
//       >
//         <div className="flex flex-col gap-5">
//           <p className="text-sm text-slate-600 leading-relaxed">
//             Are you sure you want to delete{" "}
//             <span className="font-semibold text-slate-900">
//               {productToDelete?.name}
//             </span>
//             ? This action cannot be undone.
//           </p>
//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => setIsDeleteModalOpen(false)}
//               className="px-4 py-2 text-sm font-semibold text-slate-600"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleConfirmDelete}
//               className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold"
//             >
//               {isDeleting ? "Deleting..." : "Confirm Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <AnimatePresence>
//         {selectedProduct && (
//           <ProductDetailDrawer
//             selectedProduct={selectedProduct}
//             onClose={() => setSelectedProduct(null)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts } from "../productFeatures/useGetProducts";
import { Product } from "../types/ProductTypes";
import { ProductRow } from "../components/ProductRow";
import { ProductDetailDrawer } from "../components/ProductDetailDrawer";
import toast from "react-hot-toast";
import { useDeleteProduct } from "../productFeatures/useDeleteProduct";
import { Modal } from "../ui/Modal";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 10;

export function Products() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { isLoading, products = [] } = useGetProducts();
  const { isDeleting, deleteProduct: deleteMutation } = useDeleteProduct();

  const totalProducts = products.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete?.id) return;

    deleteMutation(productToDelete.id, {
      onSuccess: () => {
        toast.success("Product successfully deleted");
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        if (paginatedProducts.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      },
      onError: (err: any) => {
        toast.error(err.message || "Could not delete product");
      },
    });
  };

  return (
    <div className="relative flex flex-col gap-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Boston Club Catalog
          </h1>
          <p className="text-sm text-slate-500">
            Manage your premium footwear collection ({totalProducts} items)
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
              className="w-full border-slate-200 rounded-lg text-sm"
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
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
              {paginatedProducts.map((product: Product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                  onDelete={() => deleteProduct(product)}
                  disabled={isDeleting}
                />
              ))}
            </tbody>
          </table>

          {totalProducts === 0 && !isLoading && (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">
                No products found in the catalog.
              </p>
            </div>
          )}
        </div>

        <Pagination
          totalItems={totalProducts}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Delete Product"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {productToDelete?.name}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailDrawer
            selectedProduct={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

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
import AddProductForm from "../productFeatures/AddProductForm";
import AddVariantForm from "../productFeatures/AddVariantForm";

const PAGE_SIZE = 10;

export function Products() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
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

  // --- HANDLERS ---
  const handleOpenDrawer = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOpenAddVariant = (product: Product) => {
    setVariantProduct(product);
    setIsVariantModalOpen(true);
  };

  return (
    <div className="relative flex flex-col gap-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Boston Club Catalog
          </h1>
          <p className="text-sm text-slate-500">
            Manage your premium footwear collection{" "}
            <span className="font-bold">
              {totalProducts ? `(${totalProducts} items)` : ""}
            </span>
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

      {showForm && <AddProductForm setShowForm={setShowForm} />}

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
                  onDelete={() => deleteProduct(product)}
                  disabled={isDeleting}
                  // onSelect={setSelectedProduct}
                  // onAddVariant={(product) => {
                  //   setSelectedProduct(product);
                  //   setIsVariantModalOpen(true);
                  // }}

                  onSelect={handleOpenDrawer}
                  onAddVariant={handleOpenAddVariant}
                />
              ))}
            </tbody>

            {/* <Modal
              isOpen={isVariantModalOpen}
              onClose={() => setIsVariantModalOpen(false)}
              title={`Add Variant - ${selectedProduct?.name}`}
            >
              <AddVariantForm
                product={selectedProduct}
                onClose={() => setIsVariantModalOpen(false)}
              />
            </Modal> */}

            {/* RENDER ADD VARIANT MODAL */}
            <Modal
              isOpen={isVariantModalOpen}
              onClose={() => {
                setIsVariantModalOpen(false);
                setVariantProduct(null);
              }}
              title={`Add Variant for ${variantProduct?.name || ""}`}
            >
              {variantProduct && (
                <AddVariantForm
                  product={variantProduct}
                  onClose={() => {
                    setIsVariantModalOpen(false);
                    setVariantProduct(null);
                  }}
                />
              )}
            </Modal>
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

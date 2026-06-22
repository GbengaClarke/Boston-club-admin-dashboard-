import { useState, useMemo, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { MdOutlineDeleteForever } from "react-icons/md";
import {
  X,
  ShoppingBag,
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getMainImage, formatCurrency } from "../lib/utils";
import { Product, ProductImage } from "../types/ProductTypes";
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
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [localImages, setLocalImages] = useState<ProductImage[]>(
    selectedProduct.product_images || []
  );

  useEffect(() => {
    setLocalImages(selectedProduct.product_images || []);
  }, [selectedProduct]);

  // Typed the unique variants map precisely
  const colorVariants = useMemo(() => {
    const map = new Map<string, ProductImage>();
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

  useEffect(() => {
    setCurrentImgIndex(0);
  }, [activeColor]);

  const nextImage = () => {
    if (displayImages.length <= 1) return;
    setCurrentImgIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    if (displayImages.length <= 1) return;
    setCurrentImgIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextImage();
    } else if (info.offset.x > swipeThreshold) {
      prevImage();
    }
  };

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
      mutateDeleteProduct(selectedProduct.id, {
        onSuccess: () => {
          setVariantToDelete(null);
          setDeleteMode(null);
          onClose();
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
      />

      {/* DRAWER */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white z-[70] shadow-2xl flex flex-col"
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between w-full items-center bg-white sm:sticky fixed top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Product Details
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
              Inventory Management
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 mt-20 sm:mt-0 overflow-y-auto overflow-x-hidden p-6 space-y-8">
          {/* CAROUSEL IMAGE STAGE */}
          <section>
            <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-200 group touch-pan-y">
              {displayImages.length > 0 ? (
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                  <motion.div
                    key={`${activeColor}-${currentImgIndex}`}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.4 }}
                    transition={{ duration: 0.2 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={handleDragEnd}
                    className="w-full h-full cursor-grab active:cursor-grabbing absolute top-0 left-0"
                  >
                    <img
                      src={displayImages[currentImgIndex]?.image_url}
                      className="w-full h-full object-cover pointer-events-none"
                      alt={`${selectedProduct.name} ${activeColor}`}
                    />
                  </motion.div>

                  {displayImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-3 p-2 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-800 hover:bg-slate-50 transition-opacity md:opacity-0 md:group-hover:opacity-100 z-10"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-3 p-2 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-800 hover:bg-slate-50 transition-opacity md:opacity-0 md:group-hover:opacity-100 z-10"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* DOT INDICATORS CONTRAST FIX */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-full z-10 border border-white/10">
                        {displayImages.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={() => setCurrentImgIndex(dotIdx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              dotIdx === currentImgIndex
                                ? "w-4 bg-white"
                                : "w-1.5 bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <ShoppingBag className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">
                    No image available
                  </span>
                </div>
              )}

              {selectedProduct.isNewArrival && (
                <div className="absolute top-4 left-4 bg-amber-50 px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-amber-200 z-10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    New Arrival
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* INFO */}
          <section className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-2xl font-black text-slate-950 leading-tight flex-1">
                {selectedProduct.name}
              </h3>
              <div className="flex flex-col items-end shrink-0">
                <p className="text-2xl font-black text-indigo-700">
                  {formatCurrency(finalPrice)}
                </p>
                {selectedProduct.discount > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-slate-500 line-through">
                      {formatCurrency(selectedProduct.regularPrice)}
                    </span>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md">
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

            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <LiaShoePrintsSolid className="w-4 h-4 text-slate-500" />
                {selectedProduct.category}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5">
                <GiRolledCloth className="w-4 h-4 text-slate-500" />
                {selectedProduct.material}
              </span>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2.5">
              Description
            </h4>
            <p className="text-slate-700 leading-relaxed text-sm font-normal">
              {selectedProduct.description}
            </p>
          </section>

          {/* VARIANTS */}
          <section className="pb-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Available Variants
              </h4>
              <span className="text-xs bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-700 font-bold">
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
                        ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedColor(v.color_name)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-slate-300 shadow-inner shrink-0"
                        style={{ backgroundColor: v.color_hex || "#e2e8f0" }}
                      />
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-900">
                          {v.color_name || "Standard Variant"}
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 tracking-wide">
                          {v.color_hex || "No hex"}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(v.color_name || "")}
                      className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                      aria-label={`Archive variant ${v.color_name}`}
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

      {/* REFACTORED ARCHIVE / DELETION DIALOG MODAL */}
      <Modal
        isOpen={!!variantToDelete}
        onClose={() => {
          if (!isAnyMutationPending) {
            setVariantToDelete(null);
            setDeleteMode(null);
          }
        }}
        title={deleteMode === "product" ? "Archive Product" : "Remove Variant"}
      >
        <div className="flex flex-col gap-3 ">
          <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-sm">
            <MdOutlineDeleteForever className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {deleteMode === "product" ? (
                <>
                  This is the last remaining variant. Deleting it will remove
                  the entire product.
                </>
              ) : (
                <>
                  Are you sure you want to remove the variant configuration for{" "}
                  <span className="font-bold text-slate-950">
                    {variantToDelete}
                  </span>
                  ?
                </>
              )}
            </p>
          </div>

          <div className="flex justify-end items-center gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={isAnyMutationPending}
              onClick={() => {
                setVariantToDelete(null);
                setDeleteMode(null);
              }}
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              disabled={isAnyMutationPending}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed min-w-[130px]"
            >
              {isAnyMutationPending ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

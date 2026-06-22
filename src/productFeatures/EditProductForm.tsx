import { useState, useMemo, useEffect, useRef } from "react";
import { Product, Category, Material } from "../types/ProductTypes";
import { useEditProduct } from "./useEditProduct";
import { Upload, X, RefreshCw, PlusSquare, Loader2 } from "lucide-react";

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
}

interface VariantState {
  color_name: string;
  color_hex: string;
  mode: "keep" | "overwrite" | "append";
  newFiles: File[];
  previews: string[];
}

export default function EditProductForm({
  product,
  onClose,
}: EditProductFormProps) {
  const { editProduct, isEditing } = useEditProduct();

  // Track all generated Object URLs in a mutable ref to guarantee zero memory leaks on unmount
  const activePreviewsRef = useRef<string[]>([]);

  // Core Product details state fields
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [regularPrice, setRegularPrice] = useState(product.regularPrice);
  const [discount, setDiscount] = useState(product.discount);
  const [isNewArrival, setIsNewArrival] = useState(product.isNewArrival);

  const [category, setCategory] = useState<Category>(product.category);
  const [material, setMaterial] = useState<Material>(product.material);

  // Parse variations using map from loaded data arrays
  const initialVariants = useMemo(() => {
    const map = new Map<string, { color_name: string; color_hex: string }>();
    product.product_images?.forEach((img) => {
      if (img.color_name) {
        map.set(img.color_name, {
          color_name: img.color_name,
          color_hex: img.color_hex,
        });
      }
    });

    return Array.from(map.values()).map((v) => ({
      color_name: v.color_name,
      color_hex: v.color_hex,
      mode: "keep" as const,
      newFiles: [],
      previews: [],
    }));
  }, [product]);

  const [variants, setVariants] = useState<VariantState[]>(initialVariants);

  // Clean up all active object URLs when form finishes lifecycle or closes unexpectedly
  useEffect(() => {
    return () => {
      activePreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (index: number, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);

    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;

        // Revoke current variations image pointers being replaced
        v.previews.forEach((p) => {
          URL.revokeObjectURL(p);
          activePreviewsRef.current = activePreviewsRef.current.filter(
            (url) => url !== p
          );
        });

        const newUrls = fileArray.map((file) => {
          const url = URL.createObjectURL(file);
          activePreviewsRef.current.push(url);
          return url;
        });

        return {
          ...v,
          newFiles: fileArray,
          previews: newUrls,
          mode: v.mode === "keep" ? "append" : v.mode,
        };
      })
    );
  };

  const handleToggleMode = (index: number, mode: "overwrite" | "append") => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, mode } : v))
    );
  };

  const clearVariantFiles = (index: number) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;
        v.previews.forEach((p) => {
          URL.revokeObjectURL(p);
          activePreviewsRef.current = activePreviewsRef.current.filter(
            (url) => url !== p
          );
        });
        return { ...v, newFiles: [], previews: [], mode: "keep" };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || regularPrice <= 0) return;

    editProduct(
      {
        productId: product.id,
        name,
        description,
        regularPrice,
        discount,
        isNewArrival,
        category,
        material,
        variantConfigurations: variants.map((v) => ({
          color_name: v.color_name,
          color_hex: v.color_hex,
          mode: v.mode,
          newFiles: v.newFiles,
        })),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 text-slate-800 max-w-2xl mx-auto bg-white p-1"
    >
      {/* FIELDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-product-name"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Product Name
          </label>
          <input
            id="edit-product-name"
            type="text"
            required
            disabled={isEditing}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white font-medium outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-product-category"
              className="text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Category
            </label>
            <select
              id="edit-product-category"
              value={category}
              disabled={isEditing}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium bg-white outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="clogs">Clogs</option>
              <option value="sandals">Sandals</option>
              <option value="slides">Slides</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-product-material"
              className="text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Material
            </label>
            <select
              id="edit-product-material"
              value={material}
              disabled={isEditing}
              onChange={(e) => setMaterial(e.target.value as Material)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium bg-white outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="suede">Suede</option>
              <option value="leather">Leather</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="edit-product-desc"
          className="text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          Description
        </label>
        <textarea
          id="edit-product-desc"
          rows={3}
          disabled={isEditing}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white font-medium resize-none outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-product-price"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Regular Price
          </label>
          <input
            id="edit-product-price"
            type="number"
            min={0}
            required
            disabled={isEditing}
            value={regularPrice || ""}
            onChange={(e) => setRegularPrice(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-product-discount"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Discount Price
          </label>
          <input
            id="edit-product-discount"
            type="number"
            min={0}
            disabled={isEditing}
            value={discount || ""}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center gap-3 h-full pt-6">
          <input
            type="checkbox"
            id="editNewArrival"
            disabled={isEditing}
            checked={isNewArrival}
            onChange={(e) => setIsNewArrival(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:opacity-50 h-5 w-5 cursor-pointer"
          />
          <label
            htmlFor="editNewArrival"
            className="text-xs font-bold text-slate-700 uppercase select-none tracking-wide cursor-pointer"
          >
            Mark as New Arrival
          </label>
        </div>
      </div>

      {/* DYNAMIC VARIANT IMAGES MANAGEMENT STRIP */}
      <div className="border-t border-slate-200 pt-5 mt-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Manage Variant Media Layers
        </h4>

        <div className="flex flex-col gap-5">
          {variants.map((v, index) => {
            const variantImagesCount =
              product.product_images?.filter(
                (img) => img.color_name === v.color_name
              ).length || 0;

            return (
              <div
                key={v.color_name}
                className="p-5 rounded-2xl border border-slate-300 bg-slate-50 flex flex-col gap-4 shadow-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full border border-slate-400 shadow-sm shrink-0"
                      style={{ backgroundColor: v.color_hex }}
                    />
                    <span className="text-sm font-bold text-slate-900 capitalize">
                      {v.color_name}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      ({variantImagesCount} current assets)
                    </span>
                  </div>

                  {/* OVERWRITE / APPEND TARGET TOGGLE CHIPS */}
                  {v.newFiles.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 p-1 rounded-xl shadow-sm">
                      <button
                        type="button"
                        disabled={isEditing}
                        onClick={() => handleToggleMode(index, "append")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                          v.mode === "append"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <PlusSquare className="w-3.5 h-3.5" /> Append
                      </button>
                      <button
                        type="button"
                        disabled={isEditing}
                        onClick={() => handleToggleMode(index, "overwrite")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                          v.mode === "overwrite"
                            ? "bg-rose-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Overwrite
                      </button>
                    </div>
                  )}
                </div>

                {/* IMAGES DROPZONE / LIST VIEW */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {v.previews.map((src, pIdx) => (
                    <div
                      key={pIdx}
                      className="aspect-square bg-white border border-slate-300 rounded-xl overflow-hidden relative shadow-sm"
                    >
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt={`${v.color_name} variant display preview ${
                          pIdx + 1
                        }`}
                      />
                    </div>
                  ))}

                  <label className="aspect-square bg-white hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer flex flex-col items-center justify-center text-slate-600 transition-colors relative disabled:opacity-50">
                    <Upload className="w-5 h-5 text-slate-700 mb-1" />
                    <span className="text-[10px] font-bold uppercase text-slate-700 tracking-wide">
                      Upload
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isEditing}
                      className="hidden"
                      onChange={(e) => handleFileChange(index, e.target.files)}
                    />
                  </label>

                  {v.newFiles.length > 0 && (
                    <button
                      type="button"
                      disabled={isEditing}
                      onClick={() => clearVariantFiles(index)}
                      className="aspect-square bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-300 hover:border-rose-300 rounded-xl transition-colors flex flex-col items-center justify-center text-xs font-bold"
                    >
                      <X className="w-5 h-5 mb-1 text-slate-600 group-hover:text-rose-600" />
                      <span className="text-[10px] font-bold uppercase tracking-wide">
                        Clear
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM ACTIONS */}
      <div className="flex gap-4 pt-4 border-t border-slate-200 mt-2">
        <button
          type="button"
          disabled={isEditing}
          onClick={onClose}
          className="flex-1 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isEditing}
          className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isEditing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Product Details"
          )}
        </button>
      </div>
    </form>
  );
}

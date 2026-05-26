import { useState, useMemo } from "react";
import { Product, Category, Material } from "../types/ProductTypes";
import { useEditProduct } from "./useEditProduct";
import { Upload, X, RefreshCw, PlusSquare } from "lucide-react";

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

  // Core Product details state fields
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [regularPrice, setRegularPrice] = useState(product.regularPrice);
  const [discount, setDiscount] = useState(product.discount);
  const [isNewArrival, setIsNewArrival] = useState(product.isNewArrival);

  // Explicitly type your select state setters to align with ProductTypes
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

  const handleFileChange = (index: number, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);

    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;

        v.previews.forEach((p) => URL.revokeObjectURL(p));
        const newUrls = fileArray.map((file) => URL.createObjectURL(file));

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
        v.previews.forEach((p) => URL.revokeObjectURL(p));
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
      className="flex flex-col gap-5 text-slate-700 max-w-2xl mx-auto"
    >
      {/* FIELDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Product Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-600 text-sm font-medium transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Category
            </label>
            <select
              value={category}
              // Cast string targets safely to your strict type definitions
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-600 text-sm font-medium bg-white"
            >
              <option value="clogs">Clogs</option>
              <option value="sandals">Sandals</option>
              <option value="slides">Slides</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Material
            </label>
            <select
              value={material}
              // Cast string targets safely to your strict type definitions
              onChange={(e) => setMaterial(e.target.value as Material)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-600 text-sm font-medium bg-white"
            >
              <option value="suede">Suede</option>
              <option value="leather">Leather</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-600 text-sm font-medium resize-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Regular Price
          </label>
          <input
            type="number"
            min={0}
            required
            value={regularPrice}
            onChange={(e) => setRegularPrice(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-600 text-sm font-medium"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Discount Price
          </label>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-600 text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 h-full pt-5">
          <input
            type="checkbox"
            id="editNewArrival"
            checked={isNewArrival}
            onChange={(e) => setIsNewArrival(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="editNewArrival"
            className="text-xs font-bold text-slate-600 uppercase select-none tracking-wide"
          >
            Mark as New Arrival
          </label>
        </div>
      </div>

      {/* DYNAMIC VARIANT IMAGES MANAGEMENT STRIP */}
      <div className="border-t border-slate-100 pt-4 mt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Manage Variant Media Layers
        </h4>

        <div className="flex flex-col gap-4">
          {variants.map((v, index) => {
            const variantImagesCount =
              product.product_images?.filter(
                (img) => img.color_name === v.color_name
              ).length || 0;

            return (
              <div
                key={v.color_name}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: v.color_hex }}
                    />
                    <span className="text-sm font-bold text-slate-800 capitalize">
                      {v.color_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({variantImagesCount} current assets)
                    </span>
                  </div>

                  {/* OVERWRITE / APPEND TARGET TOGGLE CHIPS */}
                  {v.newFiles.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleToggleMode(index, "append")}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase rounded-md transition-all ${
                          v.mode === "append"
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                            : "text-slate-400 hover:text-slate-600 border border-transparent"
                        }`}
                      >
                        <PlusSquare className="w-3.5 h-3.5" /> Append
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleMode(index, "overwrite")}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase rounded-md transition-all ${
                          v.mode === "overwrite"
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "text-slate-400 hover:text-slate-600 border border-transparent"
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Overwrite
                      </button>
                    </div>
                  )}
                </div>

                {/* IMAGES DROPZONE / LIST VIEW */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {v.previews.map((src, pIdx) => (
                    <div
                      key={pIdx}
                      className="aspect-square bg-slate-100 border border-slate-200 rounded-lg overflow-hidden relative group"
                    >
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt="Preview item"
                      />
                    </div>
                  ))}

                  <label className="aspect-square bg-white hover:bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer flex flex-col items-center justify-center text-slate-400 transition-colors relative">
                    <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
                    <span className="text-[9px] font-bold uppercase text-slate-400">
                      Upload
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(index, e.target.files)}
                    />
                  </label>

                  {v.newFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => clearVariantFiles(index)}
                      className="aspect-square bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors flex flex-col items-center justify-center text-xs font-medium"
                    >
                      <X className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-bold uppercase">
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
      <div className="flex gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          disabled={isEditing}
          onClick={onClose}
          className="flex-1 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isEditing}
          className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isEditing ? "Saving Changes..." : "Save Product Details"}
        </button>
      </div>
    </form>
  );
}

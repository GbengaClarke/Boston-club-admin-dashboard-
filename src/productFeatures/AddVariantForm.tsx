import { useState, useEffect } from "react";
import { ImagePlus, Trash2, Loader2, Palette } from "lucide-react";
import { Product } from "../types/ProductTypes";
import { useAddVariant } from "./useAddVariant";

interface AddVariantFormProps {
  product: Product;
  onClose: () => void;
}

export default function AddVariantForm({
  product,
  onClose,
}: AddVariantFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#8B5A2B");

  const { mutate, isPending } = useAddVariant();

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(URL.createObjectURL(img)));
    };
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;

    mutate(
      {
        product_id: product.id,
        color_name: colorName,
        color_hex: colorHex,
        images,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 h-full flex flex-col justify-between"
    >
      {/* FIELDS SCROLL CONTENT INNER CONTAINER */}
      <div className="space-y-5 flex-1">
        {/* COLOR NAME */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Color Name
          </label>
          <input
            type="text"
            required
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="e.g. Mocha Brown"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white  text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        {/* COLOR PICKER CONFIGURATION PANEL */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">
              Color Configuration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-12 h-10 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm bg-white">
              <input
                type="color"
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
                className="absolute inset-[-6px] w-[calc(100%+12px)] h-[calc(100%+12px)] cursor-pointer"
              />
            </div>

            <input
              type="text"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white font-mono  text-slate-700 uppercase outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* UPLOAD DRAG/DROP FIELD INTERFACE */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Product Images
          </label>
          <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/30 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all duration-200">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-200">
              <ImagePlus className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-sm font-semibold text-slate-700 mt-3">
              Upload Variant Media
            </span>
            <span className="text-xs text-slate-400 mt-0.5">
              Drag files or click to browse (PNG, JPG, WEBP)
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* IMAGE VISUAL GRID COMPONENT PREVIEW */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {images.map((img, i) => (
              <div
                key={`${img.name}-${i}`}
                className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-50"
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt="variant dynamic visual presentation preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-rose-600 hover:text-white p-1.5 rounded-xl shadow-md text-slate-500 backdrop-blur-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 text-[9px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-md shadow-sm">
                    Main Display
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOCKED ACTIONS CONTROL PANEL FOOTER */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-5 bg-white shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending || !colorName || images.length === 0}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving Variant...
            </span>
          ) : (
            "Add Variant"
          )}
        </button>
      </div>
    </form>
  );
}

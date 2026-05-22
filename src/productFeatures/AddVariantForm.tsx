import { useState } from "react";
import { ImagePlus, Trash2, Loader2, Palette } from "lucide-react";
import { Product } from "../types/ProductTypes";
import { useAddVariant } from "./useAddVariant";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function AddVariantForm({ product, onClose }: Props) {
  const [images, setImages] = useState<File[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#8B5A2B");

  const { mutate, isPending } = useAddVariant();

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* HEADER CONTEXT */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Add Variant</h3>
          <p className="text-xs text-slate-500">{product?.name}</p>
        </div>

        <div className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold">
          Variant
        </div>
      </div>

      {/* COLOR NAME */}
      <div>
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Color Name
        </label>

        <input
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder="e.g. Mocha Brown"
          className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition"
        />
      </div>

      {/* COLOR PICKER */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-600">
            Color Value
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="h-11 w-14 rounded-lg border border-slate-200 cursor-pointer"
          />

          <input
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition"
          />
        </div>
      </div>

      {/* UPLOAD */}
      <div>
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Product Images
        </label>

        <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition">
          <ImagePlus className="w-8 h-8 text-slate-400 mb-2" />

          <span className="text-sm font-medium text-slate-700">
            Upload images
          </span>

          <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</span>

          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* PREVIEW */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group rounded-xl overflow-hidden border border-slate-200"
            >
              <img
                src={URL.createObjectURL(img)}
                className="w-full h-24 object-cover"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/90 hover:bg-rose-500 hover:text-white p-1.5 rounded-full shadow"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {i === 0 && (
                <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-indigo-600 text-white px-2 py-1 rounded-full">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-60"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Add Variant"
          )}
        </button>
      </div>
    </form>
  );
}

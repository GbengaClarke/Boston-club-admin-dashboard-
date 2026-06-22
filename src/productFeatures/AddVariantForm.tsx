import { useState, useEffect } from "react";
import { ImagePlus, Trash2, Loader2, Palette } from "lucide-react";
import { Product } from "../types/ProductTypes";
import { useAddVariant } from "./useAddVariant";
import toast from "react-hot-toast";

interface AddVariantFormProps {
  product: Product;
  onClose: () => void;
}

interface ImageFileWithPreview {
  file: File;
  previewUrl: string;
}

export default function AddVariantForm({
  product,
  onClose,
}: AddVariantFormProps) {
  const [images, setImages] = useState<ImageFileWithPreview[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#8B5A2B");

  const { mutate, isPending } = useAddVariant();

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const nativeFilesWithPreviews = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...nativeFilesWithPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].previewUrl);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;

    const capitalize = (str: string) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

    const standardFilePayload = images.map((img) => img.file);

    mutate(
      {
        product_id: product.id,
        color_name: colorName,
        color_hex: colorHex,
        images: standardFilePayload,
      },
      {
        onSuccess: () => {
          toast.success(
            <span className="text-sm text-slate-300">
              Added{" "}
              <span className="font-bold text-white">
                {capitalize(colorName)}
              </span>{" "}
              variant to{" "}
              <span className="font-bold text-white">
                {capitalize(product.name)}
              </span>
            </span>
          );

          onClose();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to add variant");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 h-full flex flex-col justify-between"
    >
      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label
            htmlFor="variant-color-name"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Color Name
          </label>
          <input
            id="variant-color-name"
            type="text"
            required
            disabled={isPending}
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="e.g. Mocha Brown"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium placeholder-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* COLOR PICKER PANEL */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-inner">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-800">
              Color Configuration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-14 h-11 rounded-xl border border-slate-300 overflow-hidden shrink-0 shadow-sm bg-white">
              <input
                id="variant-color-hex-picker"
                type="color"
                disabled={isPending}
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
                className="absolute inset-[-6px] w-[calc(100%+12px)] h-[calc(100%+12px)] cursor-pointer disabled:cursor-not-allowed"
              />
            </div>

            <input
              id="variant-color-hex-text"
              type="text"
              disabled={isPending}
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              placeholder="#8B5A2B"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-slate-900 font-semibold uppercase outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* UPLOAD DRAG/DROP ZONE */}
        <div className="space-y-2">
          <label
            htmlFor="variant-media-upload"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Product Images
          </label>
          <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/60 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/40 transition-all duration-200">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform duration-200">
              <ImagePlus className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-bold text-slate-800 mt-3 transition-colors group-hover:text-indigo-700">
              Upload Variant Media
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-1">
              Drag files or click to browse (PNG, JPG, WEBP)
            </span>
            <input
              id="variant-media-upload"
              type="file"
              multiple
              accept="image/*"
              disabled={isPending}
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* PREVIEW IMAGE VISUAL GRID */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {images.map((img, i) => (
              <div
                key={`${img.file.name}-${i}`}
                className="relative group rounded-xl overflow-hidden border border-slate-300 aspect-square bg-white shadow-sm"
              >
                <img
                  src={img.previewUrl}
                  alt={`Preview variant asset slot ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-white text-slate-800 hover:bg-rose-600 hover:text-white p-2 rounded-xl shadow-md transition-all border border-slate-100 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {i === 0 && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-700 text-white px-2.5 py-1 rounded-md shadow-md border border-indigo-500">
                    Main Display
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIONS FOOTER */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 mt-6 bg-white shrink-0">
        <button
          type="button"
          disabled={isPending}
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending || !colorName || images.length === 0}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center min-w-[130px]"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
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

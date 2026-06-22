import { motion } from "framer-motion";
import { useState } from "react";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAddProduct } from "./useAddProduct";

interface AddProductFormProps {
  setShowForm: (show: boolean) => void;
}

function AddProductForm({ setShowForm }: AddProductFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [name, setName] = useState("product 1");
  const [description, setDescription] = useState("sike mf");
  const [regularPrice, setRegularPrice] = useState("10000");
  const [discount, setDiscount] = useState("10");
  const [category, setCategory] = useState("clogs");
  const [material, setMaterial] = useState("leather");
  const [colorName, setColorName] = useState("Almond");
  const [colorHex, setColorHex] = useState("#8B5A2B");

  const { createProduct, isCreating } = useAddProduct();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    createProduct(
      {
        name,
        description,
        regularPrice: Number(regularPrice),
        discount: Number(discount),
        isNewArrival: true,
        category,
        material,
        color_name: colorName,
        color_hex: colorHex,
        images,
      },
      {
        onSuccess: () => {
          toast.success("Product created successfully");
          setName("");
          setDescription("");
          setRegularPrice("");
          setDiscount("");
          setCategory("");
          setMaterial("");
          setColorName("");
          setColorHex("#8B5A2B");
          setImages([]);
          setShowForm(false);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to create product");
        },
      }
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
        <p className="text-sm font-medium text-slate-600 mt-1">
          Create a product with a primary color and multiple images.
        </p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* PRODUCT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="product-name"
              className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-2"
            >
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              disabled={isCreating}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Boston Suede Clog"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="product-desc"
              className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="product-desc"
              rows={4}
              disabled={isCreating}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short product description..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Regular Price */}
          <div>
            <label
              htmlFor="product-price"
              className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-2"
            >
              Regular Price
            </label>
            <input
              id="product-price"
              type="number"
              disabled={isCreating}
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
              placeholder="12500"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="product-discount"
              className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-2"
            >
              Discount %
            </label>
            <input
              id="product-discount"
              type="number"
              disabled={isCreating}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="10"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="product-category"
              className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-2"
            >
              Category
            </label>
            <select
              id="product-category"
              disabled={isCreating}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 bg-white outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">Select category</option>
              <option value="clogs">Clogs</option>
              <option value="sandals">Sandals</option>
              <option value="slides">Slides</option>
            </select>
          </div>

          {/* Material */}
          <div>
            <label
              htmlFor="product-material"
              className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-2"
            >
              Material
            </label>
            <select
              id="product-material"
              disabled={isCreating}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 bg-white outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">Select material</option>
              <option value="leather">Leather</option>
              <option value="suede">Suede</option>
            </select>
          </div>
        </div>

        {/* MAIN COLOR SECTION */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/80 shadow-inner">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Main Product Color
              </h3>
              <p className="text-sm font-medium text-slate-600 mt-0.5">
                This will be the default product variant.
              </p>
            </div>
            <div className="text-xs uppercase tracking-widest font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Main Default
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Color Name */}
            <div>
              <label
                htmlFor="color-name"
                className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-2"
              >
                Color Name
              </label>
              <input
                id="color-name"
                type="text"
                disabled={isCreating}
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="e.g. Mocha Brown"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Color Hex */}
            <div>
              <label
                htmlFor="color-hex-text"
                className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-2"
              >
                Color Hex
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="color-hex-picker"
                  type="color"
                  disabled={isCreating}
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-12 w-16 p-0.5 rounded-xl  bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input
                  id="color-hex-text"
                  type="text"
                  disabled={isCreating}
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  placeholder="#8B5A2B"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-slate-900 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* IMAGES SUBSECTION */}
          <div className="mt-6">
            <label className="block text-xs font-bold tracking-wider uppercase text-slate-700 mb-3">
              Product Images
            </label>

            {/* Upload Zone */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-8 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group">
              <ImagePlus className="w-10 h-10 text-slate-500 mb-2.5 transition-colors group-hover:text-indigo-600" />
              <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-700">
                Upload Product Images
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1">
                PNG, JPG, WEBP (Multiple allowed)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={isCreating}
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {/* Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group rounded-2xl overflow-hidden border border-slate-300 bg-white aspect-square shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview variant ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-indigo-700 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md">
                        Cover
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isCreating}
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 md:opacity-0 group-hover:opacity-100 transition-all bg-white text-slate-800 p-2 rounded-full shadow-md hover:bg-rose-600 hover:text-white border border-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM FORM ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isCreating}
            onClick={() => setShowForm(false)}
            className="px-5 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isCreating}
            className="flex items-center justify-center gap-2 min-w-[150px] px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Product</span>
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

export default AddProductForm;

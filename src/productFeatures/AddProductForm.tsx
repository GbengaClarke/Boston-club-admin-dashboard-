// import { motion } from "framer-motion";
// import { useState } from "react";
// import { ImagePlus, Trash2 } from "lucide-react";
// import toast from "react-hot-toast";

// function AddProductForm() {
//   const [images, setImages] = useState<File[]>([]);
//   const [colorHex, setColorHex] = useState("#8B5A2B");

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setImages((prev) => [...prev, ...files]);
//   };

//   const removeImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <motion.form
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
//     >
//       {/* Header */}
//       <div className="border-b border-slate-100 px-6 py-5">
//         <h2 className="text-lg font-semibold text-slate-800">
//           Add New Product
//         </h2>
//         <p className="text-sm text-slate-500 mt-1">
//           Create a product with a primary color and multiple images.
//         </p>
//       </div>

//       <div className="p-6 flex flex-col gap-8">
//         {/* PRODUCT DETAILS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Product Name */}
//           <div className="md:col-span-2">
//             <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
//               Product Name
//             </label>

//             <input
//               type="text"
//               placeholder="e.g. Boston Suede Clog"
//               className="w-full rounded-xl border border-slate-200 px-4 py-3  outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
//             />
//           </div>

//           {/* Description */}
//           <div className="md:col-span-2">
//             <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
//               Description
//             </label>

//             <textarea
//               rows={5}
//               placeholder="Write a short product description..."
//               className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3  outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
//             />
//           </div>

//           {/* Regular Price */}
//           <div>
//             <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
//               Regular Price
//             </label>

//             <input
//               type="number"
//               placeholder="₦12,500"
//               className="w-full rounded-xl border border-slate-200 px-4 py-3  outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
//             />
//           </div>

//           {/* Discount */}
//           <div>
//             <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
//               Discount %
//             </label>

//             <input
//               type="number"
//               placeholder="10"
//               className="w-full rounded-xl border border-slate-200 px-4 py-3  outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
//               Category
//             </label>

//             <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400">
//               <option>Select category</option>
//               <option>Clogs</option>
//               <option>Sandals</option>
//               <option>Sneakers</option>
//             </select>
//           </div>

//           {/* Material */}
//           <div>
//             <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
//               Material
//             </label>

//             <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400">
//               <option>Select material</option>
//               <option>Leather</option>
//               <option>Suede</option>
//             </select>
//           </div>
//         </div>

//         {/* MAIN COLOR */}
//         <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
//           <div className="flex items-center justify-between mb-5">
//             <div>
//               <h3 className="font-semibold text-slate-800">
//                 Main Product Color
//               </h3>
//               <p className="text-sm text-slate-500">
//                 This will be the default product variant.
//               </p>
//             </div>

//             <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-indigo-500">
//               Main
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {/* Color Name */}
//             <div>
//               <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
//                 Color Name
//               </label>

//               <input
//                 type="text"
//                 placeholder="e.g. Mocha Brown"
//                 className="w-full rounded-xl border border-slate-200 px-4 py-3  outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
//               />
//             </div>

//             {/* Color Hex */}
//             <div>
//               <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
//                 Color Hex
//               </label>

//               <div className="flex items-center gap-3">
//                 <div className="h-12x w-14x">
//                   <input
//                     type="color"
//                     defaultValue="#8B5A2B"
//                     value={colorHex}
//                     onChange={(e) => setColorHex(e.target.value)}
//                     className="h-12 w-14  rounded-lg border border-slate-200 bg-white cursor-pointer"
//                   />
//                 </div>

//                 <input
//                   type="text"
//                   placeholder="#8B5A2B"
//                   value={colorHex}
//                   onChange={(e) => setColorHex(e.target.value)}
//                   className="flex-1x w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* IMAGES */}
//           <div className="mt-6">
//             <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-3">
//               Product Images
//             </label>

//             {/* Upload Box */}
//             <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-10 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all">
//               <ImagePlus className="w-10 h-10 text-slate-400 mb-3" />

//               <span className="text-sm font-medium text-slate-700">
//                 Upload Product Images
//               </span>

//               <span className="text-xs text-slate-400 mt-1">
//                 PNG, JPG, WEBP
//               </span>

//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageChange}
//               />
//             </label>

//             {/* Preview Grid */}
//             {images.length > 0 && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
//                 {images.map((image, index) => (
//                   <div
//                     key={index}
//                     className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-square"
//                   >
//                     <img
//                       src={URL.createObjectURL(image)}
//                       alt="preview"
//                       className="w-full h-full object-cover"
//                     />

//                     {/* Main badge */}
//                     {index === 0 && (
//                       <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
//                         Main
//                       </div>
//                     )}

//                     {/* Delete */}
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="absolute top-2 right-2 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-rose-500 hover:text-white text-slate-700 p-2 rounded-full shadow-sm"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex items-center justify-end gap-3 pt-2">
//           <button
//             type="button"
//             className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
//           >
//             Create Product
//           </button>
//         </div>
//       </div>
//     </motion.form>
//   );
// }

// export default AddProductForm;

import { motion } from "framer-motion";
import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAddProduct } from "./useAddProduct";

function AddProductForm({ setShowForm }) {
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
          toast.error(err.message);
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
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Add New Product
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Create a product with a primary color and multiple images.
        </p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* PRODUCT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Boston Suede Clog"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short product description..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>

          {/* Regular Price */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
              Regular Price
            </label>

            <input
              type="number"
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
              placeholder="₦12,500"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
              Discount %
            </label>

            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="10"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            >
              <option value="">Select category</option>

              <option value="clogs">Clogs</option>

              <option value="sandals">Sandals</option>

              <option value="sneakers">Sneakers</option>
            </select>
          </div>

          {/* Material */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
              Material
            </label>

            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
            >
              <option value="">Select material</option>

              <option value="leather">Leather</option>

              <option value="suede">Suede</option>
            </select>
          </div>
        </div>

        {/* MAIN COLOR */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">
                Main Product Color
              </h3>

              <p className="text-sm text-slate-500">
                This will be the default product variant.
              </p>
            </div>

            <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-indigo-500">
              Main
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Color Name */}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
                Color Name
              </label>

              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="e.g. Mocha Brown"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
              />
            </div>

            {/* Color Hex */}
            <div>
              <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">
                Color Hex
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-12 w-14 rounded-lg border border-slate-200 bg-white cursor-pointer"
                />

                <input
                  type="text"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* IMAGES */}
          <div className="mt-6">
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-3">
              Product Images
            </label>

            {/* Upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-10 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all">
              <ImagePlus className="w-10 h-10 text-slate-400 mb-3" />

              <span className="text-sm font-medium text-slate-700">
                Upload Product Images
              </span>

              <span className="text-xs text-slate-400 mt-1">
                PNG, JPG, WEBP
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {/* Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-square"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />

                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        Main
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-rose-500 hover:text-white text-slate-700 p-2 rounded-full shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
          >
            {isCreating ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

export default AddProductForm;

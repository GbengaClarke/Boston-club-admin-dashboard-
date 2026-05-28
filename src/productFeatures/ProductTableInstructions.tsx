import { Eye, Sparkles, FileText, Trash2, Edit2, Plus } from "lucide-react";

function ProductTableInstructions() {
  return (
    <>
      {/* CATALOG MANAGEMENT INSTRUCTIONS */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Catalog Quick Guide & Functions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600 leading-relaxed">
          <div>
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-500" /> View Details
            </p>
            <p>
              Click on any product row item to pull out the side drawer. From
              there, you can cycle, swipe, or check high-resolution variant
              images.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              {/* <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Add New */}
              <Plus className="w-4 h-4 text-amber-500" /> Add New Variants
            </p>
            <p>
              Use the action menu button inside the row to add alternative color
              pathways directly to an established foot wear parent asset.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-slate-500" /> Edit Products
            </p>
            <p>
              Modify basic baseline settings, names, categories, and core base
              pricing tiers without affecting standard background asset
              configurations layout parameters.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Complete Removal
            </p>
            <p>
              Deleting from this top-level catalog table opens a confirmation
              prompt to clear the total catalog index entry along with its
              dependent child variations safely.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductTableInstructions;

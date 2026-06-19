import { Eye, Trash2, Edit2, Plus, LucideIcon } from "lucide-react";

interface InstructionItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

// 1. Centralized Data Object Configuration Registry
const CATALOG_INSTRUCTIONS: InstructionItem[] = [
  {
    id: "view-details",
    title: "View Details",
    description:
      "Click on any product row item to pull out the side drawer. From there, you can cycle, swipe, or check high-resolution variant images.",
    icon: Eye,
    iconColor: "text-slate-600",
  },
  {
    id: "add-variants",
    title: "Add New Variants",
    description:
      "Use the action menu button inside the row to add alternative color pathways directly to an established footwear parent asset.",
    icon: Plus,
    iconColor: "text-amber-700", // High contrast amber alternative
  },
  {
    id: "edit-products",
    title: "Edit Products",
    description:
      "Modify basic baseline settings, names, categories, and core base pricing tiers without affecting standard background asset configurations layout parameters.",
    icon: Edit2,
    iconColor: "text-slate-600",
  },
  {
    id: "complete-removal",
    title: "Complete Removal",
    description:
      "Deleting from this top-level catalog table opens a confirmation prompt to clear the total catalog index entry along with its dependent child variations safely.",
    icon: Trash2,
    iconColor: "text-rose-600", // Solid high contrast red
  },
];

export function ProductTableInstructions() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-2">
      {/* HEADER SECTION */}
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
        Catalog Quick Guide & Functions
      </h3>

      {/* DYNAMIC GRID MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {CATALOG_INSTRUCTIONS.map(
          ({ id, title, description, icon: Icon, iconColor }) => (
            <div
              key={id}
              className="text-xs leading-relaxed flex flex-col gap-1"
            >
              {/* ITEM TITLE & ICON */}
              <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
                {title}
              </p>

              {/* ITEM DESCRIPTION */}
              <p className="text-slate-700 font-medium">{description}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ProductTableInstructions;

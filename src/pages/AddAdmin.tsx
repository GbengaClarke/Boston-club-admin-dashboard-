// // src/pages/AddAdmin.tsx
// import { ArrowLeft } from "lucide-react";
// import { AddAdminForm } from "../adminFeatures/AddAdminForm";

// export function AddAdmin() {
//   return (
//     <div className="max-w-2xl mx-auto flex flex-col gap-6 min-h-screen py-4">
//       {/* ROUTE NAVIGATION BAR COMPONENT HEADER */}
//       <div className="flex items-center gap-4">
//         <button
//           type="button"
//           onClick={() => window.history.back()}
//           className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
//           title="Go Back"
//         >
//           <ArrowLeft className="w-4 h-4" />
//         </button>
//         <div>
//           <h1 className="text-xl font-bold text-slate-800 tracking-tight">
//             Provision New Account
//           </h1>
//           <p className="text-sm text-slate-500">
//             Securely register a new user credential background context and
//             system profile layout.
//           </p>
//         </div>
//       </div>

//       {/* RENDER FORMS PANEL */}
//       <AddAdminForm />
//     </div>
//   );
// }

// export default AddAdmin;

// src/pages/AddAdmin.tsx
import { ArrowLeft } from "lucide-react";
import { AddAdminForm } from "../adminFeatures/AddAdminForm";

export function AddAdmin() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 min-h-screen py-4 px-4 sm:px-0">
      {/* ROUTE NAVIGATION BAR COMPONENT HEADER */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Provision New Account
          </h1>
          <p className="text-sm text-slate-500">
            Securely register a new user credential background context and
            system profile layout.
          </p>
        </div>
      </div>

      {/* RENDER FORMS PANEL */}
      <AddAdminForm />
    </div>
  );
}

export default AddAdmin;

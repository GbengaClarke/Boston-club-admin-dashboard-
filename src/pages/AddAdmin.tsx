import { ArrowLeft } from "lucide-react";
import { AddAdminForm } from "../adminFeatures/AddAdminForm";

export function AddAdmin() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 min-h-screen py-4 px-4 sm:px-0">
      <div className="flex items-center gap-4">
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

      <AddAdminForm />
    </div>
  );
}

export default AddAdmin;

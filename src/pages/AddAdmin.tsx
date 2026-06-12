import { AddAdminForm } from "../adminFeatures/AddAdminForm";

export function AddAdmin() {
  return (
    <div className=" mx-auto flex flex-col gap-6 min-h-screen ">
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

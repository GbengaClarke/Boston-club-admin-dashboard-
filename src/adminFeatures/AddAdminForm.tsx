// src/features/admins/AddAdminForm.tsx
import React, { useState } from "react";
import { UserPlus, Mail, User, Phone, ShieldAlert } from "lucide-react";
import { useCreateAdmin } from "./useCreateAdmin";

export function AddAdminForm() {
  const [fullName, setFullName] = useState("Gbenga Clarke");
  const [email, setEmail] = useState("gbengaclarke@gmail.com");
  const [phone, setPhone] = useState("09078978574");
  const [role, setRole] = useState<"admin" | "customer">("admin");

  const { createAdmin, isPending } = useCreateAdmin(() => {
    setFullName("");
    setEmail("");
    setPhone("");
    setRole("admin");
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    let formattedPhone = phone.trim();
    if (formattedPhone) {
      formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, "");

      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+234" + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+" + formattedPhone;
      }
    }

    createAdmin({
      email,
      fullName,
      phone: formattedPhone || undefined,
      role,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* INPUT: FULL NAME */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              required
              type="text"
              value={fullName}
              disabled={isPending}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Olugbenga Michael"
              className="w-full border border-slate-200 rounded-xl  bg-white py-2 pl-10 pr-4 font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* INPUT: EMAIL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              required
              type="email"
              value={email}
              disabled={isPending}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="michael@example.com"
              className="w-full border border-slate-200 rounded-xl  bg-white py-2 pl-10 pr-4 font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* INPUT: PHONE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Phone Number{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="tel"
              value={phone}
              disabled={isPending}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09078978574"
              className="w-full border border-slate-200 rounded-xl  bg-white py-2 pl-10 pr-4 font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* SELECTOR: SYSTEM ACCESS PRIVILEGES */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            System Authorization Role
          </label>
          <select
            value={role}
            disabled={isPending}
            onChange={(e) => setRole(e.target.value as "admin" | "customer")}
            className="w-full border border-slate-200 rounded-xl  bg-white py-2 px-3 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="admin">Administrator (Full Dashboard Access)</option>
            <option value="customer">
              Customer (Storefront Consumer Access)
            </option>
          </select>
        </div>

        {/* PRIVILEGE NOTIFICATION BOX */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold">
              Automatic Account Invitation
            </span>
            <p className="text-[11px] leading-relaxed text-amber-700 font-medium">
              This initialization flow sends an automated verification
              onboarding email directly to the recipient. Clicking the link
              handles security challenges securely, routing them to configure
              their new private workspace password.
            </p>
          </div>
        </div>

        {/* LAYOUT ACTION CTA ROW */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => window.history.back()}
            className="px-5 py-2 text-xs font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shadow-indigo-100 disabled:opacity-50"
          >
            {isPending ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-b-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Initialize User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

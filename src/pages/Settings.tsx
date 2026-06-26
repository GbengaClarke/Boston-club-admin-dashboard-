import { useState } from "react";
import { useCurrentUser } from "../adminFeatures/useCurrentUser";
import { useUpdateSettings } from "../adminFeatures/useUpdateSettings";
import { User, Lock, Upload, Loader2, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";

export function Settings() {
  const { userProfile, isLoading: isProfileLoading } = useCurrentUser();
  const { updateSettings, isUpdating } = useUpdateSettings();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  if (isProfileLoading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const currentAvatar = userProfile?.image || "default-user.jpg";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fullName = formData.get("fullName") as string;
    const oldPassword = formData.get("oldPassword") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!fullName.trim()) {
      toast.error("Display name cannot be submitted empty.");
      return;
    }

    if (password || confirmPassword) {
      if (!oldPassword) {
        toast.error(
          "Please enter your current password to authorize this modification."
        );
        return;
      }
      if (password.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error(
          "Security mismatch: new password confirmations do not match."
        );
        return;
      }
    }

    updateSettings({
      userId: userProfile?.id,
      fullName,
      avatarFile: selectedFile,
      oldPassword: oldPassword || undefined,
      newPassword: password || undefined,
    });

    if (password && password === confirmPassword) {
      e.currentTarget.reset();
    }
  };

  return (
    <div className="w-full py-4x px-2x sm:px-6x lg:px-8x max-w-7xlx mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all duration-200">
        {/* HEADER SECTION */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Account Management
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Update your public profile, change your avatar identity, or securely
            cycle your access credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* PROFILE PHOTO FIELD */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800 block">
                Avatar Profile Image
              </label>
              <p className="text-xs text-slate-400">
                Supports JPG, PNG or WEBP formats. Max 4MB recommended.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full ring-4 ring-white shadow-md overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                <img
                  src={previewUrl || currentAvatar}
                  alt="Identity Context"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-sm active:scale-[0.98] transition-all duration-150">
                <Upload className="w-4 h-4 text-slate-500" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* DISPLAY NAME SECTION */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Display Name
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                name="fullName"
                defaultValue={userProfile?.full_name || ""}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 capitalize rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150"
                placeholder="Enter display name..."
              />
            </div>
          </div>

          <div className="py-2">
            <div className="w-full h-px bg-slate-200/60" />
          </div>

          {/* CREDENTIAL PROTECTION ZONE */}
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Security and Credentials
              </h3>
              <p className="text-xs text-slate-400">
                To alter your current account entry passphrase, verify your
                account signature below.
              </p>
            </div>

            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/60 space-y-5">
              {/* CURRENT PASSWORD */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Current Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Verify current password..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150"
                  />
                </div>
              </div>

              {/* NEW PASSWORD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    New Password
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Confirm New Password
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto min-w-[160px] flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving updates...
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

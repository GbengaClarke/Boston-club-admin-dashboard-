// import { useState, useEffect } from "react";
// import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { useUpdatePassword } from "./useUpdatePassword";
// import { supabase } from "../lib/supabase";

// export function UpdatePassword() {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSessionChecking, setIsSessionChecking] = useState(true);
//   const [isLinkValid, setIsLinkValid] = useState(false);

//   const { changePassword, isPending } = useUpdatePassword();

//   useEffect(() => {
//     const parseAuthContext = async () => {
//       // 1. Check if a secure session link was loaded
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (session?.user) {
//         setIsLinkValid(true);
//       } else {
//         // 2. Check for local devLink hash fallbacks
//         const hashParams = new URLSearchParams(
//           window.location.hash.substring(1)
//         );
//         const extractedUserId = hashParams.get("user_id");

//         if (extractedUserId) {
//           // Verify we have some valid user context before granting form visibility
//           const {
//             data: { user },
//           } = await supabase.auth.getUser();
//           setIsLinkValid(!!user || process.env.NODE_ENV === "development");
//         }
//       }
//       setIsSessionChecking(false);
//     };
//     parseAuthContext();
//   }, []);

//   const handlePasswordSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!password) return;

//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters long.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     // Secure execution passes only the password parameter string
//     changePassword(password);
//   };

//   if (isSessionChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="w-6 h-6 border-2 border-indigo-600 border-b-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!isLinkValid) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
//         <div className="max-w-md w-full bg-white border border-slate-200 p-6 rounded-xl text-center shadow-sm flex flex-col gap-2">
//           <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider">
//             Invalid or Expired Link
//           </h3>
//           <p className="text-xs font-medium text-slate-500 leading-relaxed">
//             This onboarding handshake token context has expired or is invalid.
//             Please request your system administrator to dispatch a new access
//             invite link.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
//       <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
//         <div className="flex flex-col gap-1 mb-6">
//           <h2 className="text-lg font-bold text-slate-800">
//             Complete Account Setup
//           </h2>
//           <p className="text-xs font-medium text-slate-400">
//             Establish your permanent private account configuration access
//             credentials.
//           </p>
//         </div>

//         <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
//           {/* INPUT: NEW PASSWORD */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//               New Access Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
//               <input
//                 required
//                 type={showPassword ? "text" : "password"}
//                 disabled={isPending}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full border border-slate-200 rounded-xl text-sm bg-white py-2 pl-10 pr-10 font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-4 h-4" />
//                 ) : (
//                   <Eye className="w-4 h-4" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* INPUT: CONFIRM PASSWORD */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
//               <input
//                 required
//                 type={showPassword ? "text" : "password"}
//                 disabled={isPending}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full border border-slate-200 rounded-xl text-sm bg-white py-2 pl-10 pr-10 font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
//               />
//             </div>
//           </div>

//           {/* CTA SUBMIT ACTION ROW */}
//           <button
//             type="submit"
//             disabled={isPending}
//             className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shadow-indigo-100 disabled:opacity-50 mt-2"
//           >
//             {isPending ? (
//               <div className="w-3.5 h-3.5 border-2 border-white border-b-transparent rounded-full animate-spin" />
//             ) : (
//               <>
//                 <ShieldCheck className="w-4 h-4" />
//                 Finalize Security Profile
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UpdatePassword;

import { useState, useEffect } from "react";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdatePassword } from "./useUpdatePassword";
import { supabase } from "../lib/supabase";

export function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [isLinkValid, setIsLinkValid] = useState(false);

  const { changePassword, isPending } = useUpdatePassword();

  useEffect(() => {
    const parseAuthContext = async () => {
      // 1. Check if a secure session link was loaded
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setIsLinkValid(true);
      } else {
        // 2. Check for local devLink hash fallbacks
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const extractedUserId = hashParams.get("user_id");

        if (extractedUserId) {
          // Verify we have some valid user context before granting form visibility
          const {
            data: { user },
          } = await supabase.auth.getUser();
          setIsLinkValid(!!user || process.env.NODE_ENV === "development");
        }
      }
      setIsSessionChecking(false);
    };
    parseAuthContext();
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Secure execution passes only the password parameter string
    changePassword(password);
  };

  if (isSessionChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-6 h-6 border-2 border-indigo-600 border-b-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLinkValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white border border-slate-300 p-6 rounded-xl text-center shadow-sm flex flex-col gap-2">
          <h3 className="text-sm font-extrabold text-rose-700 uppercase tracking-wider">
            Invalid or Expired Link
          </h3>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
            This onboarding handshake token context has expired or is invalid.
            Please request your system administrator to dispatch a new access
            invite link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Complete Account Setup
          </h2>
          <p className="text-xs font-semibold text-slate-600">
            Establish your permanent private account configuration access
            credentials.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
          {/* INPUT: NEW PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              New Access Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 shrink-0" />
              <input
                required
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl text-sm bg-white py-2 pl-10 pr-10 font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-800 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* INPUT: CONFIRM PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 shrink-0" />
              <input
                required
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl text-sm bg-white py-2 pl-10 pr-10 font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-shadow"
              />
            </div>
          </div>

          {/* CTA SUBMIT ACTION ROW */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-sm shadow-indigo-100 disabled:opacity-50 mt-2"
          >
            {isPending ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-b-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                Finalize Security Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;

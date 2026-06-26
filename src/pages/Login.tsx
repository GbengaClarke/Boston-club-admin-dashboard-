// import React, { useState } from "react";
// import { useAuth } from "../lib/auth";
// import { LogIn } from "lucide-react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { GiSlippers } from "react-icons/gi";
// import { supabase } from "../lib/supabase";

// export function Login() {
//   const { session, signInWithPassword, loading } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("sample@test.com");
//   const [password, setPassword] = useState("aaaaaaaa");
//   const [error, setError] = useState("");
//   const [isSigningIn, setIsSigningIn] = useState(false);
//   const [isResettingPassword, setIsResettingPassword] = useState(false);

//   if (session) {
//     return <Navigate to="/" replace />;
//   }

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setIsSigningIn(true);

//       //Complete standard credentials authentication
//       await signInWithPassword(email, password);

//       //  Fetch the current authenticated user's profile context metadata
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         // Query your target profile authorization table (assumed here as "profiles")
//         const { data: profile, error: profileError } = await supabase
//           .from("profiles")
//           .select("role")
//           .eq("id", user.id)
//           .single();

//         // Catch unauthorized access or explicit customer accounts
//         if (profileError || !profile || profile.role === "customer") {
//           // Immediately terminate the authenticated session tokens
//           await supabase.auth.signOut();

//           // Throw specific error to be caught by the catch block
//           throw new Error(
//             "Access Denied: This portal is reserved for administrators."
//           );
//         }
//       }

//       toast.success("Welcome back!");
//     } catch (err: any) {
//       console.error(err);
//       const errorMessage = err.message || "Failed to sign in.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsSigningIn(false);
//     }
//   };

//   // HANDLER: FORGOT PASSWORD FLOW
//   const handleForgotPassword = async () => {
//     setError("");

//     if (!email || email === "sample@test.com") {
//       const message = "Please enter your valid account email address first.";
//       setError(message);
//       toast.error(message);
//       return;
//     }

//     try {
//       setIsResettingPassword(true);

//       const { error: resetError } = await supabase.auth.resetPasswordForEmail(
//         email,
//         {
//           redirectTo: `${window.location.origin}/update-password`,
//         }
//       );

//       if (resetError) throw resetError;

//       toast.success(`Reset link sent! Check your inbox at ${email}`, {
//         duration: 5000,
//       });
//     } catch (err: any) {
//       console.error(err);

//       if (err.message?.includes("rate limit exceeded") || err.status === 429) {
//         toast.error(
//           "Reset link limit reached. Please check your inbox or try again after an hour."
//         );
//       } else {
//         toast.error(
//           err.message ||
//             "Failed to dispatch recovery reset token execution context."
//         );
//       }
//     } finally {
//       setIsResettingPassword(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
//             <GiSlippers />
//           </div>
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
//           Boston Club Admin
//         </h2>
//         <p className="mt-2 text-center text-sm font-semibold text-slate-600">
//           Sign in to manage your store
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-300">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             {error && (
//               <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold border border-rose-200 leading-relaxed">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 required
//                 autoComplete="on"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 block w-full border border-slate-300 rounded-xl bg-white py-2 px-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
//               />
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-1.5">
//                 <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
//                   Password
//                 </label>

//                 <button
//                   type="button"
//                   disabled={isResettingPassword || isSigningIn}
//                   onClick={handleForgotPassword}
//                   className="text-xs font-bold text-indigo-600 hover:text-indigo-700 focus:outline-none disabled:opacity-50"
//                 >
//                   {isResettingPassword
//                     ? "Sending reset..."
//                     : "Forgot password?"}
//                 </button>
//               </div>

//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-1 block w-full border border-slate-300 rounded-xl bg-white py-2 px-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isSigningIn || loading || isResettingPassword}
//               className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <LogIn className="w-4 h-4 mr-2 stroke-[2.5]" />
//               {isSigningIn ? "Signing in..." : "Sign in"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useAuth } from "../lib/auth";
import { LogIn } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { GiSlippers } from "react-icons/gi";
import { supabase } from "../lib/supabase";

export function Login() {
  const { session, signInWithPassword, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("sample@test.com");
  const [password, setPassword] = useState("aaaaaaaa");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setIsSigningIn(true);
      await signInWithPassword(email, password);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError || !profile || profile.role === "customer") {
          await supabase.auth.signOut();
          throw new Error(
            "Access Denied: This portal is reserved for administrators."
          );
        }
      }

      toast.success("Welcome back!");
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Failed to sign in.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");

    if (!email || email === "sample@test.com") {
      const message = "Please enter your valid account email address first.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setIsResettingPassword(true);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (resetError) throw resetError;

      toast.success(`Reset link sent! Check your inbox at ${email}`, {
        duration: 5000,
      });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("rate limit exceeded") || err.status === 429) {
        toast.error(
          "Reset link limit reached. Please check your inbox or try again after an hour."
        );
      } else {
        toast.error(
          err.message ||
            "Failed to dispatch recovery reset token execution context."
        );
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    /* 1. Added base horizontal padding (px-4) and responsive vertical padding to prevent clipping on short viewports */
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      {/* 2. Unified width constraint logic via w-full max-w-md mx-auto */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            <GiSlippers />
          </div>
        </div>
        {/* 3. Scaled down title font size on mobile (text-2xl) to prevent line wrapping */}
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Boston Club Admin
        </h2>
        <p className="mt-1.5 text-center text-sm font-semibold text-slate-600">
          Sign in to manage your store
        </p>
      </div>

      <div className="mt-6 sm:mt-8 w-full max-w-md mx-auto">
        {/* 4. Made padding tighter on mobile (p-5) and spacious on desktop (sm:p-10) */}
        <div className="bg-white py-6 px-5 shadow-sm rounded-xl sm:rounded-2xl sm:p-10 border border-slate-300">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold border border-rose-200 leading-relaxed">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border border-slate-300 rounded-xl bg-white py-2 px-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Password
                </label>

                <button
                  type="button"
                  disabled={isResettingPassword || isSigningIn}
                  onClick={handleForgotPassword}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 focus:outline-none disabled:opacity-50 touch-manipulation"
                >
                  {isResettingPassword
                    ? "Sending reset..."
                    : "Forgot password?"}
                </button>
              </div>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border border-slate-300 rounded-xl bg-white py-2 px-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn || loading || isResettingPassword}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              <LogIn className="w-4 h-4 mr-2 stroke-[2.5]" />
              {isSigningIn ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./lib/auth";
// import { Layout } from "./components/Layout";
// import { Login } from "./pages/Login";
// import { Dashboard } from "./pages/Dashboard";
// import { Products } from "./pages/Products";
// import { ProductDetails } from "./pages/ProductDetails";
// import { Orders } from "./pages/Orders";
// import { Reviews } from "./pages/Reviews";
// import { Profiles } from "./pages/Profiles";
// import { Toaster } from "react-hot-toast";
// import AddAdmin from "./pages/AddAdmin";
// import UpdatePassword from "./adminFeatures/UpdatePassword";
// import { Settings } from "./pages/Settings";

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { session } = useAuth();

//   if (!session) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }

// const queryClient = new QueryClient();

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <Toaster
//           position="top-center"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: "#1e293b",
//               color: "#fff",
//             },
//           }}
//         />
//         <Router>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="update-password" element={<UpdatePassword />} />
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Layout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<Dashboard />} />
//               <Route path="products" element={<Products />} />
//               <Route path="products/:id" element={<ProductDetails />} />
//               <Route path="addadmin" element={<AddAdmin />} />
//               <Route path="orders" element={<Orders />} />
//               <Route path="reviews" element={<Reviews />} />
//               <Route path="profiles" element={<Profiles />} />
//               <Route path="settings" element={<Settings />} />
//             </Route>
//           </Routes>
//         </Router>
//       </AuthProvider>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { ProductDetails } from "./pages/ProductDetails";
import { Orders } from "./pages/Orders";
import { Reviews } from "./pages/Reviews";
import { Profiles } from "./pages/Profiles";
import { Toaster } from "react-hot-toast";
import AddAdmin from "./pages/AddAdmin";
import UpdatePassword from "./adminFeatures/UpdatePassword";
import { Settings } from "./pages/Settings";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Destructure session AND loading states from your auth provider
  const { session, loading } = useAuth();

  // 1. CRITICAL: If the authentication provider is still loading/resolving
  // the session from Supabase on reload, render a loading state.
  // This prevents React Router from executing premature redirect actions!
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 mt-3 font-medium tracking-wide">
          Syncing secure session...
        </p>
      </div>
    );
  }

  // 2. Only perform the login redirect check AFTER we are sure loading is complete.
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1e293b",
              color: "#fff",
            },
          }}
        />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="update-password" element={<UpdatePassword />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="addadmin" element={<AddAdmin />} />
              <Route path="orders" element={<Orders />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="profiles" element={<Profiles />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

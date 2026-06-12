

// // src/features/admins/useCreateAdmin.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-hot-toast";
// import { NewAdminPayload, registerAdminUser } from "../lib/apiAdmin"; // Kept your relative path structure intact

// // Updated the callback type signature so it can forward the fallback development link to your form UI component
// export function useCreateAdmin(onSuccessCallback?: (devLink?: string) => void) {
//   const queryClient = useQueryClient();

//   const { mutate: createAdmin, isPending } = useMutation({
//     mutationFn: (data: NewAdminPayload) => registerAdminUser(data),
    
//     onSuccess: (data) => {
//       toast.success("Account initialized! Onboarding invitation link dispatched.");
      
//       // Automatically refresh any active user cache profiles running on your listings dashboard
//       queryClient.invalidateQueries({ queryKey: ["profiles"] });
      
//       // Forwards the local development link up to the form if the email relay was caught by the rate limiter
//       if (onSuccessCallback) onSuccessCallback(data?.devLink);
//     },
    
//     // onError: (err: Error) => {
//     //   // --- INTERCEPT EMAIL RATE LIMIT EXCEEDED ERRORS ---
//     //   if (err.message?.includes("rate limit exceeded")) {
//     //     toast.error("Email invitation limit reached. Please try again after an hour.", {
//     //       duration: 5000,      // Keeps the toast visible long enough for the administrator to read clearly
//     //       id: "rate-limit-toast", // Explicit ID prevents duplicate toast stacking if they smash the submit button
//     //     });
//     //   } else {
//     //     // Standard structural error fallback handler
//     //     toast.error(err.message || "Failed to establish user access context.");
//     //   }
//     // },
//     onError: (err: Error) => {
//       if (err.message?.includes("rate limit exceeded")) {
//         toast.error("Email invitation limit reached. Please try again after an hour.");
//       } else {
//         // err.message will now say "User already exists" instead of "Edge Function returned a non-2xx status code"
//         toast.error(err.message || "Failed to establish user access context.");
//       }
//     }
//   });

//   return { createAdmin, isPending };
// }

// src/features/admins/useCreateAdmin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { NewAdminPayload, registerAdminUser } from "../lib/apiAdmin";

export function useCreateAdmin(onSuccessCallback?: (devLink?: string) => void) {
  const queryClient = useQueryClient();

  const { mutate: createAdmin, isPending } = useMutation({
    mutationFn: (data: NewAdminPayload) => registerAdminUser(data),
    
    onSuccess: (data) => {
      // This block fires ONLY if the user was successfully created AND the invite email went through
      toast.success("Account created! We've sent an invitation link to their email.");
      
      // Automatically refresh any active profile listings running on your dashboard
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      
      if (onSuccessCallback) onSuccessCallback(data?.devLink);
    },
    
    onError: (err: Error) => {
      // Intercepts the custom rate limit error thrown from our frontend rollback logic
      if (err.message?.includes("rate limit exceeded") || err.message?.includes("Email invitation limit reached")) {
        toast.error("Email invitation limit reached. Please try again after an hour.", {
          id: "rate-limit-toast", // Explicit ID prevents multiple toasts if clicked repeatedly
        });
      } else {
        // Standard structural error fallbacks (e.g., "Email already registered")
        toast.error(err.message || "Failed to establish user access context.");
      }
    }
  });

  return { createAdmin, isPending };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { NewAdminPayload, registerAdminUser } from "../lib/apiAdmin";

export function useCreateAdmin(onSuccessCallback?: (devLink?: string) => void) {
  const queryClient = useQueryClient();

  const { mutate: createAdmin, isPending } = useMutation({
    mutationFn: (data: NewAdminPayload) => registerAdminUser(data),
    
    onSuccess: (data) => {
      // This block fires ONLY if the user was successfully created AND the invite email went through
      toast.success("Account initiated! We've sent an invitation link to their email.");
      
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
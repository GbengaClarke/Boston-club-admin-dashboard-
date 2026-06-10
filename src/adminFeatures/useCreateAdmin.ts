// // src/features/admins/useCreateAdmin.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-hot-toast"; // Adjust path to target your toast manager
// import { NewAdminPayload, registerAdminUser } from "../lib/apiAdmin";

// export function useCreateAdmin(onSuccessCallback?: () => void) {
//   const queryClient = useQueryClient();

//   const { mutate: createAdmin, isPending } = useMutation({
//     mutationFn: (data: NewAdminPayload) => registerAdminUser(data),
//     onSuccess: () => {
//       toast.success("Account and system profile initialized successfully!");
      
//       // Automatically refresh any active user cache profiles running on your listings dashboard
//       queryClient.invalidateQueries({ queryKey: ["profiles"] });
      
//       if (onSuccessCallback) onSuccessCallback();
//     },
//     onError: (err: Error) => {
//       toast.error(err.message || "Failed to establish user access context.");
//     },
//   });

//   return { createAdmin, isPending };
// }

// src/features/admins/useCreateAdmin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { NewAdminPayload, registerAdminUser } from "../lib/apiAdmin";

export function useCreateAdmin(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  const { mutate: createAdmin, isPending } = useMutation({
    mutationFn: (data: NewAdminPayload) => registerAdminUser(data),
    onSuccess: () => {
      toast.success("Account initialized! Invitation email dispatched successfully.");
      
      // Automatically refresh any active user listing caches running on your dashboard
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to establish user access context.");
    },
  });

  return { createAdmin, isPending };
}
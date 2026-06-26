
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { finalizeTargetedPassword } from "../lib/apiAdmin";

export function useUpdatePassword() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: changePassword, isPending } = useMutation({
    // Mutation now only needs the new password string value
    mutationFn: (password: string) => finalizeTargetedPassword(password),
    onSuccess: () => {
      toast.success("Security profile configured successfully!");
      
      // Clear any cached admin details left over in memory space
      queryClient.clear();
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to finalize password change.");
    },
  });

  return { changePassword, isPending };
}
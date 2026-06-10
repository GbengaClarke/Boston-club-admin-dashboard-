// src/features/admins/useUpdatePassword.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { updateSessionPassword } from "../lib/apiAdmin";

export function useUpdatePassword() {
  const navigate = useNavigate();

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: updateSessionPassword,
    onSuccess: () => {
      toast.success("Security profile configured successfully! Logging into dashboard...");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to finalize new password.");
    },
  });

  return { changePassword, isPending };
}
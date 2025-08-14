import { useState } from "react";
import { auth } from "@/lib/firebase/client";
import { sendPasswordResetEmail, AuthError } from "firebase/auth";

interface UsePasswordResetProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePasswordReset({ onSuccess, onError }: UsePasswordResetProps = {}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      console.error("Password reset error:", err);
      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";
      
      // Type guard to check if error is AuthError
      if (err instanceof Error && 'code' in err) {
        const authError = err as AuthError;
        if (authError.code === "auth/user-not-found") {
          errorMessage = "Không tìm thấy tài khoản với email này.";
        } else if (authError.code === "auth/invalid-email") {
          errorMessage = "Email không hợp lệ.";
        } else if (authError.code === "auth/too-many-requests") {
          errorMessage = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.";
        }
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    loading,
    success,
    error,
  };
}
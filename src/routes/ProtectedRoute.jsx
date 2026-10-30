import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children }) {
  const token = getToken();
  const [retry, setRetry] = useState(0);
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    getMe().then(() => {
      if (active) setVerification({ token, retry, valid: true });
    }).catch((error) => {
      if (active) setVerification({ token, retry, valid: false, message: error.response?.data?.message || "Unable to verify your session. Please try again." });
    });
    return () => { active = false; };
  }, [token, retry]);

  if (!token) return <Navigate to="/login" replace />;
  if (verification?.token !== token || verification?.retry !== retry) {
    return <div className="flex items-center justify-center min-h-screen"><span className="loading loading-spinner loading-lg" aria-label="Verifying session"></span></div>;
  }
  if (!verification.valid) {
    return <div className="alert alert-error" role="alert"><span>{verification.message}</span><button className="btn btn-sm" onClick={() => setRetry(value => value + 1)}>Retry</button></div>;
  }
  return children;
}

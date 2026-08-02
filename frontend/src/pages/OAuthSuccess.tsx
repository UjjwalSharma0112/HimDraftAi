import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const OAuthSuccess: React.FC = () => {
  const { setOAuthToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setOAuthToken(token);
      window.location.href = "/";
    } else {
      navigate("/login?error=oauth_failed", { replace: true });
    }
  }, [setOAuthToken, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#FBFBFB] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#EEEEEE]">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#111111] dark:border-[#EEEEEE] border-t-transparent"></div>
        <p className="text-xs uppercase tracking-wider font-semibold">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;

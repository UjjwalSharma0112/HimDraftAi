import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register: React.FC = () => {
  const { register, token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && token) {
      navigate("/", { replace: true });
    }
  }, [token, isLoading, navigate]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password, confirmPassword });
      navigate("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-container-bg border border-outline-border rounded-lg shadow-sm p-8 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-primary-text">
            HimDraft<span className="text-secondary-text">AI</span>
          </h2>
          <p className="text-xs text-secondary-text uppercase tracking-widest">
            Create Export Workspace
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs px-4 py-3 rounded-[4px] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-text block">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ujjwal Sharma"
              className="w-full bg-transparent border border-outline-border text-primary-text text-sm rounded-[4px] px-3 py-2.5 focus:outline-none focus:border-primary-text transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-text block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ujjwal@himshakti.com"
              className="w-full bg-transparent border border-outline-border text-primary-text text-sm rounded-[4px] px-3 py-2.5 focus:outline-none focus:border-primary-text transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-text block">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-transparent border border-outline-border text-primary-text text-sm rounded-[4px] px-3 py-2.5 focus:outline-none focus:border-primary-text transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary-text block">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full bg-transparent border border-outline-border text-primary-text text-sm rounded-[4px] px-3 py-2.5 focus:outline-none focus:border-primary-text transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-text text-container-bg text-xs font-bold uppercase tracking-wider py-3 rounded-[4px] hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-container-bg border-t-transparent"></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-secondary-text">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-text font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Simulate authentication
    setTimeout(() => {
      if (email === "demo@himshakti.ai" && password === "password") {
        setSuccess(true);
      } else {
        setError("Invalid credentials. Try using demo@himshakti.ai with password.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col justify-between transition-colors duration-300">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 relative">
        <div className="grain w-full max-w-md bg-raised border border-line rounded-card p-8 shadow-soft relative z-10 space-y-6 text-left transition-colors duration-300">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-medium text-accent uppercase tracking-widest bg-accent-soft border border-accent/20 px-2.5 py-0.5 rounded-pill">
              [auth] · secure portal
            </span>
            <h1 className="text-2xl font-serif font-medium tracking-tight text-fg transition-colors duration-300">Welcome Back</h1>
            <p className="text-muted text-xs transition-colors duration-300">
              Sign in to manage your premium product descriptions and branding styles.
            </p>
          </div>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-accent-soft border border-accent/20 rounded-lg text-xs text-accent leading-normal text-center transition-colors duration-300">
            <strong>Demo Account:</strong> <span className="font-mono bg-bg/50 px-1 rounded">demo@himshakti.ai</span> / <span className="font-mono bg-bg/50 px-1 rounded">password</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success/Error Alerts */}
            {error && (
              <div className="p-3 bg-warn/10 border border-warn/30 text-warn rounded-lg text-xs text-center font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-accent-soft border border-accent/30 text-accent rounded-lg text-xs text-center font-medium">
                Successfully signed in! Redirecting...
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-faint uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface/40 border border-line focus:border-accent rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none transition-colors duration-300 focus-ring"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-faint uppercase tracking-wider">Password</label>
                <a href="#forgot" className="text-xs text-accent hover:underline font-semibold">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface/40 border border-line focus:border-accent rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none transition-colors duration-300 focus-ring"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-lg bg-accent text-accent-contrast font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-ring"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Bottom links */}
          <div className="text-center text-xs text-muted pt-2 border-t border-line">
            Don't have a seller account?{" "}
            <a href="#signup" className="text-accent hover:underline font-semibold">
              Create an Account
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

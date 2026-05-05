import React, { useState } from "react";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import upesLogo from "../../imports/image.png";

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export function LoginPage({ onLogin, isLoading }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (attempts >= 5) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    // Basic password complexity check
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (email && password) {
      try {
        await onLogin(email, password);
      } catch (err) {
        setAttempts(prev => prev + 1);
        setError("Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Orbs omitted for brevity in diff */}
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={upesLogo} alt="UPES Logo" className="h-20 w-20 object-contain" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-[#1e3a8a] via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent">
            UPES Portal
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your portal securely
          </p>
        </div>

        <div className="rounded-2xl bg-card/50 backdrop-blur-md border border-border p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#06b6d4] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@upes.ac.in"
                  className="w-full bg-background/50 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#ec4899] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background/50 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#ec4899]/50 focus:border-[#ec4899] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || attempts >= 5}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#1e3a8a] via-[#06b6d4] to-[#ec4899] p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              <div className="bg-card group-hover:bg-transparent transition-colors rounded-[11px] py-3 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-foreground group-hover:text-white" />
                ) : (
                  <>
                    <span className="font-semibold text-foreground group-hover:text-white">Sign In</span>
                    <ArrowRight className="w-5 h-5 text-foreground group-hover:text-white" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

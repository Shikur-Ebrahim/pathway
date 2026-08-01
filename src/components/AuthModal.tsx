"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { Language } from "@/lib/translations";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  lang?: Language;
  defaultMode?: "login" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  lang = "am",
  defaultMode = "signup",
}) => {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle, isConfigured } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(defaultMode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const labels = {
    am: {
      loginTitle: "ወደ ሂሳብዎ ይግቡ",
      signupTitle: "ነፃ አካውንት ይፍጠሩ",
      loginSub: "ሥራ ማመልከቻ ለማቅረብ ይግቡ",
      signupSub: "ሙሉ ለሙሉ ነፃ — ዛሬ ይጀምሩ!",
      name: "ሙሉ ስም",
      email: "ኢሜይል አድራሻ",
      password: "የይለፍ ቃል (ቢያንስ 6 ፊደሎች)",
      submitLogin: "ይግቡ",
      submitSignup: "አካውንት ፍጠር",
      googleBtn: "Google ይጠቀሙ",
      switchToLogin: "አካውንት አለዎት? ይግቡ →",
      switchToSignup: "አካውንት የለዎትም? ይመዝገቡ →",
      loading: "በሂደት ላይ...",
    },
    en: {
      loginTitle: "Welcome Back",
      signupTitle: "Create Free Account",
      loginSub: "Sign in to access your job application",
      signupSub: "Completely free — get started today!",
      name: "Full Name",
      email: "Email Address",
      password: "Password (min 6 characters)",
      submitLogin: "Sign In",
      submitSignup: "Create Account",
      googleBtn: "Continue with Google",
      switchToLogin: "Already have an account? Sign In →",
      switchToSignup: "No account yet? Register Free →",
      loading: "Processing...",
    },
  };

  const l = labels[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
      onAuthSuccess?.();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { isAdmin } = await loginWithGoogle();
      onClose();
      if (isAdmin) {
        router.push("/admin");
      } else {
        onAuthSuccess?.();
      }
    } catch (err: any) {
      setError(err.message || "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
              !isSignUp ? "bg-white text-blue-700 border-b-2 border-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LogIn className="w-4 h-4" />
            {lang === "am" ? "ይግቡ" : "Sign In"}
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
              isSignUp ? "bg-white text-blue-700 border-b-2 border-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {lang === "am" ? "ይመዝገቡ" : "Register"}
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{isSignUp ? l.signupTitle : l.loginTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">{isSignUp ? l.signupSub : l.loginSub}</p>
          </div>

          {/* Demo notice */}
          {!isConfigured && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <span>{lang === "am" ? "ሙከራ ሁነታ — ማንኛውንም ኢሜይል እና የይለፍ ቃል ይጠቀሙ" : "Demo mode — use any email & password to test."}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all mb-5 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            {l.googleBtn}
          </button>

          <div className="relative flex items-center my-4">
            <div className="flex-1 border-t border-gray-100" />
            <span className="px-3 text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 border-t border-gray-100" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{l.name} *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Abebe Kebede"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{l.email} *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{l.password} *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? l.loading : isSignUp ? <><UserPlus className="w-4 h-4" />{l.submitSignup}</> : <><LogIn className="w-4 h-4" />{l.submitLogin}</>}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-gray-500">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-semibold hover:underline">
              {isSignUp ? l.switchToLogin : l.switchToSignup}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

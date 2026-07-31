"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, Lock, User, Sparkles, AlertCircle, LogIn, UserPlus } from "lucide-react";
import { Language } from "@/lib/translations";

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
      signupTitle: "አካውንት ይፍጠሩ",
      loginSub: "ለማመልከቻ ቅጽ ሙሌት ወደ ሂሳብዎ ይግቡ",
      signupSub: "ቀላሉ እና ፈጣን ምዝገባ — ዛሬ ማመልከቻዎን ይጀምሩ!",
      name: "ሙሉ ስም (Full Name)",
      email: "ኢሜይል አድራሻ (Email)",
      password: "የይለፍ ቃል (Password)",
      submitLogin: "ይግቡ",
      submitSignup: "አካውንት ይፍጠሩ",
      googleBtn: "Google ይጠቀሙ",
      switchToLogin: "አስቀድሞ አካውንት አለዎት? ይግቡ",
      switchToSignup: "አካውንት የለዎትም? አዲስ ይፍጠሩ",
      loading: "በሂደት ላይ...",
    },
    en: {
      loginTitle: "Sign In to Your Account",
      signupTitle: "Create Your Account",
      loginSub: "Sign in to access and submit your application form",
      signupSub: "Quick registration — Start your job application today!",
      name: "Full Name",
      email: "Email Address",
      password: "Password",
      submitLogin: "Sign In",
      submitSignup: "Create Account",
      googleBtn: "Continue with Google",
      switchToLogin: "Already have an account? Sign In",
      switchToSignup: "No account yet? Register Now",
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
      setError(err.message || "Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      onAuthSuccess?.();
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher (top) */}
        <div className="flex border-b border-slate-800 mt-1">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
              !isSignUp
                ? "bg-slate-900 text-sky-400 border-b-2 border-sky-500"
                : "bg-slate-950/50 text-slate-500 hover:text-slate-300"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{lang === "am" ? "ይግቡ" : "Sign In"}</span>
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
              isSignUp
                ? "bg-slate-900 text-indigo-400 border-b-2 border-indigo-500"
                : "bg-slate-950/50 text-slate-500 hover:text-slate-300"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === "am" ? "አካውንት ይፍጠሩ" : "Sign Up"}</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {isSignUp ? l.signupTitle : l.loginTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp ? l.signupSub : l.loginSub}
            </p>
          </div>

          {/* Demo mode notice */}
          {!isConfigured && (
            <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                {lang === "am"
                  ? "ሙከራ ሁነታ ነው። ማንኛውንም ኢሜይል እና የይለፍ ቃል ይጠቀሙ።"
                  : "Demo mode — use any email & password to test."}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 hover:border-slate-600 transition-all mb-4 disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>{l.googleBtn}</span>
          </button>

          <div className="relative flex items-center my-4">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-3 bg-slate-900 text-xs text-slate-500 font-medium">OR</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{l.name} *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Abebe Kebede"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{l.email} *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{l.password} *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 ${
                isSignUp
                  ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:brightness-110 shadow-indigo-500/25"
                  : "bg-gradient-to-r from-sky-500 via-indigo-600 to-blue-700 hover:brightness-110 shadow-sky-500/25"
              }`}
            >
              {loading ? (
                <span>{l.loading}</span>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{l.submitSignup}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{l.submitLogin}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-5 text-center text-xs text-slate-400">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sky-400 font-semibold hover:underline"
            >
              {isSignUp ? l.switchToLogin : l.switchToSignup}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

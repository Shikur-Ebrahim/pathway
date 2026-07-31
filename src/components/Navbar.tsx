"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Language, content } from "@/lib/translations";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { Send, Menu, X, Globe, Sparkles, UserCheck, LogOut, User as UserIcon } from "lucide-react";

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  onApplyClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, onApplyClick }) => {
  const t = content[lang];
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        {/* Top Urgency Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-bounce" />
          <span>{t.heroBadge}</span>
          <a
            href="https://t.me/pathway_agency"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-sky-200 ml-1"
          >
            @pathway_agency
          </a>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 shadow-lg shadow-sky-500/20 flex items-center justify-center overflow-hidden border border-sky-400/40">
              <Image src="/logo.png" alt="Pathway Agency Logo" width={48} height={48} className="object-contain" priority />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent tracking-tight">
                  Pathway
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Agency
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
                Ethiopia • Graduate Careers
              </p>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setLang("am")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === "am" ? "bg-sky-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                አማርኛ
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === "en" ? "bg-sky-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                English
              </button>
            </div>

            {/* Telegram link */}
            <a
              href="https://t.me/pathway_agency"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-xs border border-sky-500/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>@pathway_agency</span>
            </a>

            {/* Auth-aware CTA */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                {/* Apply button */}
                <button
                  onClick={onApplyClick}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25 hover:brightness-110 active:scale-95 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t.applyOnlineBtn}</span>
                </button>

                {/* User avatar + logout */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-sm overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs text-slate-300 font-medium max-w-[100px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <button
                    onClick={() => logout()}
                    title="Sign Out"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>{lang === "am" ? "ይግቡ / ይመዝገቡ" : "Sign In / Register"}</span>
              </button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLang(lang === "am" ? "en" : "am")}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 text-xs font-bold flex items-center gap-1"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "am" ? "EN" : "አማ"}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 border-b border-slate-800 p-4 space-y-3 animate-fadeIn">
            {user ? (
              <>
                {/* Signed-in state */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-indigo-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {user.displayName || user.email?.split("@")[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => logout()} className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => { setMobileMenuOpen(false); onApplyClick(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t.applyOnlineBtn}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{lang === "am" ? "ይግቡ / አካውንት ይፍጠሩ" : "Sign In / Create Account"}</span>
                </button>
              </>
            )}

            <a
              href="https://t.me/pathway_agency"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 text-sky-400 font-bold text-sm border border-sky-500/30"
            >
              <Send className="w-4 h-4" />
              <span>{t.applyTelegramBtn}</span>
            </a>
          </div>
        )}
      </header>

      {/* Standalone Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        lang={lang}
        defaultMode="signup"
      />
    </>
  );
};

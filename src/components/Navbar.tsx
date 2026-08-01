"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Language, content } from "@/lib/translations";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { Send, Menu, X, Globe, LogOut, User as UserIcon, ChevronDown, Briefcase, FileText } from "lucide-react";

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  onApplyClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, onApplyClick }) => {
  const t = content[lang];
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-blue-100 bg-white shadow-sm group-hover:shadow-md transition-shadow">
              <Image src="/logo.png" alt="Pathway Agency" width={40} height={40} className="object-contain p-0.5" priority />
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-800 font-extrabold text-blue-700 tracking-tight">Pathway</span>
              <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest -mt-0.5">Agency Ethiopia</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#sectors" className="hover:text-blue-600 transition-colors">Job Categories</a>
            <a href="/requirements" className="hover:text-blue-600 transition-colors">Requirements</a>
            <a href="https://t.me/pathway_agency" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Send className="w-3.5 h-3.5" />
              Telegram
            </a>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setLang("am")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${lang === "am" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                አማርኛ
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${lang === "en" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {user.photoURL
                      ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/default-avatar.jpg"; e.currentTarget.onerror = null; }} />
                      : <UserIcon className="w-4 h-4 text-blue-600" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <a
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors border-b border-gray-50"
                      >
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        Admin Dashboard
                      </a>
                    )}
                    <button
                      onClick={() => { setUserMenuOpen(false); onApplyClick(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Apply for Job
                    </button>
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  Register Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-200 shadow-sm"
                >
                  {user.photoURL ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/default-avatar.jpg"; e.currentTarget.onerror = null; }} /> : <UserIcon className="w-5 h-5 text-blue-600" />}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-fadeIn z-50">
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                        {user.photoURL ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/default-avatar.jpg"; e.currentTarget.onerror = null; }} /> : <UserIcon className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.displayName || user.email?.split("@")[0]}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="py-2">
                      <button onClick={() => setLang(lang === "am" ? "en" : "am")} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        Language: {lang === "am" ? "አማርኛ" : "English"}
                      </button>
                      <a href="#sectors" onClick={() => setUserMenuOpen(false)} className="flex px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 items-center gap-3">
                        <Briefcase className="w-4 h-4 text-gray-400" /> Job Categories
                      </a>
                      <a href="/requirements" onClick={() => setUserMenuOpen(false)} className="flex px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 items-center gap-3">
                        <Send className="w-4 h-4 text-gray-400" /> Requirements
                      </a>
                    </div>
                    <div className="border-t border-gray-50 pt-2">
                      {isAdmin && (
                        <a
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-blue-50 flex items-center gap-3 border-b border-gray-50"
                        >
                          <Briefcase className="w-4 h-4 text-blue-600" /> Admin Dashboard
                        </a>
                      )}
                      <button
                        onClick={() => { setUserMenuOpen(false); onApplyClick(); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50 flex items-center gap-3"
                      >
                        <FileText className="w-4 h-4" /> Apply for Job
                      </button>
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setLang(lang === "am" ? "en" : "am")}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {lang === "am" ? "EN" : "አማ"}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Drawer (Only for Non-Logged In Users) */}
        {!user && mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-3 animate-fadeIn shadow-lg">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
                className="py-3 rounded-xl border border-blue-200 text-blue-700 font-bold text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }}
                className="py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
              >
                Register Free
              </button>
            </div>
            <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
              <a href="#sectors" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 text-sm text-gray-600 font-medium">Job Categories</a>
              <a href="/requirements" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 text-sm text-gray-600 font-medium">Requirements</a>
              <a href="https://t.me/pathway_agency" target="_blank" rel="noopener noreferrer" className="py-2.5 px-2 text-sm text-blue-600 font-medium flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> @pathway_agency
              </a>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} lang={lang} defaultMode="signup" />
    </>
  );
};

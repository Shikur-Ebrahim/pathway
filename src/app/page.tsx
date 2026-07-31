"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { ApplicationModal } from "@/components/ApplicationModal";
import { AuthModal } from "@/components/AuthModal";
import { Language, content } from "@/lib/translations";
import { useAuth } from "@/context/AuthContext";
import {
  Send,
  Building2,
  Globe2,
  Plane,
  FileCheck,
  GraduationCap,
  Award,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  Flame,
  Lock,
} from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState<Language>("am");
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();
  const t = content[lang];

  // Auth-gate: if user is logged in → open application form
  //            if not → open auth modal first; after success → open application form
  const handleApplyClick = () => {
    if (user) {
      setIsAppModalOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    // After successful login/signup, auto-open the application form
    setIsAppModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar lang={lang} setLang={setLang} onApplyClick={handleApplyClick} />

      {/* Main Container - Mobile Screen First Priority */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">

        {/* HERO SECTION */}
        <section className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-[#080d1a] border border-slate-800/80 p-5 sm:p-10 text-center shadow-2xl overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white p-2 shadow-2xl shadow-sky-500/30 border-2 border-sky-400/50 mb-4 animate-pulseGlow">
              <Image src="/logo.png" alt="Pathway Ethiopia Graduate Careers Logo" width={140} height={140} className="object-contain w-full h-full" priority />
            </div>

            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide mb-3 animate-bounce">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{t.heroBadge}</span>
            </div>

            {/* Headlines */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight max-w-2xl">
              {t.heroTitle}
            </h1>
            <p className="text-base sm:text-xl font-semibold bg-gradient-to-r from-sky-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent mt-2 max-w-xl">
              {t.heroSub}
            </p>
            <p className="text-xs sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
              {t.heroDesc}
            </p>

            {/* Seat Progress Bar */}
            <div className="w-full max-w-md mt-6 space-y-2 text-left bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-sky-400">🔥 10,000 Limited Seats</span>
                <span className="text-amber-400 font-mono">78% Filled</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 h-full w-[78%] rounded-full animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400 text-center font-medium">{t.seatsTaken}</p>
            </div>

            {/* ─── AUTH-GATED APPLY BUTTON ─── */}
            <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                onClick={handleApplyClick}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-sky-500/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {user ? (
                  <>
                    <UserCheck className="w-5 h-5" />
                    <span>{t.applyOnlineBtn}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>
                      {lang === "am" ? "ለማመልከት ይግቡ / ይመዝገቡ" : "Sign In / Register to Apply"}
                    </span>
                  </>
                )}
              </button>

              <a
                href="https://t.me/pathway_agency"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-sky-400 font-extrabold text-sm border border-sky-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t.applyTelegramBtn}</span>
              </a>
            </div>

            {/* "Login required" hint when not signed in */}
            {!user && (
              <p className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-500" />
                {lang === "am"
                  ? "ቅጽ ለመሙላት አካውንት ያስፈልጋል — ምዝገባ ነፃ እና ፈጣን ነው!"
                  : "Account required to submit form — registration is free & instant!"}
              </p>
            )}

            {/* Signed-in welcome strip */}
            {user && (
              <div className="mt-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {lang === "am"
                  ? `ሰላም ${user.displayName || user.email?.split("@")[0]}! ማመልከቻዎን ለመሙላት ዝግጁ ነዎት።`
                  : `Welcome ${user.displayName || user.email?.split("@")[0]}! You can now submit your application.`}
              </div>
            )}
          </div>
        </section>

        {/* 4 CAREER SECTORS */}
        <section className="space-y-4">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>{t.sectorsTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">{t.sectorsSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Building2, color: "sky", title: t.sector1Title, desc: t.sector1Desc, tag: "አስተዳደር | ፅህፈት | ቴክኒክ" },
              { icon: Globe2, color: "indigo", title: t.sector2Title, desc: t.sector2Desc, tag: "ከ 0 ዓመት እስከ ልምድ ያላቸው" },
              { icon: Plane, color: "cyan", title: t.sector3Title, desc: t.sector3Desc, tag: "አየር መንገድ | ሎጅስቲክስ | ኦፕሬሽን" },
              { icon: Globe2, color: "purple", title: t.sector4Title, desc: t.sector4Desc, tag: "ህጋዊና አስተማማኝ እድሎች" },
            ].map(({ icon: Icon, color, title, desc, tag }) => (
              <div
                key={title}
                className={`bg-slate-900/90 border border-slate-800/90 hover:border-${color}-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-${color}-500/10 flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{desc}</p>
                </div>
                <div className={`mt-4 pt-3 border-t border-slate-800 text-[11px] font-semibold text-${color}-400 flex items-center justify-between`}>
                  <span>{tag}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REQUIREMENTS */}
        <section className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <FileCheck className="w-6 h-6 text-sky-400" />
              <span>{t.reqTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.reqSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Fresh Graduates */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-extrabold">{t.freshBadge}</span>
                <GraduationCap className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">{t.freshTitle}</h3>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {[t.fresh1, t.fresh2, t.fresh3, t.fresh4, t.fresh5].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${i === 2 ? "text-amber-400" : "text-sky-400"}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experienced */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-extrabold">{t.expBadge}</span>
                <Award className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">{t.expTitle}</h3>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {[t.exp1, t.exp2, t.exp3, t.exp4, t.exp5].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* MISSION BANNER */}
        <section className="relative rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-2xl text-center space-y-2 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-8xl pointer-events-none select-none">PATHWAY</div>
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block">{t.missionTitle}</span>
          <h3 className="text-lg sm:text-2xl font-black leading-snug max-w-xl mx-auto">&quot;{t.missionText}&quot;</h3>
        </section>

        {/* CONTACT / CTA SECTION */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
            <PhoneCall className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">{t.contactTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">{t.contactSub}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <a
              href="https://t.me/pathway_agency"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm shadow-xl shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>@pathway_agency</span>
            </a>

            {/* Auth-gated Apply button in contact section */}
            <button
              onClick={handleApplyClick}
              className="w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-100 font-extrabold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              {user ? (
                <>
                  <UserCheck className="w-5 h-5 text-sky-400" />
                  <span>{lang === "am" ? "ቅጽ ሙሉ" : "Fill Form"}</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-slate-400" />
                  <span>{lang === "am" ? "ለማመልከት ይግቡ" : "Sign In to Apply"}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pathway Agency Ethiopia • Official Career Placement</span>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Image src="/logo.png" alt="Pathway Logo" width={24} height={24} className="rounded-md" />
            <span className="font-bold text-slate-300 text-sm">Pathway Agency</span>
          </div>
          <p>© {new Date().getFullYear()} Pathway Agency Ethiopia. All rights reserved.</p>
          <p className="text-[11px]">Connecting 10,000 Ethiopian graduates and professionals with Embassy, NGO, Aviation, and International jobs.</p>
        </div>
      </footer>

      {/* ─── MODALS ─── */}
      {/* Auth Modal: shown when user clicks Apply without being signed in */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        lang={lang}
        defaultMode="signup"
      />

      {/* Application Form Modal: only shown after auth */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}

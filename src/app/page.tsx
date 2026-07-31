"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { ApplicationModal } from "@/components/ApplicationModal";
import { AuthModal } from "@/components/AuthModal";
import { Language, content } from "@/lib/translations";
import { useAuth } from "@/context/AuthContext";
import {
  Send, Building2, Globe2, Plane, CheckCircle2, PhoneCall,
  UserCheck, ShieldCheck, ChevronRight, Flame, Lock, ArrowRight,
  Star, Users, Briefcase, Award, GraduationCap,
} from "lucide-react";

const stats = [
  { value: "10,000+", label: "Job Opportunities" },
  { value: "4", label: "Career Sectors" },
  { value: "100%", label: "Legal & Verified" },
  { value: "24hrs", label: "Response Time" },
];

export default function Home() {
  const [lang, setLang] = useState<Language>("am");
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();
  const t = content[lang];

  const handleApplyClick = () => {
    if (user) setIsAppModalOpen(true);
    else setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => setIsAppModalOpen(true);

  const sectors = [
    {
      icon: Building2, emoji: "🏛️",
      title: lang === "am" ? "ኤምባሲዎች" : "Embassies",
      subtitle: "Embassies & Diplomatic Missions",
      desc: lang === "am"
        ? "በኢትዮጵያ ውስጥ በሚገኙ ኤምባሲዎች አስተዳደር፣ ፅህፈት እና የቴክኒክ ስራዎች"
        : "Administrative, secretarial & technical roles in diplomatic missions across Ethiopia.",
      color: "blue",
      bg: "bg-blue-50", border: "border-blue-200", icon_bg: "bg-blue-100", icon_color: "text-blue-600", tag_bg: "bg-blue-100", tag_text: "text-blue-700",
    },
    {
      icon: Globe2, emoji: "🌍",
      title: lang === "am" ? "ዓ/አቀፍ ድርጅቶች" : "NGOs & UN",
      subtitle: "NGOs & UN Agencies",
      desc: lang === "am"
        ? "ከ 0 ዓመት እስከ ልምድ ያላቸው ባለሙያዎች — ዓለም አቀፍ አሰሪዎች ጋር ዕድሎች"
        : "Entry-level to senior roles at international NGOs and United Nations agencies.",
      color: "emerald",
      bg: "bg-emerald-50", border: "border-emerald-200", icon_bg: "bg-emerald-100", icon_color: "text-emerald-600", tag_bg: "bg-emerald-100", tag_text: "text-emerald-700",
    },
    {
      icon: Plane, emoji: "✈️",
      title: lang === "am" ? "አቪዬሽን" : "Aviation",
      subtitle: "Airport & Aviation Operations",
      desc: lang === "am"
        ? "የአየር መንገድ፣ ኤርፖርት ሎጅስቲክስ፣ ደንበኞች አገልግሎት እና ኦፕሬሽን ስራዎች"
        : "Airline, airport logistics, passenger services and aviation operations positions.",
      color: "sky",
      bg: "bg-sky-50", border: "border-sky-200", icon_bg: "bg-sky-100", icon_color: "text-sky-600", tag_bg: "bg-sky-100", tag_text: "text-sky-700",
    },
    {
      icon: Globe2, emoji: "🌐",
      title: lang === "am" ? "የውጭ ሀገር ስራ" : "International",
      subtitle: "Foreign & International Jobs",
      desc: lang === "am"
        ? "ህጋዊና አስተማማኝ የውጭ ሀገር የስራ እድሎች ከተሟላ ድጋፍ ጋር"
        : "Legal, verified international job opportunities with full documentation support.",
      color: "purple",
      bg: "bg-purple-50", border: "border-purple-200", icon_bg: "bg-purple-100", icon_color: "text-purple-600", tag_bg: "bg-purple-100", tag_text: "text-purple-700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar lang={lang} setLang={setLang} onApplyClick={handleApplyClick} />

      <main className="flex-1">

        {/* ── HERO SECTION ───────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-indigo-300 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

              {/* Left: Text Content */}
              <div className="flex-1 text-center lg:text-left space-y-6">
                {/* Urgency Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm text-sm font-semibold">
                  <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>{t.heroBadge}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                  {lang === "am"
                    ? <>ሕልምዎን ወደ <span className="text-amber-300">ሙያ</span> ይቀይሩ</>
                    : <>Turn Your Dreams Into a <span className="text-amber-300">Career</span></>
                  }
                </h1>

                <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {t.heroDesc}
                </p>

                {/* Seats Progress */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 max-w-sm mx-auto lg:mx-0">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-blue-100 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 10,000 Slots Total</span>
                    <span className="text-amber-300">7,845 Registered</span>
                  </div>
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full w-[78%]" />
                  </div>
                  <p className="text-[11px] text-blue-200 mt-1.5 font-medium">⚡ Only 2,155 slots remaining!</p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button
                    onClick={handleApplyClick}
                    className="group flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-amber-50 transition-all shadow-xl hover:shadow-2xl active:scale-95"
                  >
                    {user ? <UserCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    {user
                      ? (lang === "am" ? "ማመልከቻ አስገባ" : "Apply Now")
                      : (lang === "am" ? "ለማመልከት ይመዝገቡ — ነፃ ነው!" : "Register Free & Apply")
                    }
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href="https://t.me/pathway_agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    @pathway_agency
                  </a>
                </div>

                {!user && (
                  <p className="text-[12px] text-blue-200 flex items-center justify-center lg:justify-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {lang === "am" ? "ምዝገባ ሙሉ ለሙሉ ነፃ ነው — ካርድ አያስፈልግም" : "Registration is 100% free — no credit card required"}
                  </p>
                )}

                {user && (
                  <p className="text-sm text-emerald-300 flex items-center justify-center lg:justify-start gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === "am"
                      ? `ሰላም ${user.displayName || user.email?.split("@")[0]}! ዝግጁ ነዎት።`
                      : `Welcome ${user.displayName || user.email?.split("@")[0]}! You're ready to apply.`}
                  </p>
                )}
              </div>

              {/* Right: Logo Card */}
              <div className="flex-shrink-0 flex flex-col items-center gap-5">
                <div className="relative animate-float">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-white shadow-2xl flex items-center justify-center p-4 animate-pulseRing">
                    <Image src="/logo.png" alt="Pathway Agency Ethiopia" width={180} height={180} className="object-contain" priority />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-900 text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg">
                    #1 Agency
                  </div>
                  <div className="absolute -bottom-3 -left-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  <span className="text-sm text-white font-semibold ml-1">Trusted Agency</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ──────────────────────────────────────── */}
        <section className="bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-blue-400">{s.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4 CAREER SECTORS ───────────────────────────────── */}
        <section id="sectors" className="py-14 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-3">Job Categories</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{t.sectorsTitle}</h2>
              <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">{t.sectorsSub}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {sectors.map((s) => (
                <div
                  key={s.title}
                  className={`${s.bg} border-2 ${s.border} rounded-2xl p-6 card-hover cursor-pointer group`}
                  onClick={handleApplyClick}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${s.icon_bg} flex items-center justify-center shrink-0 text-2xl shadow-sm`}>
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{s.subtitle}</h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{s.desc}</p>
                      <span className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-full ${s.tag_bg} ${s.tag_text} text-[11px] font-bold`}>
                        <Briefcase className="w-3 h-3" />
                        {lang === "am" ? "ቅጽ አስገባ" : "Apply Now"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REQUIREMENTS ───────────────────────────────────── */}
        <section id="requirements" className="py-14 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide mb-3">Eligibility</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{t.reqTitle}</h2>
              <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">{t.reqSub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fresh Graduate */}
              <div className="rounded-2xl border-2 border-blue-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Track 1</span>
                    <h3 className="text-lg font-bold mt-0.5">{t.freshTitle}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{t.freshBadge}</div>
                  {[t.fresh1, t.fresh2, t.fresh3, t.fresh4, t.fresh5].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${i === 2 ? "text-amber-500" : "text-blue-500"}`} />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-5">
                  <button onClick={handleApplyClick} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md">
                    <UserCheck className="w-4 h-4" />
                    {lang === "am" ? "አሁን ያመልክቱ" : "Apply for This Track"}
                  </button>
                </div>
              </div>

              {/* Experienced */}
              <div className="rounded-2xl border-2 border-purple-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-purple-700 text-white px-6 py-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-200">Track 2</span>
                    <h3 className="text-lg font-bold mt-0.5">{t.expTitle}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">{t.expBadge}</div>
                  {[t.exp1, t.exp2, t.exp3, t.exp4, t.exp5].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-purple-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-5">
                  <button onClick={handleApplyClick} className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md">
                    <UserCheck className="w-4 h-4" />
                    {lang === "am" ? "አሁን ያመልክቱ" : "Apply for This Track"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION BANNER ─────────────────────────────────── */}
        <section className="py-14 sm:py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest">
              {t.missionTitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              &ldquo;{t.missionText}&rdquo;
            </h2>
            <p className="text-blue-200 text-sm sm:text-base">
              {lang === "am"
                ? "Pathway Agency — ኢትዮጵያ ውስጥ ታማኝ የሙያ አጋርዎ"
                : "Pathway Agency — Your trusted career partner in Ethiopia"}
            </p>
            <button
              onClick={handleApplyClick}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-all shadow-xl mt-2"
            >
              {user ? <UserCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              {user
                ? (lang === "am" ? "ሙሉ ቅጽ አስገባ" : "Submit Application")
                : (lang === "am" ? "ዛሬ ይጀምሩ — ነፃ ነው!" : "Get Started — It's Free!")
              }
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ── CONTACT SECTION ────────────────────────────────── */}
        <section className="py-14 sm:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{t.contactTitle}</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">{t.contactSub}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <a
                href="https://t.me/pathway_agency"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Send className="w-5 h-5" />
                @pathway_agency
              </a>
              <button
                onClick={handleApplyClick}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 font-bold text-sm hover:bg-blue-50 transition-all shadow-sm"
              >
                {user ? <UserCheck className="w-5 h-5 text-blue-600" /> : <Lock className="w-5 h-5 text-gray-400" />}
                {lang === "am" ? "ቅጽ አስገባ" : "Online Form"}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 pt-4 border-t border-gray-200">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500" /> Legal & Verified</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Free Registration</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> Trusted Agency</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white overflow-hidden flex items-center justify-center p-1">
                <Image src="/logo.png" alt="Pathway" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Pathway Agency Ethiopia</p>
                <p className="text-[11px]">Ethiopia • Graduate Careers • Since 2024</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <a href="#sectors" className="hover:text-white transition-colors">Job Categories</a>
              <a href="#requirements" className="hover:text-white transition-colors">Requirements</a>
              <a href="https://t.me/pathway_agency" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <Send className="w-3 h-3" /> Telegram
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs">
            <p>© {new Date().getFullYear()} Pathway Agency Ethiopia. All rights reserved.</p>
            <p className="mt-1 text-gray-600">Connecting 10,000 Ethiopian graduates with Embassy, NGO, Aviation & International opportunities.</p>
          </div>
        </div>
      </footer>

      {/* ── MODALS ─────────────────────────────────────────── */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={handleAuthSuccess} lang={lang} defaultMode="signup" />
      <ApplicationModal isOpen={isAppModalOpen} onClose={() => setIsAppModalOpen(false)} lang={lang} />
    </div>
  );
}

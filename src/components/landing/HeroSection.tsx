"use client";

import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowRight, Search, Briefcase, Globe2, Star, ShieldCheck } from "lucide-react";
import { content, Language } from "@/lib/translations";

export const HeroSection = ({ onApplyClick, onBrowseJobs, lang }: { onApplyClick: () => void; onBrowseJobs: () => void; lang: Language }) => {
  const t = content[lang];
  const stats = [
    { num: 10000, suffix: "+", label: t.heroStatJobs, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { num: 200, suffix: "+", label: t.heroStatActive, icon: Search, color: "text-purple-600", bg: "bg-purple-100" },
    { num: 4, suffix: "", label: t.heroStatOrgs, icon: Globe2, color: "text-indigo-600", bg: "bg-indigo-100" },
    { num: 98, suffix: "%", label: t.heroStatRate, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-100" }
  ];

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-12 pb-16 md:pt-20 lg:pt-32 lg:pb-24">
      <motion.div animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-[-10%] w-72 h-72 lg:w-96 lg:h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <motion.div animate={{ y: [0, 40, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 right-[-10%] w-80 h-80 lg:w-[30rem] lg:h-[30rem] bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-5 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 w-full text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 lg:mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
                <Star className="w-4 h-4 fill-blue-600" />
                <span>{t.heroBadge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black text-gray-900 tracking-tighter leading-[1.1] mb-6">
                {lang === "am" ? (
                  <>ህልምዎን ያሳካሉ <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ሙያ ዛሬ</span></>
                ) : (
                  <>Secure Your <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dream Job</span>{" "}Today</>
                )}
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">{t.heroSub}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 lg:mb-0">
              <button onClick={onApplyClick} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[16px] md:text-lg shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all">
                {t.heroApplyBtn} <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={onBrowseJobs} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-800 font-bold text-[16px] md:text-lg shadow-sm hover:border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all">
                <Search className="w-5 h-5 text-gray-400" /> {t.heroBrowseBtn}
              </button>
            </motion.div>
          </div>

          <div className="flex-1 w-full max-w-lg mx-auto lg:max-w-none">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-4 md:gap-6 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-[2.5rem] opacity-50 blur-2xl -z-10" />
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all group">
                  <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1 tracking-tight">
                    <CountUp end={stat.num} duration={2.5} separator="," />{stat.suffix}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

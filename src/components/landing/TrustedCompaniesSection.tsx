"use client";

import React from "react";
import { motion } from "framer-motion";
import { Language } from "@/lib/translations";

const COMPANIES = ["UNICEF", "WHO", "USAID", "Ethiopian Airlines", "Canadian Embassy", "British Council", "Save the Children", "World Bank"];

export const TrustedCompaniesSection = ({ lang }: { lang: Language }) => {
  return (
    <section className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto pt-4 pb-12 bg-white overflow-hidden border-b border-gray-100">
      <p className="text-center text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-6">
        {lang === "am" ? "በምርጥ ድርጅቶች የታመነ" : lang === "or" ? "Dhaabbilee Gurguddoon Kan Amaname" : "Trusted By Top Organizations"}
      </p>
      <div className="relative w-full flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, ease: "linear", repeat: Infinity }} className="flex gap-8 whitespace-nowrap px-4">
          {[...COMPANIES, ...COMPANIES].map((company, idx) => (
            <div key={idx} className="text-[20px] font-black text-gray-300">{company}</div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

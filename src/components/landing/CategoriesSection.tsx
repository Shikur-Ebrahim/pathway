"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { content, Language } from "@/lib/translations";

const CATEGORIES = [
  { id: "embassy", emoji: "🏛️", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80", color: "from-blue-600/80 to-cyan-600/80" },
  { id: "ngo", emoji: "🌍", image: "https://images.unsplash.com/photo-1531496730074-83b638c0a7ac?auto=format&fit=crop&w=800&q=80", color: "from-emerald-600/80 to-teal-600/80" },
  { id: "aviation", emoji: "✈️", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80", color: "from-purple-600/80 to-indigo-600/80" },
  { id: "international", emoji: "🌐", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", color: "from-rose-600/80 to-pink-600/80" },
];

export const CategoriesSection = ({ onSelectCategory, lang }: { onSelectCategory: (cat: string) => void; lang: Language }) => {
  const t = content[lang];
  const catData = [
    { title: t.cat1Title, desc: t.cat1Desc },
    { title: t.cat2Title, desc: t.cat2Desc },
    { title: t.cat3Title, desc: t.cat3Desc },
    { title: t.cat4Title, desc: t.cat4Desc },
  ];

  return (
    <section id="sectors" className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto py-12 px-5 bg-white">
      <div className="mb-8">
        <h2 className="text-[28px] sm:text-[32px] font-black text-gray-900 tracking-tight leading-tight">{t.categoriesTitle}</h2>
      </div>
      <div className="flex flex-col gap-5">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1 }}
            className="relative overflow-hidden rounded-[24px] h-[240px] group cursor-pointer shadow-sm"
            onClick={() => {
              const filterMap: Record<string, string> = { embassy: "Embassy", ngo: "NGO", aviation: "Aviation", international: "International" };
              onSelectCategory(filterMap[cat.id]);
            }}
          >
            <img src={cat.image} alt={catData[idx].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} mix-blend-multiply opacity-70`} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/50 to-transparent" />
            <div className="relative z-10 flex flex-col h-full p-6 justify-end">
              <h3 className="text-[22px] font-black text-white mb-2 tracking-tight drop-shadow-md">{catData[idx].title}</h3>
              <p className="text-[14px] text-white/90 leading-relaxed drop-shadow">{catData[idx].desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

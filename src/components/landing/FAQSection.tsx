"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { content, Language } from "@/lib/translations";

export const FAQSection = ({ lang }: { lang: Language }) => {
  const t = content[lang];
  const [open, setOpen] = useState<number | null>(0);

  const FAQS = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
  ];

  return (
    <section className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto py-16 px-5 bg-white">
      <div className="mb-10">
        <h2 className="text-[28px] sm:text-[32px] font-black text-gray-900 tracking-tight leading-tight">{t.faqTitle}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
            <button onClick={() => setOpen(open === idx ? null : idx)} className="w-full flex items-center justify-between p-5 text-left bg-white">
              <span className="text-[15px] font-bold text-gray-900 pr-4">{faq.q}</span>
              {open === idx ? <Minus className="w-5 h-5 text-blue-600 shrink-0" /> : <Plus className="w-5 h-5 text-gray-400 shrink-0" />}
            </button>
            <AnimatePresence>
              {open === idx && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-5 pt-2 text-[14px] text-gray-600 leading-relaxed">{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

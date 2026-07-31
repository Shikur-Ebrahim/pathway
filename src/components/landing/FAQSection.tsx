"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  { q: "Is registration really free?", a: "Yes! Registration and creating a profile on Pathway is 100% free for all job seekers." },
  { q: "How do I apply for a job?", a: "Once you create your account and complete your profile, you can easily apply to any verified job with a single click." },
  { q: "Are the international jobs verified?", a: "Absolutely. We strictly vet every employer, especially for foreign employment, to ensure your safety and security." },
  { q: "Can I edit my profile later?", a: "Yes, you can update your CV, experience, and contact information at any time from your dashboard." }
];

export const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full max-w-[430px] mx-auto py-16 px-5 bg-white">
      <div className="mb-10">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">Common <br /> Questions</h2>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left bg-white"
            >
              <span className="text-[15px] font-bold text-gray-900 pr-4">{faq.q}</span>
              {open === idx ? (
                <Minus className="w-5 h-5 text-blue-600 shrink-0" />
              ) : (
                <Plus className="w-5 h-5 text-gray-400 shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {open === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-2 text-[14px] text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

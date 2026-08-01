"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, FileEdit, UploadCloud, Send, Users, Award } from "lucide-react";
import { content, Language } from "@/lib/translations";

const ICONS = [UserPlus, FileEdit, UploadCloud, Send, Users, Award];

export const ProcessTimelineSection = ({ lang }: { lang: Language }) => {
  const t = content[lang];
  const STEPS = [
    { title: t.step1Title, desc: t.step1Desc },
    { title: t.step2Title, desc: t.step2Desc },
    { title: t.step3Title, desc: t.step3Desc },
    { title: t.step4Title, desc: t.step4Desc },
    { title: t.step5Title, desc: t.step5Desc },
    { title: t.step6Title, desc: t.step6Desc },
  ];

  return (
    <section className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto py-16 px-5 bg-blue-50/50">
      <div className="mb-12">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight mb-2">{t.processTitle}</h2>
        <p className="text-[14px] text-gray-500">{t.processSub}</p>
      </div>
      <div className="relative pl-6">
        <div className="absolute left-[39px] top-4 bottom-10 w-0.5 bg-blue-200" />
        <div className="space-y-8">
          {STEPS.map((step, idx) => {
            const Icon = ICONS[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex items-start gap-6"
              >
                <div className="relative z-10 w-10 h-10 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="pt-1.5 pb-2">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

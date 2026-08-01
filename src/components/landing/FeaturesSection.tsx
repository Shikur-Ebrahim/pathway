"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, HeartHandshake, Gift, Lock, Smartphone } from "lucide-react";
import { content, Language } from "@/lib/translations";

const ICONS = [ShieldCheck, Zap, HeartHandshake, Gift, Lock, Smartphone];
const COLORS = ["text-blue-500", "text-purple-500", "text-rose-500", "text-emerald-500", "text-indigo-500", "text-orange-500"];
const BGS = ["bg-blue-50", "bg-purple-50", "bg-rose-50", "bg-emerald-50", "bg-indigo-50", "bg-orange-50"];

export const FeaturesSection = ({ lang }: { lang: Language }) => {
  const t = content[lang];
  const featureTitles = [t.feat1, t.feat2, t.feat3, t.feat4, t.feat5, t.feat6];

  return (
    <section className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto py-16 px-5 bg-gray-50/50">
      <div className="text-center mb-10">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight mb-3">{t.featuresTitle}</h2>
        <p className="text-[14px] text-gray-500">{t.featuresSub}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {featureTitles.map((title, idx) => {
          const Icon = ICONS[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl ${BGS[idx]} ${COLORS[idx]} flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-900">{title}</h3>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

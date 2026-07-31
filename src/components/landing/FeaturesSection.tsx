"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, HeartHandshake, Gift, Lock, Smartphone } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, title: "Verified Employers", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Zap, title: "Fast Applications", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: HeartHandshake, title: "Career Support", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: Gift, title: "100% Guaranteed", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Lock, title: "Secure Documents", color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Smartphone, title: "Mobile Friendly", color: "text-orange-500", bg: "bg-orange-50" },
];

export const FeaturesSection = () => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-16 px-5 bg-gray-50/50">
      <div className="text-center mb-10">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight mb-3">
          Why Choose <br /> Pathway?
        </h2>
        <p className="text-[14px] text-gray-500">Everything you need to land your dream job, built into one seamless platform.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-900">{feat.title}</h3>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

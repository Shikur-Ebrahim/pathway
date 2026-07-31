"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "embassy",
    title: "Embassies & Missions",
    desc: "Administrative, Secretarial, Finance, IT and Technical Positions.",
    emoji: "🏛️",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
  },
  {
    id: "ngo",
    title: "NGOs & UN Agencies",
    desc: "Development, Humanitarian, Project Management and Administration.",
    emoji: "🌍",
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
  },
  {
    id: "aviation",
    title: "Aviation & Airports",
    desc: "Airport Operations, Customer Service, Ground Handling and Logistics.",
    emoji: "✈️",
    gradient: "from-purple-500 to-indigo-500",
    bgLight: "bg-purple-50",
  },
  {
    id: "international",
    title: "International Jobs",
    desc: "Verified Employment Opportunities across the globe.",
    emoji: "🌐",
    gradient: "from-rose-500 to-pink-500",
    bgLight: "bg-rose-50",
  }
];

export const CategoriesSection = ({ onApplyClick }: { onApplyClick: () => void }) => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-12 px-5 bg-white">
      <div className="mb-8">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">
          Explore Top <br /> Industries
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1 }}
            className={`relative overflow-hidden rounded-[24px] p-6 border-2 border-transparent hover:border-gray-100 transition-all ${cat.bgLight}`}
          >
            {/* Background Blob */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${cat.gradient} opacity-10 blur-2xl`} />

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-5">
                {cat.emoji}
              </div>
              
              <h3 className="text-[20px] font-black text-gray-900 mb-2 tracking-tight">
                {cat.title}
              </h3>
              
              <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                {cat.desc}
              </p>

              <button 
                onClick={onApplyClick}
                className="mt-auto self-start flex items-center gap-2 text-[14px] font-bold text-gray-900 hover:text-blue-600 transition-colors group"
              >
                Browse Jobs 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

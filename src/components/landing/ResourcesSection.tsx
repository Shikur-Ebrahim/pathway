"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const RESOURCES = [
  {
    title: "Resume Writing Tips",
    desc: "How to craft a CV that gets you hired.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
    color: "from-orange-500/80 to-red-600/80"
  },
  {
    title: "Interview Preparation",
    desc: "Aces your next Embassy or NGO interview.",
    image: "https://images.unsplash.com/photo-1573497491208-6f16bfc752e0?auto=format&fit=crop&w=600&q=80",
    color: "from-blue-500/80 to-indigo-600/80"
  },
  {
    title: "International Scholarships",
    desc: "Opportunities to study and work abroad.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    color: "from-emerald-500/80 to-teal-600/80"
  }
];

export const ResourcesSection = () => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-16 bg-white overflow-hidden">
      <div className="px-5 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">Career Resources</h2>
          <p className="text-[14px] text-gray-500 mt-1">Tools to help you succeed.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 px-5 pb-8 hide-scrollbar snap-x snap-mandatory">
        {RESOURCES.map((res, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-[280px] h-[320px] shrink-0 rounded-[24px] overflow-hidden snap-center relative group"
          >
            <img src={res.image} alt={res.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${res.color} mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5">
              <h3 className="text-white font-bold text-[20px] mb-2 leading-tight">{res.title}</h3>
              <p className="text-white/80 text-[13px] mb-4">{res.desc}</p>
              <button className="flex items-center gap-2 text-white text-[13px] font-bold">
                Read Article <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const STORIES = [
  {
    name: "Yordanos T.",
    role: "Admin Assistant",
    before: "Fresh Graduate",
    after: "Hired at UN Agency",
    salary: "+150% Increase",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1bfd8c?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Dawit M.",
    role: "Ground Operations",
    before: "Unemployed (6 mos)",
    after: "Hired at Bole Intl Airport",
    salary: "Stable Income",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Selamawit B.",
    role: "Project Manager",
    before: "Local NGO",
    after: "International Embassy",
    salary: "+200% Increase",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  }
];

export const SuccessStoriesSection = () => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-16 bg-white overflow-hidden">
      <div className="px-5 mb-8">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">
          Success Stories
        </h2>
        <p className="text-[14px] text-gray-500 mt-2">Real Ethiopian professionals who found their dream careers through Pathway.</p>
      </div>

      <div className="flex overflow-x-auto gap-4 px-5 pb-8 hide-scrollbar snap-x snap-mandatory">
        {STORIES.map((story, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-[300px] shrink-0 bg-white border border-gray-100 rounded-[24px] shadow-lg shadow-gray-200/40 p-5 snap-center relative"
          >
            <div className="flex items-center gap-4 mb-6">
              <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
              <div>
                <h3 className="font-bold text-gray-900 text-[16px]">{story.name}</h3>
                <p className="text-[13px] font-medium text-blue-600">{story.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Before</p>
                <p className="text-[14px] font-medium text-gray-700">{story.before}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-[11px] text-blue-400 font-bold uppercase tracking-wider mb-1">After Pathway</p>
                <p className="text-[14px] font-bold text-gray-900">{story.after}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[13px] font-bold">{story.salary}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

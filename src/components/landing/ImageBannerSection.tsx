"use client";

import React from "react";
import { motion } from "framer-motion";

const images = [
  { url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80", title: "Office Environment" },
  { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80", title: "Professional Teamwork" },
  { url: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80", title: "Career Growth" },
  { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", title: "Job Interviews" },
];

export const ImageBannerSection = () => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-12 overflow-hidden bg-white">
      <div className="pl-5 mb-6">
        <h2 className="text-[24px] font-black text-gray-900 tracking-tight">
          Life at Top Companies
        </h2>
        <p className="text-[14px] text-gray-500 mt-1">Discover where your next career could take you.</p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 px-5 pb-6 hide-scrollbar snap-x snap-mandatory">
        {images.map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative w-[280px] h-[320px] shrink-0 rounded-3xl overflow-hidden snap-center bg-gray-100 shadow-sm"
          >
            <img 
              src={img.url} 
              alt={img.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-5 left-5 right-5">
              <h3 className="text-white font-bold text-[18px]">{img.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

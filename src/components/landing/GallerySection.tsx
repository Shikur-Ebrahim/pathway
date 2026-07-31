"use client";

import React from "react";
import { motion } from "framer-motion";

const IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80"
];

export const GallerySection = () => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-16 bg-white overflow-hidden">
      <div className="px-5 mb-8 text-center">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">Life in Action</h2>
        <p className="text-[14px] text-gray-500 mt-2">Professional moments across industries.</p>
      </div>

      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {/* Top Full Width */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-2 rounded-[24px] overflow-hidden h-[200px]"
          >
            <img src={IMAGES[0]} alt="Gallery" className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Two small */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[20px] overflow-hidden h-[160px]"
          >
            <img src={IMAGES[1]} alt="Gallery" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[20px] overflow-hidden h-[160px]"
          >
            <img src={IMAGES[2]} alt="Gallery" className="w-full h-full object-cover" />
          </motion.div>

          {/* Bottom Full Width */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-2 rounded-[24px] overflow-hidden h-[240px]"
          >
            <img src={IMAGES[3]} alt="Gallery" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

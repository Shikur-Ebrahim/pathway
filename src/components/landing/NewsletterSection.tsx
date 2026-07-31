"use client";

import React from "react";
import { motion } from "framer-motion";

export const NewsletterSection = () => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-12 px-5 bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-center relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />

        <div className="relative z-10">
          <h2 className="text-[24px] font-black text-white tracking-tight leading-tight mb-3">
            Get Job Alerts
          </h2>
          <p className="text-[13px] text-gray-300 mb-6">Subscribe to receive the latest premium job postings directly in your inbox.</p>
          
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl px-5 py-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-[14px] rounded-2xl px-5 py-4 transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

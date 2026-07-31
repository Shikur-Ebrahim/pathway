"use client";

import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowRight, Search } from "lucide-react";

export const HeroSection = ({ onApplyClick }: { onApplyClick: () => void }) => {
  return (
    <section className="relative w-full max-w-[430px] mx-auto min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-5 pt-24 pb-16">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[-20%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[-10%] w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 w-full">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5"
        >
          <h1 className="text-[44px] font-black text-gray-900 tracking-tighter leading-[1.05]">
            Secure Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Dream Job
            </span>
          </h1>
          <p className="mt-4 text-[15px] text-gray-600 leading-relaxed max-w-[300px]">
            2019 Ethiopian New Year Special. Register today to claim one of the exclusive 10,000 guaranteed job slots!
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 mb-12"
        >
          <button 
            onClick={onApplyClick}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[16px] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-full py-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-800 font-bold text-[16px] hover:border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            Browse Jobs
          </button>
        </motion.div>

        {/* Animated Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { num: 10000, suffix: "+", label: "2019 Job Slots" },
            { num: 200, suffix: "+", label: "Active Jobs" },
            { num: 4, suffix: "", label: "Organizations" },
            { num: 98, suffix: "%", label: "Success Rate" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/60 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm">
              <div className="text-[24px] font-black text-gray-900 mb-0.5">
                <CountUp end={stat.num} duration={2.5} separator="," />{stat.suffix}
              </div>
              <div className="text-[12px] font-medium text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

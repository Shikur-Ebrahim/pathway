"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import { CATEGORY_DATA } from "@/lib/categoryData";
import { useParams, notFound } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const cat = CATEGORY_DATA[slug];

  if (!cat) return notFound();

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto font-sans text-gray-900 pb-24">
      
      {/* Hero */}
      <div className="relative w-full h-[320px] overflow-hidden">
        <img
          src={cat.heroImage}
          alt={cat.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${cat.gradient} opacity-25`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* Back Button */}
        <Link 
          href="/"
          className="absolute top-12 left-5 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[14px] font-bold px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="absolute bottom-6 left-5 right-5">
          <div className="text-[40px] mb-2">{cat.emoji}</div>
          <h1 className="text-[28px] font-black text-white leading-tight tracking-tight">{cat.title}</h1>
          <p className="text-[13px] text-white/80 mt-1">{cat.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 py-8 border-b border-gray-100"
      >
        <h2 className="text-[20px] font-black text-gray-900 mb-3">About This Sector</h2>
        <p className="text-[15px] text-gray-600 leading-relaxed">{cat.description}</p>
      </motion.div>

      {/* Why Join */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-8 border-b border-gray-100"
      >
        <h2 className="text-[20px] font-black text-gray-900 mb-5">Why This Sector?</h2>
        <div className="space-y-3">
          {cat.whyJoin.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[14px] text-gray-700 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Photo Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="px-5 py-8 border-b border-gray-100"
      >
        <h2 className="text-[20px] font-black text-gray-900 mb-5">Life in This Sector</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-2xl overflow-hidden h-[180px]">
            <img src={cat.images[0]} alt="gallery" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden h-[130px]">
            <img src={cat.images[1]} alt="gallery" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden h-[130px]">
            <img src={cat.images[2]} alt="gallery" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>

      {/* Available Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-5 py-8 border-b border-gray-100"
      >
        <h2 className="text-[20px] font-black text-gray-900 mb-5">Available Roles</h2>
        <div className="flex flex-wrap gap-2">
          {cat.roles.map((role, i) => (
            <span key={i} className="text-[13px] font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
              {role}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="px-5 py-8 border-b border-gray-100"
      >
        <h2 className="text-[20px] font-black text-gray-900 mb-5">General Requirements</h2>
        <div className="space-y-3">
          {cat.requirements.map((req, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[12px] font-black flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed">{req}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Companies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 py-8 border-b border-gray-100"
      >
        <h2 className="text-[20px] font-black text-gray-900 mb-5">Top Employers</h2>
        <div className="space-y-3">
          {cat.companies.map((company, i) => (
            <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl">
                  {cat.emoji}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900">{company}</p>
                  <p className="text-[12px] text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 shadow-2xl z-50">
        <Link href="/" className={`w-full py-4 rounded-2xl bg-gradient-to-r ${cat.gradient} text-white font-black text-[16px] flex items-center justify-center gap-2 shadow-lg`}>
          Apply for {cat.emoji} Jobs
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

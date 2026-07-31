"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bookmark, MapPin, DollarSign, Clock, Briefcase } from "lucide-react";

const JOBS = [
  {
    id: 1,
    title: "Senior Project Officer",
    company: "UNICEF Ethiopia",
    logo: "🌍",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    exp: "5+ Years",
    bg: "bg-blue-50",
    color: "text-blue-600"
  },
  {
    id: 2,
    title: "Visa Processing Clerk",
    company: "Canadian Embassy",
    logo: "🍁",
    location: "Addis Ababa, Ethiopia",
    type: "Contract",
    exp: "2+ Years",
    bg: "bg-red-50",
    color: "text-red-600"
  },
  {
    id: 3,
    title: "Customer Service Agent",
    company: "Ethiopian Airlines",
    logo: "✈️",
    location: "Bole Airport, Ethiopia",
    type: "Full-time",
    exp: "0-1 Years",
    bg: "bg-emerald-50",
    color: "text-emerald-600"
  },
  {
    id: 4,
    title: "Operations Manager",
    company: "Emirates Group",
    logo: "🌐",
    location: "Dubai, UAE",
    type: "Full-time",
    exp: "3+ Years",
    bg: "bg-purple-50",
    color: "text-purple-600"
  }
];

export const LatestJobsSection = ({ onApplyClick }: { onApplyClick: () => void }) => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-16 px-5 bg-gray-50/50">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">Latest Jobs</h2>
          <p className="text-[14px] text-gray-500 mt-1">Recently posted opportunities.</p>
        </div>
        <button className="text-[14px] font-bold text-blue-600 hover:text-blue-700">View All</button>
      </div>

      <div className="flex flex-col gap-4">
        {JOBS.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <button className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${job.bg}`}>
                {job.logo}
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-900">{job.title}</h3>
                <p className={`text-[13px] font-medium ${job.color}`}>{job.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                <MapPin className="w-3.5 h-3.5" /> {job.location}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                <Briefcase className="w-3.5 h-3.5" /> {job.type}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                <Clock className="w-3.5 h-3.5" /> {job.exp}
              </div>
            </div>

            <button 
              onClick={onApplyClick}
              className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-[14px] transition-colors"
            >
              Apply Now
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

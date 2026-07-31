"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, FileEdit, UploadCloud, Send, Users, Award } from "lucide-react";

const STEPS = [
  { icon: UserPlus, title: "Register Account", desc: "Pay a small one-time registration fee to access 10,000 verified jobs." },
  { icon: FileEdit, title: "Complete Profile", desc: "Add your education and experience." },
  { icon: UploadCloud, title: "Upload Documents", desc: "Securely upload your CV and ID." },
  { icon: Send, title: "Apply to Jobs", desc: "One-click apply to verified jobs." },
  { icon: Users, title: "Interview", desc: "Meet with top employers directly." },
  { icon: Award, title: "100% Guaranteed!", desc: "We guarantee you get hired in your chosen career field." },
];

export const ProcessTimelineSection = () => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-16 px-5 bg-blue-50/50">
      <div className="mb-12">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight mb-2">How It Works</h2>
        <p className="text-[14px] text-gray-500">Your journey to a better career.</p>
      </div>

      <div className="relative pl-6">
        {/* Vertical Line */}
        <div className="absolute left-[39px] top-4 bottom-10 w-0.5 bg-blue-200" />

        <div className="space-y-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex items-start gap-6"
              >
                <div className="relative z-10 w-10 h-10 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="pt-1.5 pb-2">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

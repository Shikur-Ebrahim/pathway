"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Abebech Tadesse",
    role: "NGO Professional",
    text: "Pathway made it incredibly easy to find verified NGO jobs. I got hired in 3 weeks!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1bfd8c?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Kaleb Dereje",
    role: "Aviation Staff",
    text: "The application wizard is brilliant. It helped me structure my experience perfectly for the airport job.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-16 px-5 bg-gray-50/50">
      <div className="text-center mb-10">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight mb-2">Loved by <br /> Thousands</h2>
        <p className="text-[14px] text-gray-500">Don't just take our word for it.</p>
      </div>

      <div className="flex flex-col gap-4">
        {TESTIMONIALS.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative"
          >
            <div className="absolute top-6 right-6 flex gap-1">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <p className="text-[15px] text-gray-700 leading-relaxed italic mb-6 pr-10">
              "{t.text}"
            </p>

            <div className="flex items-center gap-3">
              <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
              <div>
                <h4 className="text-[14px] font-bold text-gray-900">{t.name}</h4>
                <p className="text-[12px] text-gray-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

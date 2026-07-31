"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const GALLERY_CARDS = [
  {
    slug: "ngo",
    label: "NGOs & UN Agencies",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    span: "col-span-2",
    height: "h-[200px]"
  },
  {
    slug: "embassy",
    label: "Embassies",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    span: "",
    height: "h-[160px]"
  },
  {
    slug: "aviation",
    label: "Aviation",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
    span: "",
    height: "h-[160px]"
  },
  {
    slug: "international",
    label: "International",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    span: "col-span-2",
    height: "h-[240px]"
  }
];

export const GallerySection = () => {
  const router = useRouter();

  return (
    <section className="w-full max-w-[430px] mx-auto py-16 bg-white overflow-hidden">
      <div className="px-5 mb-8">
        <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">Life at Top Companies</h2>
        <p className="text-[14px] text-gray-500 mt-2">Discover where your next career could take you.</p>
      </div>

      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {GALLERY_CARDS.map((card, idx) => (
            <motion.div
              key={card.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`${card.span} ${card.height} rounded-[24px] overflow-hidden relative group cursor-pointer`}
              onClick={() => router.push(`/category/${card.slug}`)}
            >
              <div className="block w-full h-full">
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Label */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="text-white font-black text-[18px] leading-tight drop-shadow">{card.label}</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/40 transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-[12px] text-gray-400 mt-4">Tap any image to explore that sector →</p>
      </div>
    </section>
  );
};

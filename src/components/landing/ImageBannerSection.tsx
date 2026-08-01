"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { content, Language } from "@/lib/translations";

export const ImageBannerSection = ({ lang }: { lang: Language }) => {
  const t = content[lang];
  const router = useRouter();

  // Translated images inline
  const images = [
    { url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80", title: lang === "am" ? "የቢሮ አካባቢ" : lang === "or" ? "Naannoo Biiroo" : "Office Environment", slug: "office-environment" },
    { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80", title: lang === "am" ? "የሙያ ቡድን ሥራ" : lang === "or" ? "Hojii Garee" : "Professional Teamwork", slug: "teamwork" },
    { url: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80", title: lang === "am" ? "የሙያ ዕድገት" : lang === "or" ? "Misooma Ogummaa" : "Career Growth", slug: "career-growth" },
    { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", title: lang === "am" ? "የሥራ ቃለ-መጠይቆች" : lang === "or" ? "Gaafii fi Deebii Hojii" : "Job Interviews", slug: "interviews" },
  ];

  return (
    <section className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto py-12 overflow-hidden bg-white">
      <div className="pl-5 mb-6">
        <h2 className="text-[24px] font-black text-gray-900 tracking-tight">
          {lang === "am" ? "በምርጥ ድርጅቶች ውስጥ ሕይወት" : lang === "or" ? "Jireenya Dhaabbilee Gurguddoo Keessatti" : "Life at Top Companies"}
        </h2>
        <p className="text-[14px] text-gray-500 max-w-lg leading-relaxed mt-1">
          {lang === "am" ? "ቀጣይ ሙያዎ ወዴት ሊወስድዎ እንደሚችሉ ያግኙ።" : lang === "or" ? "Ogummaan kee itti aanaa si geessuu danda'u iddoo argadhu." : "Discover where your next career could take you."}
        </p>
      </div>

      <div className="flex overflow-x-auto gap-4 px-5 pb-6 hide-scrollbar snap-x snap-mandatory">
        {images.map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative w-[280px] h-[320px] shrink-0 rounded-3xl overflow-hidden snap-center bg-gray-100 shadow-sm cursor-pointer group"
            onClick={() => router.push(`/culture/${img.slug}`)}
          >
            <img src={img.url} alt={img.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <h3 className="text-white font-bold text-[18px] drop-shadow">{img.title}</h3>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/40 transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { CULTURE_DATA } from "@/lib/cultureData";
import { useParams, notFound } from "next/navigation";
import { Language } from "@/lib/translations";

export default function CulturePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [lang, setLang] = React.useState<Language>("en");

  React.useEffect(() => {
    const saved = localStorage.getItem("pathway_lang") as Language;
    if (saved) setLang(saved);
  }, []);

  const rawData = CULTURE_DATA[slug];
  if (!rawData) return notFound();

  const dataLang = lang;
  const data = rawData[dataLang];

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto font-sans text-gray-900 pb-24">
      
      {/* Hero */}
      <div className="relative w-full h-[350px] overflow-hidden">
        <img
          src={data.heroImage}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${data.gradient} opacity-30`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Back Button */}
        <Link 
          href="/"
          className="absolute top-12 left-5 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[14px] font-bold px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "am" ? "ተመለስ" : "Back"}
        </Link>

        <div className="absolute bottom-6 left-5 right-5">
          <div className="text-[40px] mb-2">{data.icon}</div>
          <h1 className="text-[32px] font-black text-white leading-tight tracking-tight">{data.title}</h1>
          <p className="text-[14px] text-white/90 mt-2 font-medium">{data.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 py-8 border-b border-gray-100 flex flex-col gap-4"
      >
        {data.description.split('\n\n').map((paragraph: string, i: number) => (
          <p key={i} className="text-[16px] text-gray-700 leading-relaxed font-medium">
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-8 border-b border-gray-100 bg-gray-50/50"
      >
        <h2 className="text-[22px] font-black text-gray-900 mb-6">{lang === "am" ? "ምን እንደሚጠብቁ" : "What to Expect"}</h2>
        <div className="grid gap-4">
          {data.highlights.map((item: { title: string; desc: string }, i: number) => (
            <div key={i} className="flex gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quote Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-5 py-10 border-b border-gray-100 bg-blue-600 text-white text-center"
      >
        <p className="text-[18px] font-medium leading-relaxed italic mb-4">"{data.quote}"</p>
        <p className="text-[14px] font-bold opacity-80">— {data.author}</p>
      </motion.div>

      {/* Photo Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 py-8"
      >
        <h2 className="text-[22px] font-black text-gray-900 mb-5">{lang === "am" ? "በውስጥ በኩል የሚታይ እይታ" : "A Glimpse Inside"}</h2>
        <div className="space-y-4">
          {data.images.map((img: string, i: number) => (
            <div key={i} className="w-full h-[220px] rounded-3xl overflow-hidden shadow-sm">
              <img src={img} alt="gallery" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
        <Link href="/" className={`w-full py-4 rounded-2xl bg-gradient-to-r ${data.gradient} text-white font-black text-[16px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]`}>
          {lang === "am" ? "የሕልምዎን ሥራ ያግኙ" : "Find Your Dream Job"}
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

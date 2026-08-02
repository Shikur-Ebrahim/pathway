"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { RESOURCES_DATA } from "@/lib/resourcesData";
import { useParams, notFound } from "next/navigation";
import { Language } from "@/lib/translations";

export default function ResourceArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [lang, setLang] = React.useState<Language>("am");

  React.useEffect(() => {
    const saved = localStorage.getItem("pathway_lang") as Language;
    if (saved) setLang(saved);
  }, []);

  const rawArticle = RESOURCES_DATA[slug];
  if (!rawArticle) return notFound();

  const articleLang = lang;
  const article = rawArticle[articleLang];

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto font-sans text-gray-900 pb-20">
      
      {/* Hero / Header */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <img
          src={article.heroImage}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${article.gradient} mix-blend-multiply opacity-35`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        {/* Back Button */}
        <Link 
          href="/"
          className="absolute top-12 left-5 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[14px] font-bold px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "am" ? "ተመለስ" : "Back"}
        </Link>

        {/* Article Meta */}
        <div className="absolute bottom-6 left-5 right-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1 text-[12px] font-bold text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md">
              <Tag className="w-3 h-3" /> {article.category}
            </span>
            <span className="flex items-center gap-1 text-[12px] font-medium text-white/80">
              <Clock className="w-3 h-3" /> {article.readTime}
            </span>
          </div>
          <h1 className="text-[28px] font-black text-white leading-tight tracking-tight mb-2">{article.title}</h1>
          <p className="text-[14px] text-white/90 font-medium">{article.subtitle}</p>
        </div>
      </div>

      {/* Article Body */}
      <div className="px-5 py-8 space-y-8">
        <p className="text-[16px] text-gray-700 leading-relaxed font-medium">
          {article.content.introduction}
        </p>

        {article.content.sections.map((section: { heading: string; body: string; bulletPoints?: string[] }, idx: number) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx }}
            className="space-y-3"
          >
            <h2 className="text-[20px] font-black text-gray-900">{section.heading}</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">{section.body}</p>
            {section.bulletPoints && (
              <ul className="list-disc pl-5 space-y-2 mt-3">
                {section.bulletPoints.map((point: string, i: number) => (
                  <li key={i} className="text-[15px] text-gray-600 leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-8">
          <h3 className="text-[16px] font-black text-gray-900 mb-2">{lang === "am" ? "ማጠቃለያ" : "Conclusion"}</h3>
          <p className="text-[15px] text-gray-700 leading-relaxed italic">
            &ldquo;{article.content.conclusion}&rdquo;
          </p>
        </div>
      </div>

      {/* Photo Gallery */}
      {article.images && article.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="px-5 pb-8"
        >
          <h2 className="text-[22px] font-black text-gray-900 mb-5">📸 {lang === "am" ? "የፎቶ ማዕከለ-ስዕላት" : "Photo Gallery"}</h2>
          <div className="grid grid-cols-2 gap-3">
            {article.images.map((img: string, i: number) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl shadow-sm ${i === 0 ? "col-span-2 h-[200px]" : "h-[140px]"}`}
              >
                <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, FileText, BookOpen, Camera, Briefcase, Shield } from "lucide-react";
import { Language } from "@/lib/translations";

const FRESH_GRAD_DOCS = {
  en: [
    { icon: Shield, label: "National ID", desc: "A valid government-issued national identification card." },
    { icon: BookOpen, label: "Cumulative GPA", desc: "Minimum GPA of 2.1 and above from your university or college." },
    { icon: FileText, label: "Standard Resume (CV)", desc: "A professionally written, clearly formatted curriculum vitae." },
    { icon: Camera, label: "Passport Size Photo", desc: "A recent professional passport-size photograph." },
  ],
  am: [
    { icon: Shield, label: "የብሔራዊ መታወቂያ", desc: "በመንግስት የተሰጠ ትክክለኛ የብሔራዊ መታወቂያ ካርድ።" },
    { icon: BookOpen, label: "የተጠራቀመ ውጤት (GPA)", desc: "ከዩኒቨርሲቲዎ ወይም ኮሌጅዎ ቢያንስ 2.1 እና ከዚያ በላይ የሆነ ውጤት።" },
    { icon: FileText, label: "መደበኛ ሲቪ (CV)", desc: "በሙያዊ ሁኔታ የተፃፈ እና ግልጽ የሆነ ሲቪ።" },
    { icon: Camera, label: "የፓስፖርት መጠን ፎቶ", desc: "የቅርብ ጊዜ ሙያዊ የፓስፖርት መጠን ፎቶ።" },
  ]
};

const EXPERIENCED_DOCS = {
  en: [
    { icon: Shield, label: "National ID", desc: "A valid government-issued national identification card." },
    { icon: Briefcase, label: "Work Experience Documents", desc: "Proof of previous employment, reference letters, or experience certificates." },
    { icon: FileText, label: "Professional Resume (CV)", desc: "An up-to-date, modern CV highlighting your key skills and achievements." },
    { icon: Camera, label: "Passport Size Photo", desc: "A recent professional passport-size photograph." },
  ],
  am: [
    { icon: Shield, label: "የብሔራዊ መታወቂያ", desc: "በመንግስት የተሰጠ ትክክለኛ የብሔራዊ መታወቂያ ካርድ።" },
    { icon: Briefcase, label: "የስራ ልምድ ሰነዶች", desc: "የቀድሞ የስራ ቅጥር ማረጋገጫ፣ የማጣቀሻ ደብዳቤዎች ወይም የልምድ የምስክር ወረቀቶች።" },
    { icon: FileText, label: "ሙያዊ ሲቪ (CV)", desc: "ዋና ክህሎቶችዎን እና ስኬቶችዎን የሚያጎላ ወቅታዊ ሲቪ።" },
    { icon: Camera, label: "የፓስፖርት መጠን ፎቶ", desc: "የቅርብ ጊዜ ሙያዊ የፓስፖርት መጠን ፎቶ።" },
  ]
};

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
];

export default function RequirementsPage() {
  const [lang, setLang] = useState<Language>("am");

  useEffect(() => {
    const saved = localStorage.getItem("pathway_lang") as Language;
    if (saved) setLang(saved);
  }, []);

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto font-sans text-gray-900 pb-24">
      {/* Hero */}
      <div className="relative w-full h-[280px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
          alt="Requirements"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-700 to-indigo-900 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <Link
          href="/"
          className="absolute top-12 left-5 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[14px] font-bold px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "am" ? "ተመለስ" : "Back"}
        </Link>

        <div className="absolute bottom-6 left-5 right-5">
          <h1 className="text-[28px] sm:text-[32px] font-black text-white leading-tight tracking-tight">
            {lang === "am" ? "የማመልከቻ መስፈርቶች" : "Application Requirements"}
          </h1>
          <p className="text-[14px] text-white/85 mt-2 font-medium">
            {lang === "am" ? "በPathway ኤጀንሲ በኩል ለህልምዎ ሥራ ለማመልከት የሚፈልጉት ነገር ሁሉ።" : "Everything you need to apply for your dream job through Pathway Agency."}
          </p>
        </div>
      </div>

      {/* Who Can Apply */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 py-8 border-b border-gray-100"
      >
        <h2 className="text-[22px] font-black text-gray-900 mb-2">{lang === "am" ? "ማን ማመልከት ይችላል?" : "Who Can Apply?"}</h2>
        <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
          {lang === "am" 
            ? "Pathway ኤጀንሲ አመልካቾችን ከሁለት ዋና ዋና ምድቦች ይቀበላል። አዲስ ተመራቂም ሆኑ ልምድ ያለው ባለሙያ፣ ለእርስዎ የተረጋገጠ እድል አለ።"
            : "Pathway Agency welcomes applicants from two main categories. Whether you are a fresh graduate or an experienced professional, there is a verified opportunity waiting for you."}
        </p>

        {/* Fresh Graduates Card */}
        <div className="rounded-3xl overflow-hidden mb-5 shadow-sm border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
            <h3 className="text-[18px] font-black text-white">{lang === "am" ? "1. አዲስ ተመራቂዎች" : "1. Fresh Graduates"}</h3>
            <p className="text-[13px] text-blue-100 mt-1">{lang === "am" ? "የ0 ዓመት የስራ ልምድ እድሎች" : "0 Years Experience Opportunities"}</p>
          </div>
          <div className="bg-blue-50 px-5 py-5">
            <p className="text-[14px] text-gray-700 leading-relaxed">
              {lang === "am" 
                ? "ከ2015 – 2018 ዓ.ም የተመረቁ ከሆነ እና በአሁኑ ጊዜ ተቀጥረው የማይሰሩ ከሆነ፣ ለ 0-ዓመት የስራ ልምድ እድሎቻችን ለማመልከት ብቁ ነዎት።"
                : "If you graduated between 2015 – 2018 E.C. and are not currently employed, you are eligible to apply for our 0-year experience job opportunities."}
            </p>
          </div>
        </div>

        {/* Experienced Card */}
        <div className="rounded-3xl overflow-hidden shadow-sm border border-emerald-100">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
            <h3 className="text-[18px] font-black text-white">{lang === "am" ? "2. ልምድ ያላቸው ባለሙያዎች" : "2. Experienced Professionals"}</h3>
            <p className="text-[13px] text-emerald-100 mt-1">{lang === "am" ? "በአሁኑ ጊዜ የሚሰሩ ወይም ከ2015 ዓ.ም በፊት የተመረቁ" : "Currently Employed or Graduated Before 2015 E.C."}</p>
          </div>
          <div className="bg-emerald-50 px-5 py-5">
            <p className="text-[14px] text-gray-700 leading-relaxed">
              {lang === "am" 
                ? "በአሁኑ ጊዜ ተቀጥረው የሚሰሩ ወይም ከ2015 ዓ.ም በፊት የተመረቁ ከሆነ፣ ምንም ችግር የለም — እንዲያመለክቱ ሙሉ በሙሉ እንጋብዛለን። ከሙያዊ ዳራዎ ጋር የሚዛመዱ ሰፊ የመካከለኛ እና ከፍተኛ ደረጃ ቦታዎች አሉን።"
                : "If you are currently employed or graduated before 2015 E.C., no problem at all — you are fully welcome to apply. We have a wide range of mid-level and senior positions that match your professional background."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Required Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-8 border-b border-gray-100 bg-gray-50"
      >
        <h2 className="text-[22px] font-black text-gray-900 mb-6">{lang === "am" ? "የሚያስፈልጉ ሰነዶች" : "Required Documents"}</h2>

        {/* Fresh Grad Docs */}
        <h3 className="text-[16px] font-black text-blue-700 mb-4">{lang === "am" ? "ለአዲስ ተመራቂዎች (የ0 ዓመት ልምድ)" : "For Fresh Graduates (0 Year Experience)"}</h3>
        <div className="grid gap-3 mb-8">
          {FRESH_GRAD_DOCS[lang].map((doc, i) => (
            <div key={i} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <doc.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900">{doc.label}</p>
                <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Experienced Docs */}
        <h3 className="text-[16px] font-black text-emerald-700 mb-4">{lang === "am" ? "ልምድ ላላቸው ባለሙያዎች" : "For Experienced Professionals"}</h3>
        <div className="grid gap-3">
          {EXPERIENCED_DOCS[lang].map((doc, i) => (
            <div key={i} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-emerald-50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <doc.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900">{doc.label}</p>
                <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Important Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-5 my-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6"
      >
        <h3 className="text-[17px] font-black text-amber-800 mb-3">{lang === "am" ? "አስፈላጊ ማሳሰቢያ" : "Important Note"}</h3>
        <p className="text-[14px] text-amber-900 leading-relaxed">
          {lang === "am" 
            ? "ሁሉም ሰነዶች ግልጽ በሆነ ዲጂታል ቅርጸት (PDF ወይም JPEG) መቅረብ አለባቸው። Pathway ኤጀንሲ እያንዳንዱን ማመልከቻ ወደ አጋር አሰሪዎች ከማስተላለፉ በፊት ያረጋግጣል። ያልተሟሉ ማመልከቻዎች አይስተናገዱም።"
            : "All documents must be submitted in clear, legible digital format (PDF or JPEG). Pathway Agency verifies every application before forwarding to partner employers. Incomplete applications will not be processed."}
        </p>
      </motion.div>

      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 pb-8"
      >
        <h2 className="text-[22px] font-black text-gray-900 mb-5">{lang === "am" ? "እጩዎቻችን በስራ ላይ" : "Our Candidates at Work"}</h2>
        <div className="grid grid-cols-2 gap-3">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl shadow-sm ${i === 0 ? "col-span-2 h-[200px]" : "h-[140px]"}`}
            >
              <img
                src={img}
                alt={`candidate-${i}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
        <Link
          href="/"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-[16px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        >
          {lang === "am" ? "ያሉትን ሥራዎች ያስሱ" : "Browse Available Jobs"}
          <CheckCircle2 className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

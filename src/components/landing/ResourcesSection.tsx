"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { content, Language } from "@/lib/translations";

export const ResourcesSection = ({ lang }: { lang: Language }) => {
  const t = content[lang];
  const router = useRouter();

  const RESOURCES = [
    {
      title: lang === "am" ? "የ CV አጻጻፍ ምክሮች" : "Resume Writing Tips",
      desc: lang === "am" ? "ሥራ የሚያስገኝልዎትን CV እንዴት ማዘጋጀት እንደሚችሉ።" : "How to craft a CV that gets you hired.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
      color: "from-orange-500/80 to-red-600/80",
      slug: "resume-tips"
    },
    {
      title: lang === "am" ? "የቃለ-መጠይቅ ዝግጅት" : "Interview Preparation",
      desc: lang === "am" ? "ለሚቀጥለው የኤምባሲ ወይም የ NGO ቃለ-መጠይቅዎ ዝግጅት።" : "Aces your next Embassy or NGO interview.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80",
      color: "from-blue-500/80 to-indigo-600/80",
      slug: "interview-prep"
    },
    {
      title: lang === "am" ? "ዓለም አቀፍ ስኮላርሺፖች" : "International Scholarships",
      desc: lang === "am" ? "በውጭ አገር ለመማር እና ለመሥራት ዕድሎች።" : "Opportunities to study and work abroad.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
      color: "from-emerald-500/80 to-teal-600/80",
      slug: "scholarships"
    }
  ];

  return (
    <section className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto py-16 bg-white overflow-hidden">
      <div className="px-5 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">{t.resourcesTitle}</h2>
          <p className="text-[14px] text-gray-500 mt-1">{t.resourcesSub}</p>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-4 px-5 pb-8 hide-scrollbar snap-x snap-mandatory">
        {RESOURCES.map((res, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-[280px] h-[320px] shrink-0 rounded-[24px] overflow-hidden snap-center relative group cursor-pointer"
            onClick={() => router.push(`/resources/${res.slug}`)}
          >
            <img src={res.image} alt={res.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className={`absolute inset-0 bg-gradient-to-t ${res.color} mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <h3 className="text-white font-bold text-[20px] mb-2 leading-tight drop-shadow">{res.title}</h3>
              <p className="text-white/80 text-[13px] mb-4">{res.desc}</p>
              <button className="flex items-center gap-2 text-white text-[13px] font-bold group-hover:text-white/80 transition-colors">
                {lang === "am" ? "ጽሑፍ አንብብ" : "Read Article"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

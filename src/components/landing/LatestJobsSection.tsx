"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";
import { Language } from "@/lib/translations";

const generateJobs = (lang: "en" | "am") => {
  const jobs = [];
  const categories = [
    {
      type: "NGO", logo: "🌍", bg: "bg-emerald-50", color: "text-emerald-600",
      titles: {
        en: ["Project Officer", "M&E Specialist", "Field Coordinator", "Grant Manager", "Social Worker", "Health Officer", "Logistics Assistant", "WASH Specialist", "Child Protection Officer", "Nutrition Officer", "Program Manager", "Finance Officer", "HR Specialist", "Communications Officer", "Driver"],
        am: ["የፕሮጀክት ኦፊሰር", "የክትትልና ግምገማ ባለሙያ", "የመስክ አስተባባሪ", "የግራንት ስራ አስኪያጅ", "ማህበራዊ ሰራተኛ", "የጤና ኦፊሰር", "የሎጂስቲክስ ረዳት", "የ WASH ስፔሻሊስት", "የህፃናት ጥበቃ ኦፊሰር", "የስነ ምግብ ኦፊሰር", "የፕሮግራም ስራ አስኪያጅ", "የፋይናንስ ኦፊሰር", "የሰው ሀይል ስፔሻሊስት", "የኮሙኒኬሽን ኦፊሰር", "አሽከርካሪ"]
      },
      companies: {
        en: ["UNICEF Ethiopia", "UNDP Ethiopia", "WHO Ethiopia", "WFP Ethiopia", "UNHCR Ethiopia", "ILO Ethiopia", "UNESCO Ethiopia", "FAO Ethiopia", "UNECA", "Save the Children Ethiopia", "World Vision Ethiopia", "CARE Ethiopia", "Oxfam Ethiopia", "ICRC Red Cross", "Mercy Corps Ethiopia", "Plan International Ethiopia", "Action Against Hunger", "IRC Ethiopia", "MSF Doctors Without Borders", "Catholic Relief Services"],
        am: ["ዩኒሴፍ ኢትዮጵያ", "ዩኤንዲፒ ኢትዮጵያ", "የዓለም ጤና ድርጅት", "የዓለም ምግብ ፕሮግራም", "UNHCR ኢትዮጵያ", "ILO ኢትዮጵያ", "ዩኔስኮ ኢትዮጵያ", "FAO ኢትዮጵያ", "UNECA", "ሴቭ ዘ ችልድረን", "ወርልድ ቪዥን ኢትዮጵያ", "ኬር ኢትዮጵያ", "ኦክስፋም ኢትዮጵያ", "ICRC ቀይ መስቀል", "መርሲ ኮርፕስ", "ፕላን ኢንተርናሽናል", "አክሽን አጌንስት ሀንገር", "IRC ኢትዮጵያ", "MSF ኢትዮጵያ", "ካቶሊክ ሪሊፍ ሰርቪስ"]
      },
      locations: {
        en: ["Addis Ababa, Ethiopia"],
        am: ["አዲስ አበባ፣ ኢትዮጵያ"]
      }
    },
    {
      type: "Embassy", logo: "🏛️", bg: "bg-blue-50", color: "text-blue-600",
      titles: {
        en: ["Visa Processing Clerk", "Consular Assistant", "Interpreter", "Administrative Assistant", "Protocol Officer", "Security Supervisor", "Cultural Affairs Assistant", "Public Affairs Officer", "Political Analyst", "Procurement Officer", "IT Officer", "Driver", "Receptionist", "Facility Manager", "Finance Assistant"],
        am: ["የቪዛ ማስኬጃ ጸሐፊ", "የቆንስላ ረዳት", "አስተርጓሚ", "አስተዳደራዊ ረዳት", "የፕሮቶኮል ኦፊሰር", "የጥበቃ ተቆጣጣሪ", "የባህል ጉዳዮች ረዳት", "የህዝብ ግንኙነት ኦፊሰር", "የፖለቲካ ተንታኝ", "የግዢ ኦፊሰር", "የ IT ኦፊሰር", "አሽከርካሪ", "እንግዳ ተቀባይ", "የፋሲሊቲ ስራ አስኪያጅ", "የፋይናንስ ረዳት"]
      },
      companies: {
        en: ["US Embassy", "British Embassy", "Canadian Embassy", "German Embassy", "French Embassy", "Italian Embassy", "Norwegian Embassy", "Swedish Embassy", "Danish Embassy", "Dutch Embassy", "Swiss Embassy", "Japanese Embassy", "Chinese Embassy", "South Korean Embassy", "Turkish Embassy", "Indian Embassy", "Australian Embassy", "EU Delegation", "Belgian Embassy", "Finnish Embassy"],
        am: ["የአሜሪካ ኤምባሲ", "የእንግሊዝ ኤምባሲ", "የካናዳ ኤምባሲ", "የጀርመን ኤምባሲ", "የፈረንሳይ ኤምባሲ", "የጣሊያን ኤምባሲ", "የኖርዌይ ኤምባሲ", "የስዊድን ኤምባሲ", "የዴንማርክ ኤምባሲ", "የኔዘርላንድ ኤምባሲ", "የስዊስ ኤምባሲ", "የጃፓን ኤምባሲ", "የቻይና ኤምባሲ", "የደቡብ ኮሪያ ኤምባሲ", "የቱርክ ኤምባሲ", "የህንድ ኤምባሲ", "የአውስትራሊያ ኤምባሲ", "የአውሮፓ ህብረት ልዑክ", "የቤልጂየም ኤምባሲ", "የፊንላንድ ኤምባሲ"]
      },
      locations: {
        en: ["Addis Ababa, Ethiopia"],
        am: ["አዲስ አበባ፣ ኢትዮጵያ"]
      }
    },
    {
      type: "Aviation", logo: "✈️", bg: "bg-sky-50", color: "text-sky-600",
      titles: {
        en: ["Customer Service Agent", "Ground Handling Agent", "Flight Attendant", "Cargo Specialist", "Ticketing Agent", "Aviation Mechanic", "Aircraft Dispatcher", "Ramp Agent", "Lounge Host", "Security Agent", "Cabin Crew", "Reservations Agent", "Baggage Handler", "Airport Operations Staff", "Check-in Agent"],
        am: ["የደንበኞች አገልግሎት ወኪል", "የመሬት አገልግሎት ወኪል", "የበረራ አስተናጋጅ", "የካርጎ ስፔሻሊስት", "የትኬት ወኪል", "የአቪዬሽን መካኒክ", "የአውሮፕላን አስተላላፊ", "የራምፕ ወኪል", "የእንግዳ ማረፊያ አስተናጋጅ", "የደህንነት ወኪል", "የካቢን ሰራተኛ", "የቦታ ማስያዝ ወኪል", "የሻንጣ አስተናጋጅ", "የአውሮፕላን ማረፊያ ስራዎች ሰራተኛ", "ቼክ-ኢን ወኪል"]
      },
      companies: {
        en: ["Ethiopian Airlines", "Ethiopian Airports", "Bole International", "DHL Aviation", "FedEx Ethiopia", "Turkish Airlines", "Emirates Addis", "Qatar Airways", "Kenya Airways", "RwandAir", "Flydubai Addis", "Lufthansa Addis", "KLM Addis", "Air France", "Egyptair Addis"],
        am: ["የኢትዮጵያ አየር መንገድ", "የኢትዮጵያ ኤርፖርቶች", "ቦሌ ዓለም አቀፍ", "DHL አቪዬሽን", "FedEx ኢትዮጵያ", "Turkish Airlines", "Emirates አዲስ", "Qatar Airways", "Kenya Airways", "RwandAir", "Flydubai አዲስ", "Lufthansa አዲስ", "KLM አዲስ", "Air France", "Egyptair አዲስ"]
      },
      locations: {
        en: ["Bole Airport, Addis"],
        am: ["ቦሌ ኤርፖርት፣ አዲስ አበባ"]
      }
    },
    {
      type: "International", logo: "🌐", bg: "bg-purple-50", color: "text-purple-600",
      titles: {
        en: ["Operations Manager", "Country Representative", "Regional Sales Manager", "Business Development Officer", "Finance Manager", "HR Manager", "Procurement Manager", "Supply Chain Officer", "Marketing Manager", "IT Manager", "Customer Relations Officer", "General Manager", "Branch Manager", "Administrative Manager", "Communications Manager"],
        am: ["የስራ ማስኬጃ ስራ አስኪያጅ", "የሀገር ተወካይ", "የክልል የሽያጭ ስራ አስኪያጅ", "የቢዝነስ ልማት ኦፊሰር", "የፋይናንስ ስራ አስኪያጅ", "የሰው ሀይል ስራ አስኪያጅ", "የግዢ ስራ አስኪያጅ", "የአቅርቦት ሰንሰለት ኦፊሰር", "የማርኬቲንግ ስራ አስኪያጅ", "የ IT ስራ አስኪያጅ", "የደንበኞች ግንኙነት ኦፊሰር", "አጠቃላይ ስራ አስኪያጅ", "የቅርንጫፍ ስራ አስኪያጅ", "አስተዳደራዊ ስራ አስኪያጅ", "የኮሙኒኬሽን ስራ አስኪያጅ"]
      },
      companies: {
        en: ["Safaricom Ethiopia", "Heineken Ethiopia", "Coca-Cola Beverages", "BGI Ethiopia", "Diageo Meta Abo", "Hilton Addis Ababa", "Sheraton Addis Ababa", "Radisson Blu Addis", "Hyatt Regency Addis", "Marriott Addis", "DHL Express", "Toyota Ethiopia", "TotalEnergies", "Unilever Ethiopia", "PwC Ethiopia"],
        am: ["ሳፋሪኮም ኢትዮጵያ", "ሄኒከን ኢትዮጵያ", "ኮካ ኮላ ኢትዮጵያ", "BGI ኢትዮጵያ", "ዲያጆ ሜታ አቦ", "ሂልተን አዲስ አበባ", "ሸራተን አዲስ አበባ", "ራዲሰን ብሉ አዲስ", "ሃያት ሪጀንሲ አዲስ", "ማሪዮት አዲስ", "DHL ኤክስፕረስ", "ቶዮታ ኢትዮጵያ", "ቶታል ኢነርጂ", "ዩኒሊቨር ኢትዮጵያ", "PwC ኢትዮጵያ"]
      },
      locations: {
        en: ["Addis Ababa, Ethiopia"],
        am: ["አዲስ አበባ፣ ኢትዮጵያ"]
      }
    }
  ];

  const exps = {
    en: ["0-1 Years", "1-2 Years", "2-3 Years", "3-5 Years", "5+ Years"],
    am: ["0-1 ዓመታት", "1-2 ዓመታት", "2-3 ዓመታት", "3-5 ዓመታት", "5+ ዓመታት"]
  };
  const jobTypes = {
    en: ["Full-time", "Contract", "Part-time"],
    am: ["የሙሉ ሰዓት", "ኮንትራት", "የትርፍ ሰዓት"]
  };

  for (let i = 1; i <= 250; i++) {
    const cat = categories[i % 4];
    const title = cat.titles[lang][i % cat.titles[lang].length];
    const company = cat.companies[lang][(i * 3) % cat.companies[lang].length];
    const location = cat.locations[lang][(i * 7) % cat.locations[lang].length];
    const exp = exps[lang][(i * 2) % exps[lang].length];
    const type = jobTypes[lang][(i * 5) % jobTypes[lang].length];

    jobs.push({ id: i, title, company, logo: cat.logo, location, type, exp, bg: cat.bg, color: cat.color });
  }
  return jobs;
};

const ALL_JOBS_EN = generateJobs("en");
const ALL_JOBS_AM = generateJobs("am");

export const LatestJobsSection = ({ 
  onApplyClick, filterCategory, onClearFilter, showAll, onToggleShowAll, lang 
}: { 
  onApplyClick: () => void; filterCategory?: string | null; onClearFilter?: () => void; showAll: boolean; onToggleShowAll: () => void; lang: Language;
}) => {
  const currentJobs = lang === "am" ? ALL_JOBS_AM : ALL_JOBS_EN;
  
  const filteredJobs = useMemo(() => {
    if (!filterCategory) return currentJobs;
    const logoMap: Record<string, string> = { "NGO": "🌍", "Embassy": "🏛️", "Aviation": "✈️", "International": "🌐" };
    return currentJobs.filter(job => job.logo === logoMap[filterCategory]);
  }, [filterCategory, currentJobs]);

  const displayJobs = showAll ? filteredJobs : filteredJobs.slice(0, 10);
  const remainingCount = filteredJobs.length - displayJobs.length;

  return (
    <section id="latest-jobs" className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto py-16 bg-gray-50/50 overflow-hidden">
      <div className="flex justify-between items-end mb-8 px-5">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-black text-gray-900 tracking-tight leading-tight whitespace-nowrap">
            {filterCategory ? `${filterCategory} ${lang === "am" ? "ሥራዎች" : "Jobs"}` : (lang === "am" ? "በ2019 ተፈላጊ ሥራዎች" : "Trending in 2019")}
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">{filteredJobs.length} {lang === "am" ? "የተረጋገጡ የሥራ ዕድሎች።" : "Verified Job Opportunities."}</p>
          {filterCategory && (
            <button onClick={onClearFilter} className="text-[12px] font-bold text-red-500 mt-2 hover:underline">
              {lang === "am" ? "ማጣሪያውን ያጽዱ ✕" : "Clear Filter ✕"}
            </button>
          )}
        </div>
        <button onClick={onToggleShowAll} className="text-[14px] font-bold text-blue-600 hover:text-blue-700 shrink-0 ml-4">
          {showAll ? (lang === "am" ? "ትንሽ አሳይ" : "Show Less") : (lang === "am" ? "ሁሉንም ይመልከቱ" : "View All")}
        </button>
      </div>

      <div className="flex overflow-x-auto gap-4 px-5 pb-8 hide-scrollbar snap-x snap-mandatory">
        {displayJobs.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-[280px] shrink-0 bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group snap-center flex flex-col"
          >
            <button className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-4 pr-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${job.bg}`}>{job.logo}</div>
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold text-gray-900 truncate">{job.title}</h3>
                <p className={`text-[13px] font-medium truncate ${job.color}`}>{job.company}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-600 text-[13px]"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{job.location}</span></div>
              <div className="flex items-center gap-2 text-gray-600 text-[13px]"><Briefcase className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{job.type}</span></div>
              <div className="flex items-center gap-2 text-gray-600 text-[13px]"><Clock className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{job.exp}</span></div>
            </div>

            <button onClick={onApplyClick} className="mt-auto w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-[14px] transition-colors flex items-center justify-center gap-2">
              {lang === "am" ? "አሁን ያመልክቱ" : "Apply Now"}
            </button>
          </motion.div>
        ))}

        {!showAll && remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-[280px] shrink-0 rounded-[24px] p-5 border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors relative group snap-center flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => onToggleShowAll()}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-8 h-8" />
            </div>
            <h3 className="text-[18px] font-black text-gray-900 mb-1">{lang === "am" ? "ተጨማሪ ያስሱ" : "Explore More"}</h3>
            <p className="text-[14px] text-gray-500 font-medium">{lang === "am" ? `${remainingCount} ሌሎች አማራጮችን ይመልከቱ` : `View ${remainingCount} other options across Ethiopia & Int'l`}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

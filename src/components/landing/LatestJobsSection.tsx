"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";

// Procedural generation of 250 jobs evenly distributed across 4 categories
const generateJobs = () => {
  const jobs = [];
  const categories = [
    {
      type: "NGO", logo: "🌍", bg: "bg-emerald-50", color: "text-emerald-600",
      titles: ["Project Officer", "M&E Specialist", "Field Coordinator", "Grant Manager", "Social Worker", "Health Officer", "Logistics Assistant", "WASH Expert", "Child Protection Officer", "Nutritionist"],
      companies: ["UNICEF Ethiopia", "World Vision", "Save the Children", "USAID", "WHO Ethiopia", "Red Cross", "Oxfam", "Care International", "Mercy Corps", "Plan International"],
      locations: ["Addis Ababa, Ethiopia", "Hawassa, Ethiopia", "Mekelle, Ethiopia", "Dire Dawa, Ethiopia", "Jijiga, Ethiopia", "Gambella, Ethiopia", "Assosa, Ethiopia"]
    },
    {
      type: "Embassy", logo: "🏛️", bg: "bg-blue-50", color: "text-blue-600",
      titles: ["Visa Processing Clerk", "Consular Assistant", "Translator", "Administrative Assistant", "Protocol Officer", "Security Supervisor", "Cultural Attaché Assistant", "Public Affairs Officer", "Political Analyst", "Driver"],
      companies: ["Canadian Embassy", "US Embassy", "British Embassy", "German Embassy", "Swedish Embassy", "French Embassy", "Australian Embassy", "Japanese Embassy", "Italian Embassy", "Norwegian Embassy"],
      locations: ["Addis Ababa, Ethiopia"]
    },
    {
      type: "Aviation", logo: "✈️", bg: "bg-sky-50", color: "text-sky-600",
      titles: ["Customer Service Agent", "Ground Handling", "Flight Attendant", "Cargo Specialist", "Ticketing Agent", "Aviation Mechanic", "Aircraft Dispatcher", "Ramp Agent", "Lounge Host", "Security Agent"],
      companies: ["Ethiopian Airlines", "Bole Airport Enterprise", "Emirates", "Qatar Airways", "DHL Aviation", "Turkish Airlines", "Kenya Airways", "Lufthansa", "FlyDubai", "RwandAir"],
      locations: ["Bole Airport, Ethiopia", "Dubai, UAE", "Doha, Qatar", "Frankfurt, Germany", "Istanbul, Turkey"]
    },
    {
      type: "International", logo: "🌐", bg: "bg-purple-50", color: "text-purple-600",
      titles: ["Operations Manager", "Expat Coordinator", "Regional Director", "International Sales", "Business Developer", "Foreign Liaison", "Country Director", "Trade Consultant", "Supply Chain Mgr", "Overseas Representative"],
      companies: ["Safaricom Ethiopia", "Coca-Cola Beverages", "Heineken", "Unilever", "Hilton Addis", "Sheraton Addis", "BGI Ethiopia", "Dangote Cement", "Midroc Ethiopia", "Marriott International"],
      locations: ["Addis Ababa, Ethiopia", "Nairobi, Kenya", "Dubai, UAE", "London, UK"]
    }
  ];

  const exps = ["0-1 Years", "1-2 Years", "2-3 Years", "3-5 Years", "5+ Years"];
  const jobTypes = ["Full-time", "Contract", "Part-time"];

  for (let i = 1; i <= 250; i++) {
    // Distribute evenly across the 4 categories
    const cat = categories[i % 4];
    
    // Pseudo-random selection based on index to keep it consistent on re-renders
    const title = cat.titles[i % cat.titles.length];
    const company = cat.companies[(i * 3) % cat.companies.length];
    const location = cat.locations[(i * 7) % cat.locations.length];
    const exp = exps[(i * 2) % exps.length];
    const type = jobTypes[(i * 5) % jobTypes.length];

    jobs.push({
      id: i,
      title,
      company,
      logo: cat.logo,
      location,
      type,
      exp,
      bg: cat.bg,
      color: cat.color
    });
  }

  return jobs;
};

// Generate once in module scope
const ALL_JOBS = generateJobs();

export const LatestJobsSection = ({ 
  onApplyClick, 
  filterCategory, 
  onClearFilter 
}: { 
  onApplyClick: () => void; 
  filterCategory?: string | null;
  onClearFilter?: () => void;
}) => {
  const [showAll, setShowAll] = useState(false);

  const filteredJobs = useMemo(() => {
    if (!filterCategory) return ALL_JOBS;
    const logoMap: Record<string, string> = { "NGO": "🌍", "Embassy": "🏛️", "Aviation": "✈️", "International": "🌐" };
    return ALL_JOBS.filter(job => job.logo === logoMap[filterCategory]);
  }, [filterCategory]);

  // We only display the first 10 items in the carousel initially
  const displayJobs = showAll ? filteredJobs : filteredJobs.slice(0, 10);
  const remainingCount = filteredJobs.length - displayJobs.length;

  return (
    <section id="latest-jobs" className="w-full max-w-[430px] mx-auto py-16 bg-gray-50/50 overflow-hidden">
      <div className="flex justify-between items-end mb-8 px-5">
        <div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">
            {filterCategory ? `${filterCategory} Jobs` : "Trending in 2019"}
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">{filteredJobs.length} Verified Job Opportunities.</p>
          {filterCategory && (
            <button onClick={onClearFilter} className="text-[12px] font-bold text-red-500 mt-2 hover:underline">
              Clear Filter ✕
            </button>
          )}
        </div>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-[14px] font-bold text-blue-600 hover:text-blue-700 shrink-0"
        >
          {showAll ? "Show Less" : "View All"}
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
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${job.bg}`}>
                {job.logo}
              </div>
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold text-gray-900 truncate">{job.title}</h3>
                <p className={`text-[13px] font-medium truncate ${job.color}`}>{job.company}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-600 text-[13px]">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-[13px]">
                <Briefcase className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{job.type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-[13px]">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{job.exp}</span>
              </div>
            </div>

            <button 
              onClick={onApplyClick}
              className="mt-auto w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-[14px] transition-colors flex items-center justify-center gap-2"
            >
              Apply Now
            </button>
          </motion.div>
        ))}

        {/* View Other Options Card (only show if not showing all and there are remaining items) */}
        {!showAll && remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-[280px] shrink-0 rounded-[24px] p-5 border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors relative group snap-center flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => setShowAll(true)}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-8 h-8" />
            </div>
            <h3 className="text-[18px] font-black text-gray-900 mb-1">Explore More</h3>
            <p className="text-[14px] text-gray-500 font-medium">View {remainingCount} other options across Ethiopia & Int'l</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

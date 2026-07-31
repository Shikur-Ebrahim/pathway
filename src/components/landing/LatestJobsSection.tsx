"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Clock, Briefcase } from "lucide-react";

// Generate 52 high-quality job listings for Ethiopian New Year 2019
const JOBS = [
  { id: 1, title: "Senior Project Officer", company: "UNICEF Ethiopia", logo: "🌍", location: "Addis Ababa", type: "Full-time", exp: "5+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 2, title: "Visa Processing Clerk", company: "Canadian Embassy", logo: "🍁", location: "Addis Ababa", type: "Contract", exp: "2+ Years", bg: "bg-red-50", color: "text-red-600" },
  { id: 3, title: "Customer Service Agent", company: "Ethiopian Airlines", logo: "✈️", location: "Bole Airport", type: "Full-time", exp: "0-1 Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 4, title: "Operations Manager", company: "Emirates Group", logo: "🌐", location: "Dubai, UAE", type: "Full-time", exp: "3+ Years", bg: "bg-purple-50", color: "text-purple-600" },
  { id: 5, title: "Bank Trainee", company: "Commercial Bank of Ethiopia", logo: "🏦", location: "Addis Ababa", type: "Full-time", exp: "0 Years (Fresh)", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 6, title: "Software Engineer", company: "Safaricom Ethiopia", logo: "💻", location: "Addis Ababa", type: "Full-time", exp: "2+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 7, title: "M&E Specialist", company: "World Vision", logo: "🌍", location: "Hawassa", type: "Contract", exp: "4+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 8, title: "Consular Assistant", company: "US Embassy", logo: "🏛️", location: "Addis Ababa", type: "Full-time", exp: "3+ Years", bg: "bg-slate-100", color: "text-slate-700" },
  { id: 9, title: "Flight Attendant", company: "Qatar Airways", logo: "✈️", location: "Doha, Qatar", type: "Full-time", exp: "1+ Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 10, title: "Branch Manager", company: "Awash Bank", logo: "🏦", location: "Dire Dawa", type: "Full-time", exp: "5+ Years", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 11, title: "Data Analyst", company: "Ethio Telecom", logo: "💻", location: "Addis Ababa", type: "Full-time", exp: "2+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 12, title: "Field Coordinator", company: "Save the Children", logo: "🌍", location: "Mekelle", type: "Contract", exp: "3+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 13, title: "Administrative Assistant", company: "British Embassy", logo: "🏛️", location: "Addis Ababa", type: "Full-time", exp: "1+ Years", bg: "bg-slate-100", color: "text-slate-700" },
  { id: 14, title: "Cargo Specialist", company: "DHL Aviation", logo: "✈️", location: "Bole Airport", type: "Full-time", exp: "2+ Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 15, title: "Customer Service Officer", company: "Dashen Bank", logo: "🏦", location: "Bahir Dar", type: "Full-time", exp: "1+ Years", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 16, title: "IT Support Specialist", company: "Gebeya", logo: "💻", location: "Addis Ababa", type: "Contract", exp: "1+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 17, title: "Grant Manager", company: "USAID", logo: "🌍", location: "Addis Ababa", type: "Full-time", exp: "5+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 18, title: "Translator", company: "German Embassy", logo: "🏛️", location: "Addis Ababa", type: "Part-time", exp: "2+ Years", bg: "bg-slate-100", color: "text-slate-700" },
  { id: 19, title: "Ground Handling", company: "Ethiopian Airlines", logo: "✈️", location: "Bole Airport", type: "Full-time", exp: "0-1 Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 20, title: "Credit Analyst", company: "Bank of Abyssinia", logo: "🏦", location: "Addis Ababa", type: "Full-time", exp: "3+ Years", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 21, title: "System Administrator", company: "Ride Ethiopia", logo: "💻", location: "Addis Ababa", type: "Full-time", exp: "4+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 22, title: "Social Worker", company: "WHO Ethiopia", logo: "🌍", location: "Gondar", type: "Contract", exp: "2+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 23, title: "Protocol Officer", company: "Swedish Embassy", logo: "🏛️", location: "Addis Ababa", type: "Full-time", exp: "4+ Years", bg: "bg-slate-100", color: "text-slate-700" },
  { id: 24, title: "Ticketing Agent", company: "Emirates", logo: "✈️", location: "Addis Ababa", type: "Full-time", exp: "1+ Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 25, title: "Digital Banking Spec.", company: "Hibret Bank", logo: "🏦", location: "Adama", type: "Full-time", exp: "3+ Years", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 26, title: "Cybersecurity Expert", company: "Safaricom Tech", logo: "💻", location: "Addis Ababa", type: "Full-time", exp: "5+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 27, title: "Health Officer", company: "Red Cross", logo: "🌍", location: "Jijiga", type: "Contract", exp: "2+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 28, title: "Security Supervisor", company: "US Embassy", logo: "🏛️", location: "Addis Ababa", type: "Full-time", exp: "5+ Years", bg: "bg-slate-100", color: "text-slate-700" },
  { id: 29, title: "Aviation Mechanic", company: "Ethiopian Airlines", logo: "✈️", location: "Bole Airport", type: "Full-time", exp: "3+ Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 30, title: "Internal Auditor", company: "Commercial Bank of Ethiopia", logo: "🏦", location: "Addis Ababa", type: "Full-time", exp: "4+ Years", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 31, title: "Network Engineer", company: "Ethio Telecom", logo: "💻", location: "Addis Ababa", type: "Full-time", exp: "3+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 32, title: "Logistics Assistant", company: "UNICEF Ethiopia", logo: "🌍", location: "Semera", type: "Contract", exp: "1+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 33, title: "Cultural Attaché Assistant", company: "French Embassy", logo: "🏛️", location: "Addis Ababa", type: "Part-time", exp: "2+ Years", bg: "bg-slate-100", color: "text-slate-700" },
  { id: 34, title: "Ramp Agent", company: "Qatar Airways", logo: "✈️", location: "Bole Airport", type: "Full-time", exp: "1+ Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 35, title: "Corporate Relationship Mgr", company: "Awash Bank", logo: "🏦", location: "Addis Ababa", type: "Full-time", exp: "5+ Years", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 36, title: "Backend Developer", company: "Gebeya", logo: "💻", location: "Remote", type: "Contract", exp: "3+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 37, title: "WASH Specialist", company: "World Vision", logo: "🌍", location: "Assosa", type: "Contract", exp: "4+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 38, title: "Public Affairs Assistant", company: "Canadian Embassy", logo: "🍁", location: "Addis Ababa", type: "Full-time", exp: "2+ Years", bg: "bg-red-50", color: "text-red-600" },
  { id: 39, title: "Lounge Host", company: "Ethiopian Airlines", logo: "✈️", location: "Bole Airport", type: "Full-time", exp: "0-1 Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 40, title: "Teller", company: "Dashen Bank", logo: "🏦", location: "Jimma", type: "Full-time", exp: "0 Years", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 41, title: "Product Manager", company: "ZayRide", logo: "💻", location: "Addis Ababa", type: "Full-time", exp: "4+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 42, title: "Nutrition Officer", company: "Save the Children", logo: "🌍", location: "Gambella", type: "Contract", exp: "3+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 43, title: "Political Analyst", company: "British Embassy", logo: "🏛️", location: "Addis Ababa", type: "Full-time", exp: "5+ Years", bg: "bg-slate-100", color: "text-slate-700" },
  { id: 44, title: "Customs Clearance", company: "DHL Aviation", logo: "✈️", location: "Bole Airport", type: "Full-time", exp: "2+ Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 45, title: "Retail Banking Officer", company: "Bank of Abyssinia", logo: "🏦", location: "Bishoftu", type: "Full-time", exp: "2+ Years", bg: "bg-amber-50", color: "text-amber-600" },
  { id: 46, title: "Mobile App Developer", company: "Safaricom Tech", logo: "💻", location: "Addis Ababa", type: "Full-time", exp: "2+ Years", bg: "bg-indigo-50", color: "text-indigo-600" },
  { id: 47, title: "Procurement Officer", company: "USAID", logo: "🌍", location: "Addis Ababa", type: "Full-time", exp: "3+ Years", bg: "bg-blue-50", color: "text-blue-600" },
  { id: 48, title: "Facility Manager", company: "German Embassy", logo: "🏛️", location: "Addis Ababa", type: "Full-time", exp: "4+ Years", bg: "bg-slate-100", color: "text-slate-700" },
  { id: 49, title: "Aircraft Dispatcher", company: "Ethiopian Airlines", logo: "✈️", location: "Bole Airport", type: "Full-time", exp: "3+ Years", bg: "bg-emerald-50", color: "text-emerald-600" },
  { id: 50, title: "Expat Coordinator", company: "Heineken", logo: "🌐", location: "Addis Ababa", type: "Full-time", exp: "4+ Years", bg: "bg-purple-50", color: "text-purple-600" },
  { id: 51, title: "Foreign Liaison", company: "Coca-Cola Beverages", logo: "🌐", location: "Addis Ababa", type: "Full-time", exp: "3+ Years", bg: "bg-purple-50", color: "text-purple-600" },
  { id: 52, title: "Regional Sales Manager", company: "Unilever", logo: "🌐", location: "Hawassa", type: "Full-time", exp: "5+ Years", bg: "bg-purple-50", color: "text-purple-600" },
];

export const LatestJobsSection = ({ onApplyClick }: { onApplyClick: () => void }) => {
  return (
    <section className="w-full max-w-[430px] mx-auto py-16 bg-gray-50/50 overflow-hidden">
      <div className="flex justify-between items-end mb-8 px-5">
        <div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight leading-tight">Trending in 2019</h2>
          <p className="text-[14px] text-gray-500 mt-1">50+ top Ethiopian & Int'l jobs right now.</p>
        </div>
        <button className="text-[14px] font-bold text-blue-600 hover:text-blue-700 shrink-0">View All</button>
      </div>

      <div className="flex overflow-x-auto gap-4 px-5 pb-8 hide-scrollbar snap-x snap-mandatory">
        {JOBS.map((job, idx) => (
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
      </div>
    </section>
  );
};

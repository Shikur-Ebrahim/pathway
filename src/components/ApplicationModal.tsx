"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { addPathwayPost } from "@/lib/db";
import {
  X, Upload, CheckCircle2, AlertCircle, FileText,
  UserCheck, Building2, Globe2, Plane, ChevronDown, ChevronUp,
} from "lucide-react";
import { Language } from "@/lib/translations";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const sectors = [
  {
    value: "Embassies & Diplomatic Missions",
    emoji: "🏛️",
    amLabel: "ኤምባሲዎች",
    enLabel: "Embassies & Diplomatic Missions",
    icon: Building2,
    color: "blue",
    activeBg: "bg-blue-50",
    activeBorder: "border-blue-500",
    activeText: "text-blue-700",
    activeDot: "bg-blue-500",
    passiveBorder: "border-gray-200",
  },
  {
    value: "NGOs & UN Agencies",
    emoji: "🌍",
    amLabel: "ዓለም አቀፍ ድርጅቶች",
    enLabel: "NGOs & UN Agencies",
    icon: Globe2,
    color: "emerald",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-500",
    activeText: "text-emerald-700",
    activeDot: "bg-emerald-500",
    passiveBorder: "border-gray-200",
  },
  {
    value: "Airport & Aviation Operations",
    emoji: "✈️",
    amLabel: "አቪዬሽን / ኤርፖርት",
    enLabel: "Airport & Aviation Operations",
    icon: Plane,
    color: "sky",
    activeBg: "bg-sky-50",
    activeBorder: "border-sky-500",
    activeText: "text-sky-700",
    activeDot: "bg-sky-500",
    passiveBorder: "border-gray-200",
  },
  {
    value: "Foreign & International Jobs",
    emoji: "🌐",
    amLabel: "የውጭ ሀገር ስራዎች",
    enLabel: "Foreign & International Jobs",
    icon: Globe2,
    color: "purple",
    activeBg: "bg-purple-50",
    activeBorder: "border-purple-500",
    activeText: "text-purple-700",
    activeDot: "bg-purple-500",
    passiveBorder: "border-gray-200",
  },
];

const gradYears = [
  { value: "2018", am: "2018 ዓ.ም  (2025/26)", en: "2018 E.C. (2025/26)" },
  { value: "2017", am: "2017 ዓ.ም  (2024/25)", en: "2017 E.C. (2024/25)" },
  { value: "2016", am: "2016 ዓ.ም  (2023/24)", en: "2016 E.C. (2023/24)" },
  { value: "2015", am: "2015 ዓ.ም  (2022/23)", en: "2015 E.C. (2022/23)" },
];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, lang }) => {
  const { user } = useAuth();
  const am = lang === "am";

  const [category, setCategory] = useState<"fresh" | "experienced">("fresh");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email] = useState(user?.email || "");
  const [gradYear, setGradYear] = useState("2018");
  const [gpa, setGpa] = useState("");
  const [targetSector, setTargetSector] = useState(sectors[0].value);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [yearDropOpen, setYearDropOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedYear = gradYears.find(y => y.value === gradYear)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let cvUrl = "";
      let photoUrl = "";
      if (cvFile) { const r = await uploadToCloudinary(cvFile); cvUrl = r.url; }
      if (photoFile) { const r = await uploadToCloudinary(photoFile); photoUrl = r.url; }
      await addPathwayPost({
        title: `[Application] ${fullName} — ${targetSector}`,
        description: `Phone: ${phone} | Category: ${category} | Grad Year: ${gradYear} E.C. | GPA: ${gpa || "N/A"} | Email: ${email}`,
        imageUrl: photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        authorName: fullName,
        authorEmail: email || phone,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Submission failed. Please try via Telegram.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-fadeIn">
      {/* Sheet slides up from bottom on mobile, centered on desktop */}
      <div className="relative w-full sm:max-w-xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">

        {/* Top accent + drag handle */}
        <div className="sticky top-0 bg-white z-10 pt-3 px-5 sm:px-8 pb-0 rounded-t-3xl">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3 sm:hidden" />
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-8 pt-4 pb-8">
          {submitted ? (
            /* ── Success ── */
            <div className="text-center py-10 space-y-5">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto border-4 border-green-200">
                <CheckCircle2 className="w-11 h-11 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {am ? "ማመልከቻዎ ተቀብሏል!" : "Application Submitted!"}
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
                  {am
                    ? "ቡድናችን ሰነዶችዎን በ 24–48 ሰዓታት ይገመግማል። ቴሌግራም ላይ ቆዩን።"
                    : "Our team will review your documents within 24–48 hours. Follow us on Telegram."}
                </p>
              </div>
              <a
                href="https://t.me/pathway_agency"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg hover:bg-blue-700 transition-all"
              >
                Open @pathway_agency
              </a>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 pr-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold mb-2">
                  <UserCheck className="w-3.5 h-3.5" />
                  {am ? "ኦፊሴላዊ ምዝገባ" : "Official Job Application"}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {am ? "የስራ ማመልከቻ ቅጽ" : "Submit Your Application"}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {am ? "ሁሉም መረጃ ሚስጥራዊ ሆኖ ይጠበቃል" : "All information is kept strictly confidential"}
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── STEP 1: Category ── */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                    {am ? "ደረጃ 1 — የአመልካች ዓይነት" : "Step 1 — Applicant Category"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCategory("fresh")}
                      className={`relative py-4 px-3 rounded-2xl text-left border-2 transition-all active:scale-95 ${
                        category === "fresh"
                          ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      {category === "fresh" && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                      <div className="text-2xl mb-1.5">🎓</div>
                      <div className="text-sm font-bold text-gray-900 leading-tight">
                        {am ? "አዲስ ተመራቂ" : "Fresh Graduate"}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        2015–2018 {am ? "ዓ.ም" : "E.C."}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory("experienced")}
                      className={`relative py-4 px-3 rounded-2xl text-left border-2 transition-all active:scale-95 ${
                        category === "experienced"
                          ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-100"
                          : "border-gray-200 bg-white hover:border-purple-300"
                      }`}
                    >
                      {category === "experienced" && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                      <div className="text-2xl mb-1.5">💼</div>
                      <div className="text-sm font-bold text-gray-900 leading-tight">
                        {am ? "ልምድ ያለው" : "Experienced"}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {am ? "ስራ ላይ / ቀደም ብሎ" : "Employed / Pre-2015"}
                      </div>
                    </button>
                  </div>
                </div>

                {/* ── STEP 2: Job Sector — Custom Cards (replaces native select) ── */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                    {am ? "ደረጃ 2 — የስራ ዘርፍ ይምረጡ" : "Step 2 — Choose Job Sector"}
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {sectors.map((s) => {
                      const isSelected = targetSector === s.value;
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setTargetSector(s.value)}
                          className={`flex items-center gap-3.5 w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                            isSelected
                              ? `${s.activeBg} ${s.activeBorder} shadow-sm`
                              : `bg-white ${s.passiveBorder} hover:border-gray-300`
                          }`}
                        >
                          {/* Emoji icon */}
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                            isSelected ? "bg-white shadow-sm" : "bg-gray-100"
                          }`}>
                            {s.emoji}
                          </div>

                          {/* Label */}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-bold truncate ${isSelected ? s.activeText : "text-gray-800"}`}>
                              {am ? s.amLabel : s.enLabel}
                            </div>
                            {am && (
                              <div className="text-[11px] text-gray-400 truncate mt-0.5">{s.enLabel}</div>
                            )}
                          </div>

                          {/* Radio dot */}
                          <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                            isSelected ? `${s.activeBorder} bg-white` : "border-gray-300 bg-white"
                          }`}>
                            {isSelected && (
                              <div className={`w-2.5 h-2.5 rounded-full ${s.activeDot}`} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── STEP 3: Personal Info ── */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                    {am ? "ደረጃ 3 — የግል መረጃ" : "Step 3 — Personal Info"}
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text" required
                      placeholder={am ? "ሙሉ ስምዎ" : "Full Name"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
                    />
                    <input
                      type="tel" required
                      placeholder={am ? "ስልክ ቁጥር (0911 22 33 44)" : "Phone Number (0911 22 33 44)"}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* ── Fresh Graduate Extra: Custom Year picker + GPA ── */}
                {category === "fresh" && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                      {am ? "ደረጃ 4 — ተጨማሪ መረጃ" : "Step 4 — Additional Info"}
                    </p>
                    <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 space-y-3">
                      {/* Custom Year Picker */}
                      <div>
                        <label className="block text-[11px] font-bold text-blue-700 mb-1.5 uppercase tracking-wide">
                          {am ? "የተመረቁበት ዓ.ም" : "Graduation Year"}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setYearDropOpen(!yearDropOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                          >
                            <span>{am ? selectedYear.am : selectedYear.en}</span>
                            {yearDropOpen ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-blue-500" />}
                          </button>
                          {yearDropOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border-2 border-blue-200 rounded-xl shadow-xl overflow-hidden z-20 animate-fadeIn">
                              {gradYears.map((y) => (
                                <button
                                  key={y.value}
                                  type="button"
                                  onClick={() => { setGradYear(y.value); setYearDropOpen(false); }}
                                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                                    gradYear === y.value
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="flex items-center justify-between">
                                    <span>{am ? y.am : y.en}</span>
                                    {gradYear === y.value && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* GPA Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-blue-700 mb-1.5 uppercase tracking-wide">
                          GPA ({am ? "ቢያንስ 2.1" : "Minimum 2.1"})
                        </label>
                        <input
                          type="number" step="0.01" min="2.1" max="4.0"
                          placeholder="e.g. 3.25"
                          value={gpa}
                          onChange={(e) => setGpa(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP: File Uploads ── */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                    {am ? "ሰነዶች / Documents" : "Upload Documents"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* CV Upload */}
                    <label className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all active:scale-95 ${
                      cvFile ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => e.target.files && setCvFile(e.target.files[0])}
                        className="hidden"
                      />
                      {cvFile ? (
                        <>
                          <CheckCircle2 className="w-7 h-7 text-green-500" />
                          <span className="text-[11px] font-bold text-green-700 text-center leading-tight">{cvFile.name.slice(0, 18)}{cvFile.name.length > 18 ? "…" : ""}</span>
                          <span className="text-[10px] text-green-600">✓ {am ? "ተስቅሏል" : "Uploaded"}</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-7 h-7 text-blue-400" />
                          <span className="text-xs font-bold text-gray-700 text-center leading-tight">
                            {am ? "CV / ማስረጃ" : "Resume / CV"}
                          </span>
                          <span className="text-[10px] text-gray-400">PDF / DOC</span>
                        </>
                      )}
                    </label>

                    {/* Photo Upload */}
                    <label className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all active:scale-95 ${
                      photoFile ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50"
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])}
                        className="hidden"
                      />
                      {photoFile ? (
                        <>
                          <CheckCircle2 className="w-7 h-7 text-green-500" />
                          <span className="text-[11px] font-bold text-green-700 text-center leading-tight">{photoFile.name.slice(0, 18)}{photoFile.name.length > 18 ? "…" : ""}</span>
                          <span className="text-[10px] text-green-600">✓ {am ? "ተስቅሏል" : "Uploaded"}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-7 h-7 text-purple-400" />
                          <span className="text-xs font-bold text-gray-700 text-center leading-tight">
                            {am ? "ጉርድ ፎቶ" : "Passport Photo"}
                          </span>
                          <span className="text-[10px] text-gray-400">JPG / PNG</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2.5"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {am ? "በሂደት ላይ..." : "Submitting..."}
                    </span>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5" />
                      {am ? "ማመልከቻ ያስገቡ" : "Submit Application"}
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400">
                  🔒 {am ? "መረጃዎ 100% ሚስጥራዊ ነው" : "Your information is 100% secure & confidential"}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

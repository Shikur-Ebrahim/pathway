"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { addPathwayPost } from "@/lib/db";
import { X, Upload, CheckCircle2, AlertCircle, FileText, UserCheck, ChevronDown } from "lucide-react";
import { Language, content } from "@/lib/translations";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const sectors = [
  { value: "Embassies & Diplomatic Missions", label: "🏛️ ኤምባሲዎች — Embassies & Diplomatic Missions" },
  { value: "NGOs & UN Agencies", label: "🌍 ዓለም አቀፍ ድርጅቶች — NGOs & UN Agencies" },
  { value: "Airport & Aviation Operations", label: "✈️ አቪዬሽን — Airport & Aviation Operations" },
  { value: "Foreign & International Jobs", label: "🌐 የውጭ ሀገር ስራዎች — Foreign & International Jobs" },
];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, lang }) => {
  const { user } = useAuth();

  const [category, setCategory] = useState<"fresh" | "experienced">("fresh");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [gradYear, setGradYear] = useState("2018");
  const [gpa, setGpa] = useState("");
  const [targetSector, setTargetSector] = useState(sectors[0].value);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const am = lang === "am";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 sticky top-0" />

        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            /* ── Success State ── */
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto border-4 border-green-200">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {am ? "ማመልከቻዎ ተቀብሏል!" : "Application Submitted!"}
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                  {am
                    ? "ቡድናችን ሰነዶችዎን በ 24-48 ሰዓታት ውስጥ ይገመግማል። ቴሌግራም ላይ ያለን ቀጥሉ።"
                    : "Our team will review your documents within 24-48 hours. Follow us on Telegram for updates."}
                </p>
              </div>
              <a
                href="https://t.me/pathway_agency"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg hover:bg-blue-700 transition-all"
              >
                Open @pathway_agency
              </a>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 pr-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold mb-2">
                  <UserCheck className="w-3.5 h-3.5" />
                  {am ? "ኦፊሴላዊ ምዝገባ" : "Official Job Application"}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {am ? "የስራ ማመልከቻ ቅጽ" : "Submit Your Application"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {am ? "ሁሉም መረጃ ሚስጥራዊ ሆኖ ይጠበቃል" : "All information is kept strictly confidential"}
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    {am ? "የአመልካች ዓይነት" : "Applicant Category"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory("fresh")}
                      className={`py-3 px-3 rounded-xl text-xs font-semibold border-2 transition-all text-left ${
                        category === "fresh"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="block font-bold text-sm">🎓 Fresh Graduate</span>
                      <span className="block text-[11px] opacity-70 mt-0.5">2015 – 2018 E.C.</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory("experienced")}
                      className={`py-3 px-3 rounded-xl text-xs font-semibold border-2 transition-all text-left ${
                        category === "experienced"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="block font-bold text-sm">💼 Experienced</span>
                      <span className="block text-[11px] opacity-70 mt-0.5">Employed / Pre-2015</span>
                    </button>
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{am ? "ሙሉ ስም" : "Full Name"} *</label>
                    <input
                      type="text" required placeholder="Abebe Kebede" value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{am ? "ስልክ ቁጥር" : "Phone Number"} *</label>
                    <input
                      type="tel" required placeholder="0911 22 33 44" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Target Sector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{am ? "የሚፈልጉት የስራ ዘርፍ" : "Target Job Sector"}</label>
                  <div className="relative">
                    <select
                      value={targetSector}
                      onChange={(e) => setTargetSector(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-gray-50 focus:bg-white transition-all appearance-none pr-10"
                    >
                      {sectors.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Fresh Graduate Extra Fields */}
                {category === "fresh" && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div>
                      <label className="block text-[11px] font-semibold text-blue-700 mb-1">{am ? "የተመረቁበት ዓ.ም" : "Graduation Year"}</label>
                      <select
                        value={gradYear} onChange={(e) => setGradYear(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="2018">2018 ዓ.ም (2025/26)</option>
                        <option value="2017">2017 ዓ.ም (2024/25)</option>
                        <option value="2016">2016 ዓ.ም (2023/24)</option>
                        <option value="2015">2015 ዓ.ም (2022/23)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-blue-700 mb-1">GPA (&gt;= 2.1)</label>
                      <input
                        type="number" step="0.01" min="2.1" max="4.0" placeholder="e.g. 3.25"
                        value={gpa} onChange={(e) => setGpa(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* File Uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                    <FileText className="w-6 h-6 text-blue-400 mx-auto mb-1.5" />
                    <span className="block text-xs font-semibold text-gray-700 mb-1">
                      {am ? "CV / ማስረጃ (PDF/DOC)" : "Resume / CV (PDF/DOC)"}
                    </span>
                    {cvFile
                      ? <span className="text-[11px] text-green-600 font-medium">✓ {cvFile.name}</span>
                      : <label className="cursor-pointer text-[11px] text-blue-600 font-semibold hover:underline">
                          {am ? "ፋይል ይምረጡ" : "Choose File"}
                          <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={(e) => e.target.files && setCvFile(e.target.files[0])} className="hidden" />
                        </label>
                    }
                  </div>

                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 hover:bg-purple-50/50 transition-all">
                    <Upload className="w-6 h-6 text-purple-400 mx-auto mb-1.5" />
                    <span className="block text-xs font-semibold text-gray-700 mb-1">
                      {am ? "ጉርድ ፎቶ (Passport Photo)" : "Passport Size Photo"}
                    </span>
                    {photoFile
                      ? <span className="text-[11px] text-green-600 font-medium">✓ {photoFile.name}</span>
                      : <label className="cursor-pointer text-[11px] text-purple-600 font-semibold hover:underline">
                          {am ? "ፎቶ ይምረጡ" : "Choose Photo"}
                          <input type="file" accept="image/*" onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])} className="hidden" />
                        </label>
                    }
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading
                    ? (am ? "በሂደት ላይ..." : "Uploading & Submitting...")
                    : <><UserCheck className="w-5 h-5" />{am ? "ማመልከቻ ያስገቡ" : "Submit Application"}</>}
                </button>

                <p className="text-center text-xs text-gray-400">
                  🔒 {am ? "መረጃዎ ሙሉ ለሙሉ ሚስጥራዊ ነው" : "Your information is 100% confidential & secure"}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

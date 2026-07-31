"use client";

import React, { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { addPathwayPost } from "@/lib/db";
import { X, Send, Upload, CheckCircle2, AlertCircle, FileText, UserCheck, ShieldCheck } from "lucide-react";
import { Language, content } from "@/lib/translations";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, lang }) => {
  const t = content[lang];

  const [category, setCategory] = useState<"fresh" | "experienced">("fresh");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gradYear, setGradYear] = useState("2016");
  const [gpa, setGpa] = useState("");
  const [targetSector, setTargetSector] = useState("Embassies & Diplomatic Missions");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let cvUrl = "";
      let photoUrl = "";

      if (cvFile) {
        const res = await uploadToCloudinary(cvFile);
        cvUrl = res.url;
      }

      if (photoFile) {
        const res = await uploadToCloudinary(photoFile);
        photoUrl = res.url;
      }

      // Save application record into Firestore / Local storage
      await addPathwayPost({
        title: `[App] ${fullName} - ${category.toUpperCase()} (${targetSector})`,
        description: `Phone: ${phone} | Email: ${email} | Grad Year: ${gradYear} E.C. | GPA: ${gpa || "N/A"} | Category: ${category}`,
        imageUrl: photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        authorName: fullName,
        authorEmail: email || phone,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit application. Please try via Telegram.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {lang === "am" ? "ማመልከቻዎ በፍጥነት ተመዝግቧል!" : "Application Submitted Successfully!"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {lang === "am"
                ? "ሰነዶችዎ በ Pathway Agency ቡድን እየተገመገሙ ነው። ለፈጣን ምልመላ ሂደቱ በቴሌግራም አድራሻችን ያነጋግሩን።"
                : "Your documents are under evaluation by Pathway Agency. Contact us on Telegram for fast-track processing."}
            </p>
            <div className="pt-4">
              <a
                href="https://t.me/pathway_agency"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Open @pathway_agency on Telegram</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-bold uppercase tracking-wider">
                Official Placement Registration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                {lang === "am" ? "የስራ ማመልከቻ ፎርም" : "Pathway Agency Career Application"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t.quotaNotice}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selector Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {lang === "am" ? "የአመልካች አይነት ይምረጡ" : "Select Applicant Category"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory("fresh")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left flex flex-col gap-0.5 ${
                      category === "fresh"
                        ? "bg-sky-600/20 border-sky-500 text-sky-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-extrabold text-white">🎓 0-Year Fresh Graduate</span>
                    <span className="text-[10px] opacity-80">2015 – 2018 E.C.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory("experienced")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left flex flex-col gap-0.5 ${
                      category === "experienced"
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-extrabold text-white">💼 Experienced / Pre-2015</span>
                    <span className="text-[10px] opacity-80">Employed or Experienced</span>
                  </button>
                </div>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === "am" ? "ሙሉ ስም (Full Name)" : "Full Name"} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Abebe Kebede"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === "am" ? "ስልክ ቁጥር (Phone Number)" : "Phone Number"} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0911223344"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Target Sector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === "am" ? "የሚፈልጉት የስራ ዘርፍ (Target Sector)" : "Target Career Sector"}
                </label>
                <select
                  value={targetSector}
                  onChange={(e) => setTargetSector(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-all"
                >
                  <option value="Embassies & Diplomatic Missions">🏛️ ኤምባሲዎች (Embassies & Diplomatic Missions)</option>
                  <option value="NGOs & UN Agencies">🌍 ዓለም አቀፍ ድርጅቶች (NGOs & UN Agencies)</option>
                  <option value="Airport & Aviation Operations">✈️ አቪዬሽን እና ኤርፖርት (Airport & Aviation)</option>
                  <option value="Foreign & International Jobs">🌐 የውጭ ሀገር ስራዎች (Foreign & International Jobs)</option>
                </select>
              </div>

              {/* GPA & Graduation Year for Fresh Graduates */}
              {category === "fresh" && (
                <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      የተመረቁበት ዓ.ም (Grad Year)
                    </label>
                    <select
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="2018">2018 ዓ.ም</option>
                      <option value="2017">2017 ዓ.ም</option>
                      <option value="2016">2016 ዓ.ም</option>
                      <option value="2015">2015 ዓ.ም</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      GPA (&gt;= 2.1)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 3.2"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* File Uploads (CV & Passport Photo) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="border border-dashed border-slate-800 rounded-xl p-3 text-center bg-slate-950">
                  <FileText className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-300 block">
                    Upload Resume / CV (PDF/DOC)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => e.target.files && setCvFile(e.target.files[0])}
                    className="mt-1.5 text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-sky-500/20 file:text-sky-300 hover:file:bg-sky-500/30"
                  />
                </div>

                <div className="border border-dashed border-slate-800 rounded-xl p-3 text-center bg-slate-950">
                  <Upload className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-300 block">
                    Passport Size Photo (ጉርድ ፎቶ)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])}
                    className="mt-1.5 text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-sky-500/25 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Uploading to Cloudinary & Registering...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>{lang === "am" ? "ማመልከቻውን ያስገቡ (Submit Application)" : "Submit Application Now"}</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Legal & Verified Ethiopian Placement Agency</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

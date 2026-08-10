"use client";
import React, { useState } from "react";
import { X, CheckCircle2, Search, AlertCircle, Loader2 } from "lucide-react";
import { Language } from "@/lib/translations";
import { getPathwayPosts } from "@/lib/db";

interface StatusTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const StatusTrackerModal: React.FC<StatusTrackerModalProps> = ({ isOpen, onClose, lang }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appData, setAppData] = useState<any | null>(null);

  if (!isOpen) return null;

  const t = {
    title: lang === 'am' ? 'የማመልከቻ ሁኔታ' : lang === 'or' ? 'Haala Iyyannoo' : 'Application Status',
    trackTitle: lang === 'am' ? 'ማመልከቻዎን ይፈልጉ' : lang === 'or' ? 'Iyyannoo Keessan Barbaadaa' : 'Track Your Application',
    trackDesc: lang === 'am' ? 'የማመልከቻዎን ሁኔታ ለማየት ያስመዘገቡትን ኢሜል ያስገቡ።' : lang === 'or' ? 'Haala iyyannoo keessanii arguuf e-mail galmeessitan galchaa.' : 'Enter your registered email address to check your application status.',
    emailLabel: lang === 'am' ? 'የኢሜል አድራሻ' : lang === 'or' ? 'Teessoo E-mail' : 'Email Address',
    searchBtn: lang === 'am' ? 'ፈልግ' : lang === 'or' ? 'Barbaadi' : 'Search',
    notFound: lang === 'am' ? 'በዚህ ኢሜል የተመዘገበ ማመልከቻ አልተገኘም። እባክዎ ኢሜልዎን ያረጋግጡ።' : lang === 'or' ? 'Iyyannoon e-mail kanaan galmaa\'e hin argamne. Maaloo e-mail keessan mirkaneessaa.' : 'No application found for this email. Please check and try again.',
    accepted: lang === 'am' ? 'ተቀባይነት አግኝቷል' : lang === 'or' ? 'Fudhatameera' : 'Accepted',
    congrats: lang === 'am' ? 'እንኳን ደስ አለዎት! ማመልከቻዎ ተቀባይነት አግኝቷል። ቡድናችን በቅርቡ ያነጋግርዎታል።' : lang === 'or' ? 'Baga gamaddan! Iyyannoon keessan fudhatameera. Gareen keenya dhiyeenyatti isin qunnama.' : 'Congratulations! Your application has been accepted. Our team will contact you shortly.',
    details: lang === 'am' ? 'የማመልከቻ ዝርዝሮች' : lang === 'or' ? 'Bal\'ina Iyyannoo' : 'Application Details',
    name: lang === 'am' ? 'ስም' : lang === 'or' ? 'Maqaa' : 'Name',
    email_lbl: lang === 'am' ? 'ኢሜል' : lang === 'or' ? 'E-mail' : 'Email',
    phone: lang === 'am' ? 'ስልክ' : lang === 'or' ? 'Bilbila' : 'Phone',
    sector: lang === 'am' ? 'ዘርፍ' : lang === 'or' ? 'Damee' : 'Sector',
    role: lang === 'am' ? 'ሚና' : lang === 'or' ? 'Gahee' : 'Role',
    searchAgain: lang === 'am' ? 'አዲስ ፍለጋ ያድርጉ' : lang === 'or' ? 'Barbaacha Haaraa Godhaa' : 'Search Again',
    errGeneric: lang === 'am' ? 'ስህተት አጋጥሟል። እባክዎ ዳግም ይሞክሩ።' : lang === 'or' ? 'Dogoggora uumameera. Maaloo irra deebi\'aa yaali.' : 'An error occurred. Please try again.',
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setAppData(null);
    try {
      const posts = await getPathwayPosts();
      const apps = posts.filter((p: any) => p.title?.startsWith('[App]'));
      const found = apps.find((a: any) =>
        a.authorEmail?.toLowerCase() === email.toLowerCase().trim() ||
        a.formData?.personal?.email?.toLowerCase() === email.toLowerCase().trim()
      );
      if (found) {
        setAppData(found.formData);
      } else {
        setError(t.notFound);
      }
    } catch {
      setError(t.errGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-[420px] max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-[18px] font-black text-gray-900">{t.title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {!appData ? (
            <>
              <div className="text-center pt-2">
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-[20px] font-black text-gray-900 mb-2">{t.trackTitle}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{t.trackDesc}</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4 pt-2 pb-6">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{t.emailLabel} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-start gap-2.5 text-[13px] font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all text-[16px] shadow-md"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  {loading ? '...' : t.searchBtn}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-5 pb-8">
              {/* Accepted Card */}
              <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm">
                <h3 className="text-2xl font-black text-green-700 flex items-center justify-center gap-2 mb-3">
                  {t.accepted}
                  <span className="bg-green-100 rounded-lg p-1"><CheckCircle2 className="w-5 h-5 text-green-600" /></span>
                </h3>
                <p className="text-green-800 text-[14px] font-medium leading-relaxed">{t.congrats}</p>
              </div>

              {/* Details Card */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t.details}</p>
                <div className="space-y-3">
                  {[
                    { label: t.name, value: appData?.personal?.fullName },
                    { label: t.email_lbl, value: appData?.personal?.email },
                    { label: t.phone, value: appData?.personal?.phone ? `+251${appData.personal.phone}` : null },
                    { label: t.sector, value: appData?.sector },
                    { label: t.role, value: appData?.sectorSpecific?.subCategory },
                  ].filter(i => i.value).map((item, idx, arr) => (
                    <div key={idx} className={`flex justify-between items-start gap-4 ${idx < arr.length - 1 ? 'border-b border-gray-200/60 pb-3' : ''}`}>
                      <span className="text-[14px] text-gray-500 shrink-0">{item.label}</span>
                      <span className="text-[14px] font-bold text-gray-900 text-right break-all">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => { setAppData(null); setEmail(""); setError(null); }} className="w-full text-blue-600 font-bold text-[14px] py-2 text-center">
                {t.searchAgain}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

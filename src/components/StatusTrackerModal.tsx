"use client";
import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Briefcase, Search, Loader2, User, Phone, BookOpen, ChevronDown, ChevronUp, FileCheck, Star, Globe } from "lucide-react";

import { Language } from "@/lib/translations";
import { getPathwayPosts } from "@/lib/db";

interface Props { isOpen: boolean; onClose: () => void; lang: Language; }

const T = (lang: string, en: string, am: string, or_: string) =>
  lang === "am" ? am : lang === "or" ? or_ : en;

function SectionCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const hasContent = React.Children.toArray(children).some(Boolean);
  if (!hasContent) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 py-4 space-y-3">{children}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
      <span className="text-[13px] text-gray-500 shrink-0">{label}:</span>
      <span className="text-[13px] font-semibold text-gray-900 break-words">{value}</span>
    </div>
  );
}

export const StatusTrackerModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appData, setAppData] = useState<any | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true); setError(null); setAppData(null); setPhotoUrl(null);
    try {
      const posts = await getPathwayPosts();
      const apps = posts.filter((p: any) => p.title?.startsWith("[App]"));
      const found = apps.find((a: any) =>
        a.authorEmail?.toLowerCase() === email.toLowerCase().trim() ||
        a.formData?.personal?.email?.toLowerCase() === email.toLowerCase().trim()
      );
      if (found) {
        setAppData(found.formData);
        setPhotoUrl(found.formData?.uploadedUrls?.passportPhoto || found.imageUrl || null);
      } else {
        setError(T(lang,
          "No application found for this email. Please check and try again.",
          "በዚህ ኢሜል የተመዘገበ ማመልከቻ አልተገኘም። እባክዎ ኢሜልዎን ያረጋግጡ።",
          "Iyyannoon e-mail kanaan galmaaye hin argamne. Maaloo e-mail keessan mirkaneessaa."
        ));
      }
    } catch {
      setError(T(lang, "An error occurred. Please try again.", "ስህተት አጋጥሟል።", "Dogoggora uumameera."));
    } finally {
      setLoading(false);
    }
  };

  const d = appData;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-[430px] h-[96vh] sm:h-[90vh] bg-gray-50 rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-white border-b border-gray-100 shrink-0">
          <h2 className="text-[17px] font-black text-gray-900">
            {T(lang, "Application Status", "የማመልከቻ ሁኔታ", "Haala Iyyannoo")}
          </h2>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!d ? (
            /* Search Form */
            <div className="px-5 py-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-[20px] font-black text-gray-900 mb-2">
                  {T(lang, "Track Your Application", "ማመልከቻዎን ይፈልጉ", "Iyyannoo Keessan Barbaadaa")}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed max-w-[300px] mx-auto">
                  {T(lang,
                    "Enter the email you used during your application to see your full profile and status.",
                    "ማመልከቻ ሲያስገቡ የተጠቀሙትን ኢሜል ያስገቡ፤ ሙሉ መገለጫዎን ያያሉ።",
                    "Iyyannoo yeroo galchitan e-mail fayyadamtan galchaa; barruulee guutuu keessan ni argitu."
                  )}
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
                    {T(lang, "Email Address", "የኢሜል አድራሻ", "Teessoo E-mail")} *
                  </label>
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-2.5 text-[13px] text-red-700 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all text-[16px] shadow-lg"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  {loading ? "..." : T(lang, "Search", "ፈልግ", "Barbaadi")}
                </button>
              </form>
            </div>
          ) : (
            /* Profile / Application View */
            <div className="pb-10">

              {/* Acceptance Hero Banner */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-500 px-5 pt-6 pb-10">
                <div className="flex items-center gap-2 mb-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span className="text-[12px] font-bold text-white uppercase tracking-widest">
                    {T(lang, "Accepted", "ተቀባይነት አግኝቷል", "Fudhatameera")}
                  </span>
                </div>
                <h2 className="text-[22px] font-black text-white leading-tight mb-1">
                  {T(lang, "Congratulations! 🎉", "እንኳን ደስ አለዎት! 🎉", "Baga Gamaddan! 🎉")}
                </h2>
                <p className="text-[14px] text-green-100 leading-relaxed">
                  {T(lang,
                    "Your application has been accepted. Our team will contact you soon.",
                    "ማመልከቻዎ ተቀባይነት አግኝቷል። ቡድናችን በቅርቡ ያነጋግርዎታል።",
                    "Iyyannoon keessan fudhatameera. Gareen keenya dhiyeenyatti isin qunnama."
                  )}
                </p>
              </div>

              {/* Profile Card floating */}
              <div className="px-4 -mt-6 mb-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 border-2 border-white shadow-md overflow-hidden shrink-0">
                    {photoUrl
                      ? <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                          <User className="w-8 h-8 text-blue-400" />
                        </div>
                    }
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-black text-gray-900 truncate">{d.personal?.fullName}</h3>
                    <p className="text-[13px] text-blue-600 font-semibold">{d.sector} · {d.sectorSpecific?.subCategory}</p>
                    <p className="text-[12px] text-gray-400 capitalize mt-0.5">{d.status?.replace("_", " ")}</p>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="px-4 space-y-3">

                <SectionCard icon={User} title={T(lang, "Personal Info", "የግል መረጃ", "Odeeffannoo Dhuunfaa")}>
                  <Row label={T(lang,"Full Name","ሙሉ ስም","Maqaa Guutuu")} value={d.personal?.fullName} />
                  <Row label={T(lang,"Gender","ፆታ","Saala")} value={d.personal?.gender} />
                  <Row label={T(lang,"Date of Birth","የትውልድ ቀን","Guyyaa Dhalootaa")} value={d.personal?.dob} />
                  <Row label={T(lang,"Nationality","ዜግነት","Biyyummaa")} value={d.personal?.nationality} />
                </SectionCard>

                <SectionCard icon={Phone} title={T(lang,"Contact","ግኑኝነት","Quunnamtii")}>
                  <Row label={T(lang,"Phone","ስልክ","Bilbila")} value={d.personal?.phone ? `+251${d.personal.phone}` : undefined} />
                  <Row label={T(lang,"Email","ኢሜል","E-mail")} value={d.personal?.email} />
                </SectionCard>

                <SectionCard icon={Briefcase} title={T(lang,"Job Application","የስራ ማመልከቻ","Iyyannoo Hojii")}>
                  <Row label={T(lang,"Status","ሁኔታ","Haala")} value={d.status} />
                  <Row label={T(lang,"Sector","ዘርፍ","Damee")} value={d.sector} />
                  <Row label={T(lang,"Role","ሚና","Gahee")} value={d.sectorSpecific?.subCategory} />
                </SectionCard>

                <SectionCard icon={BookOpen} title={T(lang,"Education","ትምህርት","Barnootaa")}>
                  <Row label={T(lang,"Highest Level","ከፍተኛ ትምህርት","Barnootaa Olaanaa")} value={d.education?.highestLevel} />
                  <Row label={T(lang,"School / University","ትምህርት ቤት","Mana Barumsaa")} value={d.education?.university} />
                  <Row label={T(lang,"Field of Study","የትምህርት ዘርፍ","Damee Qorannoo")} value={d.education?.field} />
                  <Row label={T(lang,"Graduation Year","የተመረቁበት ዓ.ም.","Bara Eebbaa")} value={d.education?.gradYear} />
                  <Row label={T(lang,"CGPA","ውጤት (CGPA)","Qabxii (CGPA)")} value={d.education?.cgpa} />
                </SectionCard>

                {d.status === "fresh" && (
                  <SectionCard icon={Star} title={T(lang,"Experience & Skills","ልምድ እና ክህሎቶች","Muuxannoo fi Dandeettii")}>
                    <Row label={T(lang,"Internship","የሥራ ልምምድ","Leenjii")} value={d.experience?.internship} />
                    <Row label={T(lang,"Volunteer","በጎ ፈቃደኛ","Fedhii")} value={d.experience?.volunteer} />
                    <Row label={T(lang,"Projects","ፕሮጀክቶች","Pirojektoota")} value={d.experience?.projects} />
                    <Row label={T(lang,"Skills","ክህሎቶች","Dandeettii")} value={d.experience?.skills} />
                    <Row label={T(lang,"Languages","ቋንቋዎች","Afaanota")} value={d.experience?.languages} />
                    <Row label={T(lang,"Computer Skills","የኮምፒውተር ክህሎቶች","Dandeettii Kompiyuutaraa")} value={d.experience?.computerSkills} />
                  </SectionCard>
                )}

                {d.status === "experienced" && (
                  <SectionCard icon={Star} title={T(lang,"Work Experience","የስራ ልምድ","Muuxannoo Hojii")}>
                    <Row label={T(lang,"Years","ዓመታት","Waggaa")} value={d.experience?.yearsOfExperience} />
                    <Row label={T(lang,"Current Employer","አሁን ያሉበት","Bakka Ammaa")} value={d.experience?.currentEmployer} />
                    <Row label={T(lang,"Current Position","የአሁኑ ቦታ","Iddoo Ammaa")} value={d.experience?.currentPosition} />
                    <Row label={T(lang,"Previous Employer","ቀዳሚ ቦታ","Bakka Duraanii")} value={d.experience?.previousEmployer} />
                    <Row label={T(lang,"Employment Type","የቅጥር ዓይነት","Gosa Qaxarsa")} value={d.experience?.employmentType} />
                    <Row label={T(lang,"Professional Skills","ሙያዊ ክህሎቶች","Dandeettii Ogummaa")} value={d.experience?.professionalSkills} />
                  </SectionCard>
                )}

                <SectionCard icon={Globe} title={T(lang,"Sector Details","የዘርፍ ዝርዝሮች","Bal'ina Damee")}>
                  <Row label={T(lang,"English Level","የእንግሊዝኛ ደረጃ","Sadarkaa Afaan Inglizii")} value={d.sectorSpecific?.englishLevel} />
                  <Row label={T(lang,"Other Languages","ሌሎች ቋንቋዎች","Afaanota Biroo")} value={d.sectorSpecific?.otherLanguages} />
                  <Row label={T(lang,"Preferred Country","የሚፈልጉት ሀገር","Biyya Filatan")} value={d.sectorSpecific?.preferredCountry} />
                  <Row label={T(lang,"Passport Available","ፓስፖርት አለ?","Paaspoortii Qabduu?")} value={d.sectorSpecific?.passportAvailable} />
                  <Row label={T(lang,"Ready to Relocate","ሌላ ቦታ መሄድ","Bakka Jijjiiruu")} value={d.sectorSpecific?.readyToRelocate} />
                  <Row label={T(lang,"NGO Experience","NGO ልምድ","Muuxannoo NGO")} value={d.sectorSpecific?.ngoExperience} />
                  <Row label={T(lang,"Customer Service","ደንበኛ አገልግሎት","Tajaajila Maamilaa")} value={d.sectorSpecific?.customerService} />
                  <Row label={T(lang,"Shift Availability","ሺፍት ዝግጁ?","Shiftii Qophiidha?")} value={d.sectorSpecific?.shiftAvailability} />
                </SectionCard>

                {d.uploadedUrls && d.uploadedUrls.passportPhoto && (
                  <SectionCard icon={FileCheck} title={T(lang,"Uploaded Documents","የተሰቀሉ ሰነዶች","Sanadoota Olkaafaman")}>
                    <div>
                      <p className="text-[12px] font-bold text-gray-500 mb-2">{T(lang,"National ID Photo","የመታወቂያ ፎቶ","Waraqaa Eenyummaa")}</p>
                      <img src={d.uploadedUrls.passportPhoto} alt="National ID" className="w-48 h-32 object-cover rounded-xl border border-gray-200 shadow-sm" />
                    </div>
                  </SectionCard>
                )}

                <button
                  onClick={() => { setAppData(null); setEmail(""); setError(null); setPhotoUrl(null); }}
                  className="w-full text-blue-600 font-bold text-[14px] py-3 text-center"
                >
                  {T(lang, "← Search Again", "← አዲስ ፍለጋ", "← Barbaacha Haaraa")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

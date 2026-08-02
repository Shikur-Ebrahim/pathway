"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { addPathwayPost, getPaymentSettings, checkExistingApplication, PathwayItem, PaymentConfig } from "@/lib/db";
import {
  X, CheckCircle2, ChevronLeft, ChevronDown, Building2, Globe2, Plane, AlertCircle, FileText, Upload, Trash2
} from "lucide-react";
import { Language } from "@/lib/translations";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const SECTORS = [
  {
    id: "embassy", emoji: "🏛️",
    title: "Embassy & Diplomatic Missions",
    desc: "Administrative, Secretarial, Finance, IT and Technical Positions."
  },
  {
    id: "ngo", emoji: "🌍",
    title: "NGOs & UN Agencies",
    desc: "Development, Humanitarian, Project Management and Administration."
  },
  {
    id: "airport", emoji: "✈️",
    title: "Airport & Aviation",
    desc: "Airport Operations, Customer Service, Ground Handling, Cargo and Logistics."
  },
  {
    id: "foreign", emoji: "🌐",
    title: "Foreign Employment",
    desc: "Verified International Employment Opportunities."
  }
];

const SUB_CATEGORIES: Record<string, string[]> = {
  embassy: ["Administrative", "Secretarial", "Finance", "IT", "Technical Positions", "Other"],
  ngo: ["Development", "Humanitarian", "Project Management", "Administration", "Other"],
  airport: ["Airport Operations", "Customer Service", "Ground Handling", "Cargo and Logistics", "Other"],
  foreign: ["Domestic Work", "Technical Skills", "Hospitality", "Construction", "Other"]
};

const InputField = ({ label, section, field, type = "text", required = false, options = [], formData, updateForm, min, max, step, placeholder }: any) => {
  const val = formData[section][field];
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options.length > 0 ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left"
          >
            <span className={val ? "text-gray-900 font-medium" : "text-gray-400"}>{val || "Select an option"}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <>
              {/* Invisible backdrop for mobile to dismiss */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsOpen(false)} 
              />
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-fadeIn max-h-[250px] overflow-y-auto">
                {options.map((opt: string) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      updateForm(section, field, opt);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3.5 text-[15px] transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between ${
                      val === opt ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    {opt}
                    {val === opt && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : type === "textarea" ? (
         <textarea
          required={required}
          value={val}
          onChange={(e) => updateForm(section, field, e.target.value)}
          rows={3}
          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      ) : type === "tel" ? (
        <div className="flex bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden">
          <div className="px-4 py-3.5 bg-gray-100/70 border-r border-gray-200 text-gray-700 font-bold text-[15px] select-none flex items-center justify-center shrink-0">
            +251
          </div>
          <input
            type="tel"
            required={required}
            value={val}
            placeholder="9 or 7 _ _ _ _ _ _ _"
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, '');
              if (v.startsWith('251')) v = v.substring(3);
              if (v.startsWith('0')) v = v.substring(1);
              if (v.length > 0 && v[0] !== '9' && v[0] !== '7') {
                v = v.substring(1); // Remove the invalid first character
              }
              v = v.substring(0, 9);
              updateForm(section, field, v);
            }}
            className="w-full px-4 py-3.5 bg-transparent text-[15px] font-medium text-gray-900 focus:outline-none placeholder:text-gray-400"
          />
        </div>
      ) : (
        <>
          <input
            type={type}
            required={required}
            value={val}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            onChange={(e) => {
              const newVal = e.target.value;
              if (max !== undefined && newVal !== '' && parseFloat(newVal) > parseFloat(max)) return;
              updateForm(section, field, newVal);
            }}
            className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${val && max !== undefined && parseFloat(val) > parseFloat(max) ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {val && max !== undefined && parseFloat(val) > parseFloat(max) && (
            <p className="mt-1.5 ml-1 text-[12px] font-semibold text-red-500">⚠️ Grade cannot be above {max}</p>
          )}
        </>
      )}
    </div>
  );
};

const FileUploadCard = ({ id, label, required = false, accept = ".pdf,.doc,.docx,image/*", files, handleFileChange }: any) => {
  const file = files[id];
  return (
    <div className="mb-4">
       <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
        file ? 'border-green-400 bg-green-50/50' : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300'
      }`}>
        <input
          type="file" accept={accept}
          onChange={(e) => e.target.files && handleFileChange(id, e.target.files[0])}
          className="hidden"
        />
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${file ? 'bg-green-100 text-green-600' : 'bg-white shadow-sm text-gray-400 border border-gray-100'}`}>
          {file ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          {file ? (
            <>
              <p className="text-[14px] font-bold text-gray-900 truncate">{file.name}</p>
              <p className="text-[12px] font-medium text-green-600">Ready to upload</p>
            </>
          ) : (
            <>
               <p className="text-[14px] font-bold text-gray-700">Tap to upload</p>
               <p className="text-[12px] text-gray-400">PDF, DOC, JPG, PNG</p>
            </>
          )}
        </div>
        {file && (
          <button 
            type="button" 
            onClick={(e) => { e.preventDefault(); handleFileChange(id, null); }}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </label>
    </div>
  );
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, lang }) => {
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [existingApp, setExistingApp] = useState<PathwayItem | null | undefined>(undefined); // undefined=loading, null=none
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  useEffect(() => {
    if (isOpen && !paymentConfig) {
      getPaymentSettings().then((config) => {
        setPaymentConfig(config);
        if (config.cbe.active) setSelectedBank('cbe');
        else if (config.telebirr.active) setSelectedBank('telebirr');
        else if (config.boa.active) setSelectedBank('boa');
        else if (config.awash.active) setSelectedBank('awash');
      });
    }
    // Check if user already applied
    if (isOpen && user?.email && existingApp === undefined) {
      checkExistingApplication(user.email, '').then(app => setExistingApp(app));
    }
  }, [isOpen, paymentConfig, user, existingApp]);
  
  // Data State
  const [formData, setFormData] = useState<any>({
    status: "", // "fresh" | "experienced"
    sector: "", // "embassy" | "ngo" | "airport" | "foreign"
    personal: {
      fullName: "", gender: "", dob: "", phone: "", email: user?.email || "",
      region: "", city: "", currentAddress: "", nationality: "Ethiopian", nationalId: ""
    },
    education: {
      highestLevel: "", university: "", field: "", gradYear: "", cgpa: ""
    },
    experience: {
      // Fresh
      internship: "", volunteer: "", projects: "", skills: "", languages: "", computerSkills: "",
      // Experienced
      yearsOfExperience: "", currentEmployer: "", currentPosition: "", previousEmployer: "", employmentType: "", currentSalary: "", professionalSkills: "", leadershipExperience: "", references: ""
    },
    sectorSpecific: {
      subCategory: "",
      // Embassy
      englishLevel: "", otherLanguages: "", embassyComputerSkills: "", securityClearance: "", typingSkills: "", motivationLetter: "",
      // NGO
      ngoExperience: "", projectManagement: "", communityDevelopment: "", proposalWriting: "", reportWriting: "", donorExperience: "",
      // Airport
      customerService: "", groundHandling: "", cargoExperience: "", shiftAvailability: "", physicalFitness: "", travelAvailability: "",
      // Foreign
      preferredCountry: "", passportAvailable: "", passportNumber: "", passportExpiry: "", readyToRelocate: "", medicalCertificate: "", policeClearance: ""
    },
    declarations: {
      isTrue: false,
      shareProfile: false
    }
  });

  // File States
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    cv: null,
    educationalCert: null,
    experienceCert: null,
    passportPhoto: null,
    passport: null
  });

  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // ——— Already Applied Screen ———
  if (existingApp !== undefined && existingApp !== null) {
    const appStatus = existingApp.applicationStatus || existingApp.formData?.applicationStatus;
    const statusColor = appStatus === 'accepted' ? 'green' : appStatus === 'interview' ? 'blue' : 'amber';
    const statusLabel = appStatus === 'accepted' 
      ? (lang === 'am' ? 'ተቀባይነት አግኝቷል ✅' : lang === 'or' ? 'Fudhatameera ✅' : 'Accepted ✅') 
      : appStatus === 'interview' 
      ? (lang === 'am' ? 'ለቃለ መጠይቅ ተመርጠዋል 📅' : lang === 'or' ? 'Qormaanni Afaanii Qabameera 📅' : 'Interview Scheduled 📅') 
      : (lang === 'am' ? 'በግምገማ ላይ ⏳' : lang === 'or' ? 'Gamaaggamamaa Jira ⏳' : 'Under Review ⏳');
    const statusDesc = appStatus === 'accepted'
      ? (lang === 'am' ? 'እንኳን ደስ አለዎት! ማመልከቻዎ ተቀባይነት አግኝቷል። ቡድናችን በቅርቡ ያነጋግርዎታል።' : lang === 'or' ? 'Baga gammadan! Iyyannoon keessan fudhatameera. Gareen keenya dhiyeenyatti isin quunnama.' : 'Congratulations! Your application has been accepted. Our team will contact you shortly.')
      : appStatus === 'interview'
      ? (lang === 'am' ? 'ምርጥ ዜና! ለቃለ መጠይቅ ተመርጠዋል። እባክዎ እስክናነጋግርዎ ይጠብቁ።' : lang === 'or' ? 'Oduu gaarii! Qormaata afaaniif filatamtaniittu. Maaloo hanga isin quunnamnutti eegaa.' : 'Great news! You have been selected for an interview. Please wait for our contact.')
      : (lang === 'am' ? 'ማመልከቻዎ ደርሶናል እና በአሁኑ ጊዜ በግምገማ ላይ ነው። ሲጠናቀቅ በኢሜል እናሳውቅዎታለን።' : lang === 'or' ? 'Iyyannoon keessan nu gaheera, ammas gamaaggamamaa jira. Akkuma xumurameen e-mail dhaan isin beeksisna.' : 'Your application has been received and is currently under review. We will notify you via email once processed.');
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
        <div className="w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[16px] font-black text-gray-900">{lang === 'am' ? 'የማመልከቻ ሁኔታ' : lang === 'or' ? 'Haala Iyyannoo' : 'Application Status'}</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-6 space-y-5">
            <div className={`p-5 rounded-2xl border-2 ${
              statusColor === 'green' ? 'bg-green-50 border-green-200' :
              statusColor === 'blue' ? 'bg-blue-50 border-blue-200' :
              'bg-amber-50 border-amber-200'
            } text-center`}>
              <p className={`text-[22px] font-black mb-1 ${
                statusColor === 'green' ? 'text-green-700' : statusColor === 'blue' ? 'text-blue-700' : 'text-amber-700'
              }`}>{statusLabel}</p>
              <p className={`text-[13px] font-medium ${
                statusColor === 'green' ? 'text-green-600' : statusColor === 'blue' ? 'text-blue-600' : 'text-amber-600'
              }`}>{statusDesc}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{lang === 'am' ? 'የማመልከቻ ዝርዝሮች' : lang === 'or' ? "Bal'ina Iyyannoo" : 'Application Details'}</p>
              <div className="flex justify-between"><span className="text-[13px] text-gray-500">{lang === 'am' ? 'ስም' : lang === 'or' ? 'Maqaa' : 'Name'}</span><span className="text-[13px] font-bold text-gray-900">{existingApp.formData?.personal?.fullName || existingApp.authorName}</span></div>
              <div className="flex justify-between"><span className="text-[13px] text-gray-500">{lang === 'am' ? 'ዘርፍ' : lang === 'or' ? 'Damee' : 'Sector'}</span><span className="text-[13px] font-bold text-gray-900">{existingApp.formData?.sector}</span></div>
              <div className="flex justify-between"><span className="text-[13px] text-gray-500">{lang === 'am' ? 'የስራ ድርሻ' : lang === 'or' ? 'Gahee' : 'Role'}</span><span className="text-[13px] font-bold text-gray-900">{existingApp.formData?.sectorSpecific?.subCategory}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const updateForm = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const scrollBodyToTop = () => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  };

  const handleNext = () => {
    scrollBodyToTop();
    setStep(s => Math.min(s + 1, 7));
  };
  
  const handleBack = () => {
    scrollBodyToTop();
    setStep(s => Math.max(s - 1, 1));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      // 0. Check for duplicates by phone or email
      const duplicate = await checkExistingApplication(
        formData.personal.email,
        formData.personal.phone
      );
      if (duplicate) {
        setExistingApp(duplicate);
        setLoading(false);
        return;
      }

      // 1. Upload files
      const uploadedUrls: any = {};
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const res = await uploadToCloudinary(file);
          uploadedUrls[key] = res.url;
        }
      }
      setFileUrls(uploadedUrls);

      // 2. Save to Firestore
      const finalData = { ...formData, uploadedUrls };
      
      await addPathwayPost({
        title: `[App] ${formData.personal.fullName} - ${formData.sectorSpecific.subCategory} in ${formData.sector} (${formData.status})`,
        description: `Phone: +251${formData.personal.phone} | Email: ${formData.personal.email}`,
        imageUrl: uploadedUrls.passportPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        authorName: formData.personal.fullName,
        authorEmail: formData.personal.email || formData.personal.phone,
        formData: finalData
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  // Determine what steps can proceed
  let canProceed = false;
  if (step === 1) canProceed = !!formData.status;
  if (step === 2) canProceed = !!formData.sector && !!formData.sectorSpecific.subCategory;
  if (step === 3) canProceed = !!formData.personal.fullName && !!formData.personal.gender && formData.personal.phone?.length === 9 && !!formData.personal.email && !!formData.personal.region && !!formData.personal.city;
  if (step === 4) {
    const eduDone = !!formData.education.highestLevel && !!formData.education.university && !!formData.education.field && !!formData.education.gradYear;
    const expDone = formData.status === 'experienced'
      ? !!formData.experience.yearsOfExperience && !!formData.experience.currentEmployer && !!formData.experience.currentPosition
      : true;
    canProceed = eduDone && expDone;
  }
  if (step === 5) {
    if (formData.sector === 'embassy') canProceed = !!formData.sectorSpecific.englishLevel;
    else if (formData.sector === 'ngo') canProceed = !!formData.sectorSpecific.ngoExperience;
    else if (formData.sector === 'airport') canProceed = !!formData.sectorSpecific.customerService && !!formData.sectorSpecific.shiftAvailability;
    else if (formData.sector === 'foreign') canProceed = !!formData.sectorSpecific.preferredCountry && !!formData.sectorSpecific.passportAvailable && !!formData.sectorSpecific.readyToRelocate;
    else canProceed = true;
  }
  if (step === 6) canProceed = !!files.cv && !!files.passportPhoto;
  if (step === 7) canProceed = formData.declarations.isTrue && formData.declarations.shareProfile && !!files.paymentScreenshot;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm sm:p-4">
      {/* Container max-w-[420px] for mobile-first feel */}
      <div className="relative w-full h-full sm:h-[90vh] sm:max-h-[850px] max-w-[420px] bg-white sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="shrink-0 bg-white border-b border-gray-100 z-10 px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {step > 1 && !submitted && (
               <button onClick={handleBack} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                 <ChevronLeft className="w-5 h-5" />
               </button>
             )}
             <div>
               <h2 className="text-[16px] font-bold text-gray-900 leading-tight">{lang === 'am' ? 'የስራ ማመልከቻ' : lang === 'or' ? 'Iyyannoo Hojii' : 'Job Application'}</h2>
               <p className="text-[12px] font-medium text-gray-400">{lang === 'am' ? `ደረጃ ${step} ከ 7` : lang === 'or' ? `Sadarkaa ${step} 7 keessaa` : `Step ${step} of 7`}</p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100">
             <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!submitted && (
          <div className="h-1 w-full bg-gray-100 shrink-0">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out" style={{ width: `${(step / 7) * 100}%` }} />
          </div>
        )}

        {/* Body Content */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-6 hide-scrollbar relative bg-gray-50/30">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-[14px]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pb-20 px-4">
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center border-[6px] border-green-100">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-gray-900">{lang === 'am' ? 'ማመልከቻ ገብቷል! 🎉' : lang === 'or' ? 'Iyyannoon Ergameera! 🎉' : 'Application Submitted! 🎉'}</h2>
                 <p className="text-[15px] text-gray-500 leading-relaxed">
                   {lang === 'am' ? 'መገለጫዎ በተሳካ ሁኔታ ተፈጥሯል። ቡድናችን ማመልከቻዎን በቅርቡ ይገመግማል።' : lang === 'or' ? "Pirofaayilli keessan milkaa'inaan uumameera. Gareen keenya dhiyeenyatti iyyannoo keessan ni gamaaggama." : 'Your profile has been created successfully. Our team will review your application soon.'}
                 </p>
              </div>

              {/* Email notification info card */}
              <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="text-base">📧</span>
                  </div>
                  <p className="text-[13px] font-bold text-blue-800 uppercase tracking-wide">{lang === 'am' ? 'ቀጣዩ ምንድነው?' : lang === 'or' ? "Itti Aansuun Maaltu Ta'a?" : 'What Happens Next?'}</p>
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {lang === 'am' ? (
                    <>ቡድናችን ማመልከቻዎን ከገመገመ እና <strong>ከተቀበለ</strong> በኋላ፣ በቀጥታ ከ <span className="text-blue-700 font-semibold">Pathway Agency Ethiopia</span> <strong>የኢሜል ማሳወቂያ</strong> ይደርስዎታል።</>
                  ) : (
                    <>After our team reviews and <strong>accepts</strong> your application, you will receive an <strong>email notification</strong> directly from <span className="text-blue-700 font-semibold">Pathway Agency Ethiopia</span>.</>
                  )}
                </p>
                <div className="bg-white/70 rounded-xl p-3 flex items-start gap-2.5 border border-blue-100">
                  <span className="text-lg mt-0.5">🍀</span>
                  <p className="text-[13px] text-gray-700 font-medium leading-relaxed">
                    {lang === 'am' ? (
                      <><strong>መልካም ዕድል!</strong> የህልምዎን የስራ እድል እንዲያገኙ ለመርዳት እንጠባበቃለን።</>
                    ) : (
                      <><strong>Good Luck!</strong> We look forward to helping you secure your dream career opportunity.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="pb-24">
              
              {/* STEP 1: Career Status */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-6">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'እንኳን ወደ Pathway በደህና መጡ!' : lang === 'or' ? 'Baga gara Pathway nagaan dhuftan!' : 'Welcome to Pathway!'}</h1>
                    <p className="text-[15px] text-gray-500 leading-relaxed">{lang === 'am' ? 'እንጀምር። መጀመሪያ ማመልከቻዎን ለማስተካከል እንዲረዳን ስለአሁኑ የስራ ሁኔታዎ ይንገሩን።' : lang === 'or' ? 'Mee haa jalqabnu. Jalqaba, iyyannoo keessan sirreessuuf akka nu gargaarutti haala hojii keessan ammaa nuuf himaa.' : 'Let\'s get you started. First, tell us about your current career status so we can tailor your application.'}</p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setFormData((p: any) => ({ ...p, status: 'fresh' }))}
                      className={`w-full text-left p-5 rounded-[20px] border-2 transition-all ${
                        formData.status === 'fresh' ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-3xl">🎓</div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.status === 'fresh' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {formData.status === 'fresh' && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <h3 className="text-[17px] font-bold text-gray-900 mb-1">{lang === 'am' ? 'አዲስ ተመራቂ' : lang === 'or' ? 'Eebbifamaa Haaraa' : 'Fresh Graduate'}</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{lang === 'am' ? 'በቅርቡ የተመረቁ (2015-2018 ዓ.ም) እና የመጀመሪያ ሙያዊ እድልዎን የሚፈልጉ።' : lang === 'or' ? 'Dhiyeenya kan eebbifaman (2015–2018 B.A) fi carraa hojii ogummaa jalqabaa barbaadaa kan jiran.' : 'Recently graduated (2015–2018 E.C.) and looking for your first professional opportunity.'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(lang === 'am' ? ['የ0 ዓመት ልምድ', 'ማንኛውም ዘርፍ', 'የስራ ታሪክ አያስፈልግም'] : lang === 'or' ? ['Muuxannoo Waggaa 0', 'Damee Kamiyyuu', 'Seenaan Hojii Hin Barbaadamu'] : ['0 Years Exp', 'Any Sector', 'No Work History Needed']).map(tag => (
                          <span key={tag} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${ formData.status === 'fresh' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500' }`}>{tag}</span>
                        ))}
                      </div>
                    </button>

                    <button
                      onClick={() => setFormData((p: any) => ({ ...p, status: 'experienced' }))}
                      className={`w-full text-left p-5 rounded-[20px] border-2 transition-all ${
                        formData.status === 'experienced' ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-3xl">💼</div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.status === 'experienced' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {formData.status === 'experienced' && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <h3 className="text-[17px] font-bold text-gray-900 mb-1">{lang === 'am' ? 'ልምድ ያለው ባለሙያ' : lang === 'or' ? 'Ogeessa Muuxannoo Qabu' : 'Experienced Professional'}</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{lang === 'am' ? 'በአሁኑ ጊዜ የሚሰሩ ወይም ከ2015 ዓ.ም በፊት የተመረቁ እና የስራ ልምድ ያላቸው።' : lang === 'or' ? 'Amma hojjechaa kan jiran ykn bara 2015 dura kan eebbifamanii fi muuxannoo hojii kan qaban.' : 'Currently working or graduated before 2015 E.C. with prior work experience.'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(lang === 'am' ? ['የ1+ ዓመት ልምድ', 'የሙያ ለውጥ', 'ባለሙያዎች እንቀበላለን'] : lang === 'or' ? ['Muuxannoo Waggaa 1+', 'Jijjiirama Ogummaa', 'Ogeeyyii Ni Simanna'] : ['1+ Years Exp', 'Career Change', 'Professionals Welcome']).map(tag => (
                          <span key={tag} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${ formData.status === 'experienced' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500' }`}>{tag}</span>
                        ))}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Job Sector */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'የስራ ዘርፍ' : lang === 'or' ? 'Kutaalee Hojii' : 'Job Category'}</h1>
                    <p className="text-[15px] text-gray-500">{lang === 'am' ? 'በየትኛው ዘርፍ ላይ ነው የበለጠ ፍላጎት ያለዎት?' : lang === 'or' ? 'Damee kamiin caalaatti barbaaddu?' : 'Which sector are you most interested in?'}</p>
                  </div>

                  <div className="space-y-4">
                    {SECTORS.map((s) => (
                      <div key={s.id}>
                        <button
                          onClick={() => setFormData((p: any) => ({ ...p, sector: s.id, sectorSpecific: { ...p.sectorSpecific, subCategory: "" } }))}
                          className={`w-full flex items-center p-4 rounded-[20px] border-2 transition-all ${
                            formData.sector === s.id ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10' : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl shrink-0">
                            {s.emoji}
                          </div>
                          <div className="flex-1 text-left px-4 min-w-0">
                            <h3 className="text-[15px] font-bold text-gray-900 leading-tight mb-1">
                              {lang === 'am' && s.id === 'embassy' ? 'ኤምባሲ እና ዲፕሎማቲክ ተልዕኮዎች' :
                               lang === 'am' && s.id === 'ngo' ? 'ዓ.ድ.ት.ሀ እና የ UN ኤጀንሲዎች' :
                               lang === 'am' && s.id === 'airport' ? 'አውሮፕላን ማረፊያ እና አቪዬሽን' :
                               lang === 'am' && s.id === 'foreign' ? 'የውጭ ሀገር ስራ' : 
                               lang === 'or' && s.id === 'embassy' ? 'Imbaasiiwwanii fi Ergamoota Dippilomaasii' :
                               lang === 'or' && s.id === 'ngo' ? 'Dhaabbilee Mit-Mootummaa (NGO) fi Eejansiilee UN' :
                               lang === 'or' && s.id === 'airport' ? 'Aviyeeshinii fi Daandiiwwan Qilleensaa' :
                               lang === 'or' && s.id === 'foreign' ? 'Hojii Biyya Alaa' : s.title}
                            </h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed truncate whitespace-normal line-clamp-2">
                              {lang === 'am' && s.id === 'embassy' ? 'አስተዳደራዊ፣ ጸሐፊነት፣ ፋይናንስ፣ አይቲ እና ቴክኒካዊ ቦታዎች።' :
                               lang === 'am' && s.id === 'ngo' ? 'ልማት፣ ሰብአዊነት፣ የፕሮጀክት አስተዳደር እና አስተዳደር።' :
                               lang === 'am' && s.id === 'airport' ? 'የአውሮፕላን ማረፊያ ስራዎች፣ የደንበኞች አገልግሎት፣ የመሬት አገልግሎት፣ ካርጎ እና ሎጂስቲክስ።' :
                               lang === 'am' && s.id === 'foreign' ? 'የተረጋገጡ ዓለም አቀፍ የስራ እድሎች።' : 
                               lang === 'or' && s.id === 'embassy' ? 'Bulchiinsa, Barreessaa, Faayinaansii, IT fi Iddoowwan Teeknikaa.' :
                               lang === 'or' && s.id === 'ngo' ? 'Misooma, Gargaarsa Namoomaa, Hoggansa Pirojektii fi Bulchiinsa.' :
                               lang === 'or' && s.id === 'airport' ? 'Hojiiwwan Buufata Xiyyaaraa, Tajaajila Maamilaa, Tajaajila Lafaa, Kaargoo fi Lojistikii.' :
                               lang === 'or' && s.id === 'foreign' ? 'Carraawwan Hojii Idil-Addunyaa Mirkanaa\'an.' : s.desc}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                            formData.sector === s.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                          }`}>
                            {formData.sector === s.id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </button>
                        
                        {formData.sector === s.id && (
                          <div className="mt-3 ml-6 pl-4 border-l-2 border-blue-200 animate-fadeIn relative z-20">
                            <InputField 
                              label={lang === 'am' ? 'የተለየ ሚና/ምድብ ይምረጡ' : lang === 'or' ? 'Gahee/Kutaa Addaa Filadhaa' : 'Select Specific Role/Category'}
                              section="sectorSpecific"
                              field="subCategory"
                              options={SUB_CATEGORIES[s.id]}
                              required
                              formData={formData}
                              updateForm={updateForm}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Personal Info */}
              {step === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="mb-5">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'የግል መረጃ' : lang === 'or' ? 'Odeeffannoo Dhuunfaa' : 'Personal Info'}</h1>
                    <p className="text-[15px] text-gray-500">{lang === 'am' ? 'ስለ እርስዎ ጥቂት ይንገሩን።' : lang === 'or' ? "Waa'ee keessan waa xiqqoo nuuf himaa." : 'Tell us a bit about yourself.'}</p>
                  </div>

                  <InputField label={lang === 'am' ? 'ሙሉ ስም' : lang === 'or' ? 'Maqaa Guutuu' : 'Full Name'} section="personal" field="fullName" required formData={formData} updateForm={updateForm} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label={lang === 'am' ? 'ፆታ' : lang === 'or' ? 'Saala' : 'Gender'} section="personal" field="gender" options={lang === 'am' ? ["ወንድ", "ሴት"] : lang === 'or' ? ["Dhiira", "Dubartii"] : ["Male", "Female"]} required formData={formData} updateForm={updateForm} />
                    <InputField label={lang === 'am' ? 'የትውልድ ቀን' : lang === 'or' ? 'Guyyaa Dhalootaa' : 'Date of Birth'} section="personal" field="dob" type="date" required formData={formData} updateForm={updateForm} />
                  </div>
                  <InputField label={lang === 'am' ? 'ስልክ ቁጥር' : lang === 'or' ? 'Lakkoofsa Bilbilaa' : 'Phone Number'} section="personal" field="phone" type="tel" required formData={formData} updateForm={updateForm} />
                  <InputField label={lang === 'am' ? 'የኢሜል አድራሻ' : lang === 'or' ? 'Teessoo E-mail' : 'Email Address'} section="personal" field="email" type="email" required formData={formData} updateForm={updateForm} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label={lang === 'am' ? 'ክልል' : lang === 'or' ? 'Naannoo' : 'Region'} section="personal" field="region" required formData={formData} updateForm={updateForm} />
                    <InputField label={lang === 'am' ? 'ከተማ / ክፍለ ከተማ' : lang === 'or' ? 'Magaalaa / Kutaa Magaalaa' : 'City / Sub-City'} section="personal" field="city" required formData={formData} updateForm={updateForm} />
                  </div>
                </div>
              )}

              {/* STEP 4: Education & Experience */}
              {step === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Education Section */}
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'ትምህርት' : lang === 'or' ? 'Barnoota' : 'Education'}</h1>
                    <p className="text-[15px] text-gray-500 mb-6">{lang === 'am' ? 'የትምህርት ታሪክዎ።' : lang === 'or' ? 'Duubee barnoota keessanii.' : 'Your academic background.'}</p>
                    <InputField label={lang === 'am' ? 'የትምህርት ደረጃ' : lang === 'or' ? 'Sadarkaa Barnootaa' : 'Highest Education'} section="education" field="highestLevel" options={lang === 'am' ? ["ዲፕሎማ / TVET", "የባችለር ዲግሪ", "የማስተርስ ዲግሪ", "ፒኤችዲ (PhD)"] : lang === 'or' ? ["Diploomaa / TVET", "Digrii Jalqabaa", "Digrii Maastarii", "PhD"] : ["Diploma / TVET", "Bachelor's Degree", "Master's Degree", "PhD"]} required formData={formData} updateForm={updateForm} />
                    
                    {formData.education.highestLevel && (
                      <>
                        <InputField label={lang === 'am' ? 'ዩኒቨርሲቲ / ኮሌጅ / ተቋም' : lang === 'or' ? 'Yuunivarsiitii / Kolleejjii / Dhaabbata' : 'University / College / Institution'} section="education" field="university" required formData={formData} updateForm={updateForm} />
                        <InputField label={lang === 'am' ? 'የተማሩት መስክ (Field of Study)' : lang === 'or' ? 'Damee Qorannoo' : 'Field of Study'} section="education" field="field" required formData={formData} updateForm={updateForm} />
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label={lang === 'am' ? 'የተመረቁበት ዓመት' : lang === 'or' ? 'Bara Eebbaa' : 'Graduation Year'} section="education" field="gradYear" type="number" min="1950" max={new Date().getFullYear() + 5} required formData={formData} updateForm={updateForm} />
                          <InputField label={lang === 'am' ? 'ውጤት (CGPA) (አማራጭ)' : lang === 'or' ? 'Qabxii (CGPA) (Filannoo)' : 'CGPA (Optional)'} section="education" field="cgpa" type="number" min="0" max="4" step="0.01" formData={formData} updateForm={updateForm} />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="h-px bg-gray-200" />

                  {/* Experience Section - based on career status */}
                  {formData.status === 'fresh' ? (
                    <div>
                      <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'ልምድ' : lang === 'or' ? 'Duubee' : 'Background'}</h1>
                      <p className="text-[15px] text-gray-500 mb-6">{lang === 'am' ? 'ያለዎትን ማንኛውንም ልምድ ያጋሩ።' : lang === 'or' ? 'Muuxannoo qabdan kamiyyuu qoodaa.' : 'Even without full-time work, share what you\'ve done.'}</p>
                      <InputField label={lang === 'am' ? 'የበጎ ፈቃድ / የተለማማጅነት ልምድ (አማራጭ)' : lang === 'or' ? "Muuxannoo Hojii To'annoo / Fedha Ofii (Filannoo)" : 'Internship / Volunteer Experience (Optional)'} section="experience" field="internship" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'ዋና ክህሎቶች (ለምሳሌ፡ ኮምፒውተር፣ ዲዛይን)' : lang === 'or' ? 'Dandeettiiwwan Ijoo (fkn. Kompiitara, Diizaayinii)' : 'Key Skills (e.g. Communication, MS Office, Design)'} section="experience" field="skills" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የሚችሉት ቋንቋዎች (ለምሳሌ፡ አማርኛ፣ እንግሊዝኛ)' : lang === 'or' ? 'Afaanota Dubbataman (fkn. Amaaraa, Ingilizii)' : 'Languages Spoken (e.g. Amharic, English, Arabic)'} section="experience" field="languages" type="textarea" formData={formData} updateForm={updateForm} />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'የስራ ልምድ' : lang === 'or' ? 'Muuxannoo Hojii' : 'Work Experience'}</h1>
                      <p className="text-[15px] text-gray-500 mb-6">{lang === 'am' ? 'የሙያ ታሪክዎ።' : lang === 'or' ? 'Duubee ogummaa keessanii.' : 'Your professional background.'}</p>
                      <InputField label={lang === 'am' ? 'የስራ ልምድ (በዓመታት)' : lang === 'or' ? 'Muuxannoo Hojii (Waggaadhaan)' : 'Years of Experience'} section="experience" field="yearsOfExperience" options={lang === 'am' ? ["ከ 1 ዓመት በታች", "1-2 ዓመታት", "3-5 ዓመታት", "5-10 ዓመታት", "10+ ዓመታት"] : ["Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10+ years"]} required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የአሁኑ / የቅርብ ጊዜ አሰሪ' : lang === 'or' ? 'Qaxaraa Ammaa / Dhiyeenyaa' : 'Current / Latest Employer'} section="experience" field="currentEmployer" required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የአሁኑ / የቅርብ ጊዜ የስራ መደብ' : lang === 'or' ? 'Sadarkaa Hojii Ammaa / Dhiyeenyaa' : 'Current / Latest Position'} section="experience" field="currentPosition" required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የስራ ዓይነት' : lang === 'or' ? 'Gosa Qaxarii' : 'Employment Type'} section="experience" field="employmentType" options={lang === 'am' ? ["የሙሉ ሰዓት", "የትርፍ ሰዓት", "ኮንትራት", "ፍሪላንስ (Freelance)", "የግል ስራ"] : ["Full-time", "Part-time", "Contract", "Freelance", "Self-employed"]} required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'ዋና የሙያ ክህሎቶች' : lang === 'or' ? 'Dandeettiiwwan Ogummaa Ijoo' : 'Key Professional Skills'} section="experience" field="professionalSkills" type="textarea" formData={formData} updateForm={updateForm} />
                    </div>
                  )}
                </div>
              )}


              {/* STEP 5: Sector Specific */}
              {step === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full mb-3">
                      <span className="text-[13px] font-bold text-blue-700">{SECTORS.find(s=>s.id===formData.sector)?.emoji} {lang === 'am' ? (formData.sector === 'embassy' ? 'ኤምባሲ እና ዲፕሎማቲክ ተልዕኮዎች' : formData.sector === 'ngo' ? 'ዓ.ድ.ት.ሀ እና የ UN ኤጀንሲዎች' : formData.sector === 'airport' ? 'አውሮፕላን ማረፊያ እና አቪዬሽን' : formData.sector === 'foreign' ? 'የውጭ ሀገር ስራ' : SECTORS.find(s=>s.id===formData.sector)?.title) : SECTORS.find(s=>s.id===formData.sector)?.title}</span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'የዘርፍ መስፈርቶች' : lang === 'or' ? 'Ulaagaalee Damee' : 'Sector Requirements'}</h1>
                    <p className="text-[15px] text-gray-500">{lang === 'am' ? 'እባክዎ ለዚህ ዘርፍ የሚፈለገውን የተለየ መረጃ ይሙሉ ፡' : lang === 'or' ? 'Maaloo odeeffannoo addaa damee kanaaf barbaadamu guutaa:' : 'Please fill in the specific information required for this sector.'}</p>
                  </div>

                  {formData.sector === 'embassy' && (
                    <>
                      <InputField label={lang === 'am' ? 'የእንግሊዝኛ ቋንቋ ችሎታ ደረጃ' : lang === 'or' ? 'Sadarkaa Dandeettii Afaan Ingilizii' : 'English Proficiency Level'} section="sectorSpecific" field="englishLevel" options={lang === 'am' ? ["መሰረታዊ", "መካከለኛ", "ከፍተኛ", "አቀላጥፎ የሚናገር / የአፍ መፍቻ ቋንቋ"] : ["Basic", "Intermediate", "Advanced", "Fluent / Native"]} required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የሚችሏቸው ሌሎች ቋንቋዎች (አማራጭ)' : lang === 'or' ? 'Afaanota Biroo Dubbataman (Filannoo)' : 'Other Languages Spoken (Optional)'} section="sectorSpecific" field="otherLanguages" formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የኮምፒውተር እና ሶፍትዌር ክህሎቶች' : lang === 'or' ? 'Dandeettii Kompiitaraa fi Sooftiweerii' : 'Computer & Software Skills'} section="sectorSpecific" field="embassyComputerSkills" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የመተየብ ፍጥነት (ቃላት በደቂቃ፣ አማራጭ)' : lang === 'or' ? 'Saffisa Barreessuu (jecha daqiiqaatti, Filannoo)' : 'Typing Speed (words per minute, Optional)'} section="sectorSpecific" field="typingSkills" formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የደህንነት ማረጋገጫ (Security Clearance) አለዎት?' : lang === 'or' ? 'Mirkaneessa Nageenyaa qabduu?' : 'Do you have Security Clearance?'} section="sectorSpecific" field="securityClearance" options={lang === 'am' ? ["አዎ", "የለኝም", "ማግኘት እችላለሁ"] : ["Yes", "No", "Can Obtain"]} formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የማነሳሳት ደብዳቤ (ለምን ይህን ስራ ፈለጉ?)' : lang === 'or' ? "Xalayaa Kaka'umsaa (Gahee kana maaliif barbaaddan?)" : 'Motivation Statement (Why do you want this role?)'} section="sectorSpecific" field="motivationLetter" type="textarea" formData={formData} updateForm={updateForm} />
                    </>
                  )}

                  {formData.sector === 'ngo' && (
                    <>
                      <InputField label={lang === 'am' ? 'የ NGO / የልማት ስራ ልምድ በዓመታት' : lang === 'or' ? 'Muuxannoo Hojii NGO / Misoomaa Waggaadhaan' : 'Years of NGO / Development Work Experience'} section="sectorSpecific" field="ngoExperience" options={lang === 'am' ? ["ምንም", "ከ 1 ዓመት በታች", "1-3 ዓመታት", "3-5 ዓመታት", "5+ ዓመታት"] : ["None", "Less than 1 year", "1-3 years", "3-5 years", "5+ years"]} required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የፕሮጀክት አስተዳደር ልምድ' : lang === 'or' ? 'Muuxannoo Hoggansa Pirojektii' : 'Project Management Experience'} section="sectorSpecific" field="projectManagement" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የማህበረሰብ ልማት ልምድ' : lang === 'or' ? 'Muuxannoo Misooma Hawaasaa' : 'Community Development Experience'} section="sectorSpecific" field="communityDevelopment" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የፕሮጀክት ጥያቄዎችን (Proposals) መፃፍ ይችላሉ?' : lang === 'or' ? 'Piroppozaalii barreessuu dandeessuu?' : 'Can you write Proposals?'} section="sectorSpecific" field="proposalWriting" options={lang === 'am' ? ["አዎ - ራሴን ችዬ", "አዎ - በድጋፍ", "አልችልም"] : ["Yes – Independently", "Yes – With Support", "No"]} formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'ሪፖርቶችን መፃፍ ይችላሉ?' : lang === 'or' ? 'Gabaasa barreessuu dandeessuu?' : 'Can you write Reports?'} section="sectorSpecific" field="reportWriting" options={lang === 'am' ? ["አዎ - ራሴን ችዬ", "አዎ - በድጋፍ", "አልችልም"] : ["Yes – Independently", "Yes – With Support", "No"]} formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'ለጋሽ / አጋር ድርጅቶች ጋር የመስራት ልምድ (USAID, UNICEF, EU, ወዘተ)' : lang === 'or' ? 'Muuxannoo Arjoomtota / Michootaa (USAID, UNICEF, EU, kkf)' : 'Donor / Partner Experience (USAID, UNICEF, EU, etc.)'} section="sectorSpecific" field="donorExperience" type="textarea" formData={formData} updateForm={updateForm} />
                    </>
                  )}

                  {formData.sector === 'airport' && (
                    <>
                      <InputField label={lang === 'am' ? 'ተመራጭ የአውሮፕላን ማረፊያ የስራ ድርሻ' : lang === 'or' ? 'Gahee Buufata Xiyyaaraa Filatamu' : 'Preferred Airport Role'} section="sectorSpecific" field="customerService" options={lang === 'am' ? ["የደንበኞች አገልግሎት ወኪል", "የመሬት አገልግሎት", "ካርጎ እና ሎጂስቲክስ", "የአውሮፕላን ማረፊያ ስራዎች", "የቼክ-ኢን ወኪል", "ሌላ"] : ["Customer Service Agent", "Ground Handling", "Cargo & Logistics", "Airport Operations", "Check-in Agent", "Other"]} required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የመሬት አገልግሎት (Ground Handling) ልምድ አለዎት?' : lang === 'or' ? 'Muuxannoo Tajaajila Lafaa qabduu?' : 'Do you have Ground Handling experience?'} section="sectorSpecific" field="groundHandling" options={lang === 'am' ? ["አዎ", "የለኝም"] : ["Yes", "No"]} formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የካርጎ / ጭነት ልምድ (አማራጭ)' : lang === 'or' ? "Muuxannoo Kaargoo / Fe'umsaa (Filannoo)" : 'Cargo / Freight Experience (Optional)'} section="sectorSpecific" field="cargoExperience" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የስራ ፈረቃ (Shift) ምርጫ' : lang === 'or' ? 'Filannoo Siftii (Shift)' : 'Shift Preference'} section="sectorSpecific" field="shiftAvailability" options={lang === 'am' ? ["የቀን ፈረቃ ብቻ", "የማታ ፈረቃ ብቻ", "ማንኛውም ፈረቃ"] : ["Day Shift Only", "Night Shift Only", "Any Shift"]} required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የአካል ብቃት ደረጃ' : lang === 'or' ? 'Sadarkaa Gahumsa Qaamaa' : 'Physical Fitness Level'} section="sectorSpecific" field="physicalFitness" options={lang === 'am' ? ["በጣም ጥሩ", "ጥሩ", "መካከለኛ"] : ["Excellent", "Good", "Average"]} formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'ወደተለያዩ ቦታዎች ለመጓዝ / ለመስራት ዝግጁ ነዎት?' : lang === 'or' ? 'Gara iddoowwan garaagaraatti imaluuf / hojjechuuf qophiidhaa?' : 'Available to Travel / Work Different Locations?'} section="sectorSpecific" field="travelAvailability" options={lang === 'am' ? ["አዎ", "አይ"] : ["Yes", "No"]} formData={formData} updateForm={updateForm} />
                    </>
                  )}

                  {formData.sector === 'foreign' && (
                    <>
                      <InputField label={lang === 'am' ? 'ተመራጭ መዳረሻ ሀገር' : lang === 'or' ? 'Biyya Galma Filatamu' : 'Preferred Destination Country'} section="sectorSpecific" field="preferredCountry" options={lang === 'am' ? ["ሳዑዲ አረቢያ", "የተባበሩት አረብ ኢሚሬትስ (UAE)", "ኳታር", "ኩዌት", "ኦማን", "ባህሬን", "ዮርዳኖስ", "ሊባኖስ", "ሌላ"] : ["Saudi Arabia", "UAE", "Qatar", "Kuwait", "Oman", "Bahrain", "Jordan", "Lebanon", "Other"]} required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'ትክክለኛ ፓስፖርት አለዎት?' : lang === 'or' ? 'Paaspoortii seera qabeessa qabduu?' : 'Do you have a valid Passport?'} section="sectorSpecific" field="passportAvailable" options={lang === 'am' ? ["አዎ", "የለኝም - ማውጣት እችላለሁ"] : ["Yes", "No – Can Apply"]} required formData={formData} updateForm={updateForm} />
                      {formData.sectorSpecific.passportAvailable === (lang === 'am' ? 'አዎ' : lang === 'or' ? 'Eeyyee' : 'Yes') && (
                        <>
                          <InputField label={lang === 'am' ? 'የፓስፖርት ቁጥር' : lang === 'or' ? 'Lakkoofsa Paaspoortii' : 'Passport Number'} section="sectorSpecific" field="passportNumber" formData={formData} updateForm={updateForm} />
                          <InputField label={lang === 'am' ? 'ፓስፖርቱ የሚያበቃበት ቀን' : lang === 'or' ? 'Guyyaa Paaspoortiin itti xumuramu' : 'Passport Expiry Date'} section="sectorSpecific" field="passportExpiry" type="date" formData={formData} updateForm={updateForm} />
                        </>
                      )}
                      <InputField label={lang === 'am' ? 'መቼ መጓዝ ይችላሉ?' : lang === 'or' ? 'Yoom imaluu dandeessu?' : 'When can you travel?'} section="sectorSpecific" field="readyToRelocate" options={lang === 'am' ? ["ወዲያውኑ", "በ 1 ወር ውስጥ", "በ 3 ወራት ውስጥ", "ከ 3 ወራት በኋላ"] : ["Immediately", "Within 1 Month", "Within 3 Months", "After 3 Months"]} required formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የህክምና ማረጋገጫ (Medical Certificate) አለዎት?' : lang === 'or' ? 'Ragaa Yaalaa (Medical Certificate) qabduu?' : 'Do you have a Medical Certificate?'} section="sectorSpecific" field="medicalCertificate" options={lang === 'am' ? ["አዎ", "የለኝም - ማግኘት እችላለሁ"] : ["Yes", "No – Can Obtain"]} formData={formData} updateForm={updateForm} />
                      <InputField label={lang === 'am' ? 'የፖሊስ ማረጋገጫ (Police Clearance) አለዎት?' : lang === 'or' ? 'Ragaa Qulqullinaa Poolisii qabduu?' : 'Do you have a Police Clearance?'} section="sectorSpecific" field="policeClearance" options={lang === 'am' ? ["አዎ", "የለኝም - ማግኘት እችላለሁ"] : ["Yes", "No – Can Obtain"]} formData={formData} updateForm={updateForm} />
                    </>
                  )}
                </div>
              )}

              {/* STEP 6: File Uploads */}
              {step === 6 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="mb-4">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'ሰነዶችን ይስቀሉ' : lang === 'or' ? 'Sanadoota Olkaasaa (Upload)' : 'Upload Documents'}</h1>
                    <p className="text-[15px] text-gray-500">{lang === 'am' ? 'ፋይሎችዎን ይስቀሉ። ተቀባይነት ያላቸው ፡ PDF, DOC, JPG, PNG።' : lang === 'or' ? 'Faayiloota keessan olkaasaa. Kan fudhatamu: PDF, DOC, JPG, PNG.' : 'Upload your files. Accepted: PDF, DOC, JPG, PNG.'}</p>
                  </div>

                  {/* Required for everyone */}
                  <div>
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">{lang === 'am' ? 'የግዴታ ሰነዶች' : lang === 'or' ? 'Sanadoota Dirqamaa' : 'Required Documents'}</p>
                    <FileUploadCard id="cv" label={lang === 'am' ? 'ሲቪ / ሪዙም (CV)' : lang === 'or' ? 'CV / Riizumee' : 'CV / Resume'} required files={files} handleFileChange={handleFileChange} />
                    <FileUploadCard id="passportPhoto" label={lang === 'am' ? 'የፓስፖርት መጠን ፎቶ (ግልጽ የሆነ)' : lang === 'or' ? "Suuraa Guddina Paaspoortii qabu (duubee ifa ta'e)" : 'Passport Size Photo (clear background)'} accept="image/*" required files={files} handleFileChange={handleFileChange} />
                    <FileUploadCard id="educationalCert" label={lang === 'am' ? 'የከፍተኛ ትምህርት ማስረጃ' : lang === 'or' ? 'Ragaa Barnootaa Olaanaa' : 'Highest Educational Certificate'} required files={files} handleFileChange={handleFileChange} />
                  </div>

                  <div className="h-px bg-gray-200" />

                  {/* Conditional docs */}
                  <div>
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">{lang === 'am' ? 'ተጨማሪ ሰነዶች (አማራጭ)' : lang === 'or' ? 'Sanadoota Dabalataa (Filannoo)' : 'Additional Documents (Optional)'}</p>
                    {formData.status === 'experienced' && (
                      <FileUploadCard id="experienceCert" label={lang === 'am' ? 'የስራ ልምድ ማስረጃ' : lang === 'or' ? 'Ragaa Muuxannoo Hojii' : 'Work Experience Certificate'} files={files} handleFileChange={handleFileChange} />
                    )}
                    {formData.sector === 'foreign' && (
                      <FileUploadCard id="passport" label={lang === 'am' ? 'የፓስፖርት ኮፒ' : lang === 'or' ? 'Koppii Paaspoortii' : 'Passport Copy'} files={files} handleFileChange={handleFileChange} />
                    )}
                    {formData.sector !== 'foreign' && (
                      <FileUploadCard id="passport" label={lang === 'am' ? 'የብሔራዊ መታወቂያ / ፋይዳ ካርድ ኮፒ' : lang === 'or' ? 'Koppii Waraqaa Eenyummaa / Kaardii Faydaa' : 'National ID / Fayda Card Copy'} files={files} handleFileChange={handleFileChange} />
                    )}
                  </div>
                </div>
              )}

              {/* STEP 7: Review & Final */}
              {step === 7 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="mb-4">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">{lang === 'am' ? 'ገምግም እና አስገባ' : lang === 'or' ? 'Gamaaggamaa fi Ergaa' : 'Review & Submit'}</h1>
                    <p className="text-[15px] text-gray-500">{lang === 'am' ? 'ተቃርቧል! መረጃዎን ይገምግሙ እና ያረጋግጡ።' : lang === 'or' ? 'Xumuruuf dhiyaattan! Odeeffannoo keessan gamaaggamaa, mirkaneessaa.' : 'Almost done! Review your info and confirm.'}</p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                      <p className="text-white font-black text-[17px]">{formData.personal.fullName || 'Applicant'}</p>
                      <p className="text-blue-100 text-[13px]">+251{formData.personal.phone} · {formData.personal.email}</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                      <div className="px-5 py-3 flex justify-between items-center">
                        <span className="text-[13px] text-gray-400 font-semibold">{lang === 'am' ? 'ሁኔታ' : lang === 'or' ? 'Haala' : 'Status'}</span>
                        <span className="text-[13px] font-bold text-gray-900">{formData.status === 'fresh' ? (lang === 'am' ? '🎓 አዲስ ተመራቂ' : lang === 'or' ? '🎓 Eebbifamaa Haaraa' : '🎓 Fresh Graduate') : (lang === 'am' ? '💼 ልምድ ያለው' : lang === 'or' ? '💼 Muuxannoo Kan Qabu' : '💼 Experienced')}</span>
                      </div>
                      <div className="px-5 py-3 flex justify-between items-center">
                        <span className="text-[13px] text-gray-400 font-semibold">{lang === 'am' ? 'ዘርፍ' : lang === 'or' ? 'Damee' : 'Sector'}</span>
                        <span className="text-[13px] font-bold text-gray-900">{SECTORS.find(s=>s.id===formData.sector)?.emoji} {lang === 'am' ? (formData.sector === 'embassy' ? 'ኤምባሲ እና ዲፕሎማቲክ ተልዕኮዎች' : formData.sector === 'ngo' ? 'ዓ.ድ.ት.ሀ እና የ UN ኤጀንሲዎች' : formData.sector === 'airport' ? 'አውሮፕላን ማረፊያ እና አቪዬሽን' : formData.sector === 'foreign' ? 'የውጭ ሀገር ስራ' : SECTORS.find(s=>s.id===formData.sector)?.title) : SECTORS.find(s=>s.id===formData.sector)?.title}</span>
                      </div>
                      <div className="px-5 py-3 flex justify-between items-center">
                        <span className="text-[13px] text-gray-400 font-semibold">{lang === 'am' ? 'የስራ ድርሻ' : lang === 'or' ? 'Gahee' : 'Role'}</span>
                        <span className="text-[13px] font-bold text-gray-900">{formData.sectorSpecific.subCategory}</span>
                      </div>
                      <div className="px-5 py-3 flex justify-between items-center">
                        <span className="text-[13px] text-gray-400 font-semibold">{lang === 'am' ? 'ትምህርት' : lang === 'or' ? 'Barnoota' : 'Education'}</span>
                        <span className="text-[13px] font-bold text-gray-900">{formData.education.highestLevel}</span>
                      </div>
                      <div className="px-5 py-3 flex justify-between items-center">
                        <span className="text-[13px] text-gray-400 font-semibold">{lang === 'am' ? 'ከተማ' : lang === 'or' ? 'Magaalaa' : 'City'}</span>
                        <span className="text-[13px] font-bold text-gray-900">{formData.personal.city || formData.personal.region || '—'}</span>
                      </div>
                      <div className="px-5 py-3 flex justify-between items-center">
                        <span className="text-[13px] text-gray-400 font-semibold">{lang === 'am' ? 'ሰነዶች' : lang === 'or' ? 'Sanadoota' : 'Documents'}</span>
                        <span className="text-[13px] font-bold text-green-600">{Object.values(files).filter(Boolean).length} {lang === 'am' ? 'ተሰቅለዋል' : lang === 'or' ? 'Olkaafameera' : 'uploaded'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  {paymentConfig && (
                    <div className="bg-white rounded-2xl border-2 border-blue-100 overflow-hidden shadow-sm">
                      <div className="bg-blue-50 px-5 py-4 border-b border-blue-100">
                        <h3 className="font-black text-blue-900 text-[16px]">{lang === 'am' ? 'የማመልከቻ ክፍያ ፡' : lang === 'or' ? 'Kaffaltii Iyyannoo:' : 'Application Fee:'} {paymentConfig.feeAmount} ETB</h3>
                        <p className="text-[13px] text-blue-700 mt-1 font-medium">{lang === 'am' ? `እባክዎ ማመልከቻዎ እንዲስተናገድ የ ${paymentConfig.feeAmount} ብር ክፍያ ይክፈሉ። ክፍያው ሲጠናቀቅ ለቃለ መጠይቅ በኢሜል እናሳውቅዎታለን።` : lang === 'or' ? `Maaloo iyyannoon keessan akka itti fufuuf kaffaltii Qarshii ${paymentConfig.feeAmount} raawwadhaa. Akkuma xumurameen qormaata afaaniif e-mail dhaan isin beeksisna.` : `Please pay the ${paymentConfig.feeAmount} ETB fee for your application to proceed. We will notify you via email for interviews once processed.`}</p>
                      </div>
                      <div className="p-5 space-y-4">
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">{lang === 'am' ? 'የመክፈያ ዘዴ ይምረጡ' : lang === 'or' ? 'Mala Kaffaltii Filadhaa' : 'Select Payment Method'}</p>
                        
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                          {paymentConfig.cbe.active && (
                            <button onClick={() => setSelectedBank('cbe')} className={`px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all border-2 ${selectedBank === 'cbe' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>CBE</button>
                          )}
                          {paymentConfig.telebirr.active && (
                            <button onClick={() => setSelectedBank('telebirr')} className={`px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all border-2 ${selectedBank === 'telebirr' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>Telebirr</button>
                          )}
                          {paymentConfig.boa.active && (
                            <button onClick={() => setSelectedBank('boa')} className={`px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all border-2 ${selectedBank === 'boa' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>BOA</button>
                          )}
                          {paymentConfig.awash.active && (
                            <button onClick={() => setSelectedBank('awash')} className={`px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all border-2 ${selectedBank === 'awash' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>Awash</button>
                          )}
                        </div>
                        {selectedBank && paymentConfig[selectedBank as keyof Omit<PaymentConfig, 'feeAmount'>] && (
                          <div className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between">
                            <div>
                              <p className="text-[12px] font-bold text-gray-400 mb-1">{lang === 'am' ? 'የሂሳብ ባለቤት' : lang === 'or' ? 'Abbaa Herregaa' : 'Account Holder'}</p>
                              <p className="font-bold text-gray-900 text-[15px] mb-2">{(paymentConfig[selectedBank as keyof Omit<PaymentConfig, 'feeAmount'>] as any).holderName}</p>
                              <p className="text-[12px] font-bold text-gray-400 mb-1">{lang === 'am' ? 'የሂሳብ / ስልክ ቁጥር' : lang === 'or' ? 'Lakkoofsa Herregaa / Bilbilaa' : 'Account / Phone Number'}</p>
                              <p className="text-[17px] font-black font-mono text-blue-600">{(paymentConfig[selectedBank as keyof Omit<PaymentConfig, 'feeAmount'>] as any).account}</p>
                            </div>
                            <button 
                              onClick={() => handleCopy((paymentConfig[selectedBank as keyof Omit<PaymentConfig, 'feeAmount'>] as any).account)} 
                              className={`p-3 rounded-xl border shadow-sm transition-colors flex flex-col items-center gap-1 shrink-0 ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300'}`}
                            >
                              {copied ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                              <span className="text-[10px] font-bold">
                                {copied ? (lang === 'am' ? 'ተቀድቷል' : lang === 'or' ? 'Koppii Ta\'ee' : 'Copied!') : (lang === 'am' ? 'ቅዳ' : lang === 'or' ? 'Koppii' : 'Copy')}
                              </span>
                            </button>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <FileUploadCard id="paymentScreenshot" label={lang === 'am' ? 'የክፍያ ማረጋገጫ (Screenshot / ደረሰኝ) ይስቀሉ' : lang === 'or' ? 'Nagahee Kaffaltii / Screenshot Olkaasaa' : 'Upload Payment Screenshot / Receipt'} accept="image/*" required files={files} handleFileChange={handleFileChange} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Declarations */}
                  <div className="space-y-3 border border-gray-100 p-5 rounded-[20px] bg-white shadow-sm">
                    <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-3">{lang === 'am' ? 'ማረጋገጫዎች' : lang === 'or' ? 'Mirkaneessitoota' : 'Declarations'}</p>
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.declarations.isTrue}
                        onChange={(e) => updateForm('declarations', 'isTrue', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
                      />
                      <span className="text-[14px] font-medium text-gray-700 leading-relaxed select-none">
                        {lang === 'am' ? 'ያቀረብኩት መረጃ ሁሉ እውነት እና ትክክል መሆኑን አረጋግጣለሁ።' : lang === 'or' ? "Odeeffannoon ani kenne hundi dhugaa fi sirrii ta'uu isaa nan mirkaneessa." : 'I confirm that all information I have provided is true and accurate.'}
                      </span>
                    </label>
                    <div className="h-px bg-gray-100" />
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.declarations.shareProfile}
                        onChange={(e) => updateForm('declarations', 'shareProfile', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
                      />
                      <span className="text-[14px] font-medium text-gray-700 leading-relaxed select-none">
                        {lang === 'am' ? 'Pathway Agency መገለጫዬን እና ሰነዶቼን ለቀጣሪ ድርጅቶች እንዲያጋራ እስማማለሁ።' : lang === 'or' ? 'Pathway Agency pirofaayilii fi sanadoota koo dhaabbilee qaxaran waliin akka qoodu walii nan gala.' : 'I agree that Pathway Agency may share my profile and documents with prospective employers.'}
                      </span>
                    </label>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Sticky Bottom Actions */}
        {!submitted && (
          <div className="shrink-0 bg-white border-t border-gray-100 p-4 sm:p-5 z-10 sticky bottom-0">
             <div className="flex items-center gap-3">
               {step > 1 && (
                 <button
                   onClick={handleBack}
                   className="py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-[0.98] text-gray-700 font-bold text-[16px] transition-all flex items-center justify-center"
                 >
                   {lang === 'am' ? 'ተመለስ' : lang === 'or' ? 'Duuba' : 'Back'}
                 </button>
               )}
               <button
                  onClick={step === 7 ? handleSubmit : handleNext}
                  disabled={!canProceed || loading}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold text-[16px] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {lang === 'am' ? 'በማስኬድ ላይ...' : lang === 'or' ? 'Adeemsifamaa jira...' : 'Processing...'}
                    </span>
                  ) : (
                    step === 7 ? (lang === 'am' ? 'ማመልከቻ አስገባ' : lang === 'or' ? 'Iyyannoo Ergi' : 'Submit Application') : (lang === 'am' ? 'ቀጥል' : lang === 'or' ? 'Itti Fufi' : 'Continue')
                  )}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

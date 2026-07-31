"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { addPathwayPost } from "@/lib/db";
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

const InputField = ({ label, section, field, type = "text", required = false, options = [], formData, updateForm }: any) => {
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
      ) : (
        <input
          type={type}
          required={required}
          value={val}
          onChange={(e) => updateForm(section, field, e.target.value)}
          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
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

  const updateForm = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(s + 1, 7));
  };
  
  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(s - 1, 1));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
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
        title: `[App] ${formData.personal.fullName} - ${formData.sector} (${formData.status})`,
        description: `Phone: ${formData.personal.phone} | Email: ${formData.personal.email}`,
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
  if (step === 2) canProceed = !!formData.sector;
  if (step === 3) canProceed = !!formData.personal.fullName && !!formData.personal.phone && !!formData.personal.email;
  if (step === 4) canProceed = !!formData.education.highestLevel;
  if (step === 5) canProceed = true; // Make sector specific optional to proceed easily, can add strict validation later
  if (step === 6) canProceed = !!files.cv && !!files.passportPhoto;
  if (step === 7) canProceed = formData.declarations.isTrue && formData.declarations.shareProfile;

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
               <h2 className="text-[16px] font-bold text-gray-900 leading-tight">Job Application</h2>
               <p className="text-[12px] font-medium text-gray-400">Step {step} of 7</p>
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
        <div className="flex-1 overflow-y-auto px-5 py-6 hide-scrollbar relative bg-gray-50/30">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-[14px]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pb-20">
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center border-[6px] border-green-100">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-gray-900">Application Submitted!</h2>
                 <p className="text-[15px] text-gray-500 px-4 leading-relaxed">
                   Your profile has been created successfully. Our team will review your application soon.
                 </p>
              </div>
            </div>
          ) : (
            <div className="pb-24">
              
              {/* STEP 1: Career Status */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Welcome!</h1>
                    <p className="text-[15px] text-gray-500">To get started, please tell us about your career status.</p>
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
                      <h3 className="text-[17px] font-bold text-gray-900 mb-1">Fresh Graduate</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">Recently graduated and looking for my first professional job.</p>
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
                      <h3 className="text-[17px] font-bold text-gray-900 mb-1">Experienced Professional</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">I have previous work experience and I'm applying for another job.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Job Sector */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Job Category</h1>
                    <p className="text-[15px] text-gray-500">Which sector are you most interested in?</p>
                  </div>

                  <div className="space-y-3">
                    {SECTORS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setFormData((p: any) => ({ ...p, sector: s.id }))}
                        className={`w-full flex items-center p-4 rounded-[20px] border-2 transition-all ${
                          formData.sector === s.id ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl shrink-0">
                          {s.emoji}
                        </div>
                        <div className="flex-1 text-left px-4 min-w-0">
                          <h3 className="text-[15px] font-bold text-gray-900 leading-tight mb-1">{s.title}</h3>
                          <p className="text-[12px] text-gray-500 leading-relaxed truncate whitespace-normal line-clamp-2">{s.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          formData.sector === s.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                        }`}>
                          {formData.sector === s.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Personal Info */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-6">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Personal Info</h1>
                    <p className="text-[15px] text-gray-500">Tell us a bit about yourself.</p>
                  </div>
                  
                  <InputField label="Full Name" section="personal" field="fullName" required formData={formData} updateForm={updateForm} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Gender" section="personal" field="gender" options={["Male", "Female"]} required formData={formData} updateForm={updateForm} />
                    <InputField label="Date of Birth" section="personal" field="dob" type="date" required formData={formData} updateForm={updateForm} />
                  </div>
                  <InputField label="Phone Number" section="personal" field="phone" type="tel" required formData={formData} updateForm={updateForm} />
                  <InputField label="Email Address" section="personal" field="email" type="email" required formData={formData} updateForm={updateForm} />
                  <div className="grid grid-cols-2 gap-4">
                     <InputField label="Region" section="personal" field="region" formData={formData} updateForm={updateForm} />
                     <InputField label="City" section="personal" field="city" formData={formData} updateForm={updateForm} />
                  </div>
                  <InputField label="Current Address" section="personal" field="currentAddress" type="textarea" formData={formData} updateForm={updateForm} />
                  <InputField label="Nationality" section="personal" field="nationality" formData={formData} updateForm={updateForm} />
                  <InputField label="Ethiopian National ID (Optional)" section="personal" field="nationalId" formData={formData} updateForm={updateForm} />
                </div>
              )}

              {/* STEP 4: Education & Experience */}
              {step === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Education</h1>
                    <p className="text-[15px] text-gray-500 mb-6">Your academic background.</p>
                    <InputField label="Highest Education" section="education" field="highestLevel" options={["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD"]} required formData={formData} updateForm={updateForm} />
                    <InputField label="University / College" section="education" field="university" required formData={formData} updateForm={updateForm} />
                    <InputField label="Field of Study" section="education" field="field" required formData={formData} updateForm={updateForm} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Graduation Year" section="education" field="gradYear" type="number" required formData={formData} updateForm={updateForm} />
                      <InputField label="CGPA" section="education" field="cgpa" type="number" formData={formData} updateForm={updateForm} />
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  {formData.status === 'fresh' ? (
                     <div>
                       <h1 className="text-2xl font-black text-gray-900 mb-2">Experience</h1>
                       <p className="text-[15px] text-gray-500 mb-6">Even without full-time jobs, tell us what you've done.</p>
                       <InputField label="Internship Experience (Optional)" section="experience" field="internship" type="textarea" formData={formData} updateForm={updateForm} />
                       <InputField label="Volunteer Experience" section="experience" field="volunteer" type="textarea" formData={formData} updateForm={updateForm} />
                       <InputField label="Projects" section="experience" field="projects" type="textarea" formData={formData} updateForm={updateForm} />
                       <InputField label="Skills" section="experience" field="skills" type="textarea" formData={formData} updateForm={updateForm} />
                       <InputField label="Languages" section="experience" field="languages" type="textarea" formData={formData} updateForm={updateForm} />
                       <InputField label="Computer Skills" section="experience" field="computerSkills" type="textarea" formData={formData} updateForm={updateForm} />
                     </div>
                  ) : (
                     <div>
                       <h1 className="text-2xl font-black text-gray-900 mb-2">Professional Experience</h1>
                       <p className="text-[15px] text-gray-500 mb-6">Your work history.</p>
                       <InputField label="Years of Experience" section="experience" field="yearsOfExperience" type="number" formData={formData} updateForm={updateForm} />
                       <InputField label="Current/Latest Employer" section="experience" field="currentEmployer" formData={formData} updateForm={updateForm} />
                       <InputField label="Current Position" section="experience" field="currentPosition" formData={formData} updateForm={updateForm} />
                       <InputField label="Previous Employer" section="experience" field="previousEmployer" formData={formData} updateForm={updateForm} />
                       <InputField label="Employment Type" section="experience" field="employmentType" options={["Full-time", "Part-time", "Contract", "Freelance"]} formData={formData} updateForm={updateForm} />
                       <InputField label="Current Salary (Optional)" section="experience" field="currentSalary" formData={formData} updateForm={updateForm} />
                       <InputField label="Professional Skills" section="experience" field="professionalSkills" type="textarea" formData={formData} updateForm={updateForm} />
                       <InputField label="Leadership Experience" section="experience" field="leadershipExperience" type="textarea" formData={formData} updateForm={updateForm} />
                       <InputField label="References" section="experience" field="references" type="textarea" formData={formData} updateForm={updateForm} />
                     </div>
                  )}
                </div>
              )}

              {/* STEP 5: Sector Specific */}
              {step === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-6">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Additional Info</h1>
                    <p className="text-[15px] text-gray-500">Specific requirements for {SECTORS.find(s=>s.id===formData.sector)?.title}.</p>
                  </div>

                  {formData.sector === 'embassy' && (
                    <>
                      <InputField label="English Level" section="sectorSpecific" field="englishLevel" options={["Basic", "Intermediate", "Fluent", "Native"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Other Languages" section="sectorSpecific" field="otherLanguages" formData={formData} updateForm={updateForm} />
                      <InputField label="Computer Skills" section="sectorSpecific" field="embassyComputerSkills" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label="Security Clearance" section="sectorSpecific" field="securityClearance" options={["Yes", "No"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Typing Skills (WPM)" section="sectorSpecific" field="typingSkills" formData={formData} updateForm={updateForm} />
                      <InputField label="Motivation Letter / Statement" section="sectorSpecific" field="motivationLetter" type="textarea" formData={formData} updateForm={updateForm} />
                    </>
                  )}

                  {formData.sector === 'ngo' && (
                    <>
                      <InputField label="NGO Experience (Years)" section="sectorSpecific" field="ngoExperience" formData={formData} updateForm={updateForm} />
                      <InputField label="Project Management Skills" section="sectorSpecific" field="projectManagement" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label="Community Development Exp." section="sectorSpecific" field="communityDevelopment" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label="Proposal Writing" section="sectorSpecific" field="proposalWriting" options={["Yes", "No", "Basic"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Report Writing" section="sectorSpecific" field="reportWriting" options={["Yes", "No", "Basic"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Donor Experience (USAID, UN, etc)" section="sectorSpecific" field="donorExperience" type="textarea" formData={formData} updateForm={updateForm} />
                    </>
                  )}

                  {formData.sector === 'airport' && (
                    <>
                      <InputField label="Customer Service Experience" section="sectorSpecific" field="customerService" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label="Ground Handling Experience" section="sectorSpecific" field="groundHandling" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label="Cargo Experience" section="sectorSpecific" field="cargoExperience" type="textarea" formData={formData} updateForm={updateForm} />
                      <InputField label="Shift Availability" section="sectorSpecific" field="shiftAvailability" options={["Day Shift", "Night Shift", "Any Shift"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Physical Fitness Status" section="sectorSpecific" field="physicalFitness" options={["Excellent", "Good", "Average"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Travel Availability" section="sectorSpecific" field="travelAvailability" options={["Yes", "No"]} formData={formData} updateForm={updateForm} />
                    </>
                  )}

                  {formData.sector === 'foreign' && (
                    <>
                      <InputField label="Preferred Country" section="sectorSpecific" field="preferredCountry" formData={formData} updateForm={updateForm} />
                      <InputField label="Passport Available" section="sectorSpecific" field="passportAvailable" options={["Yes", "No"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Passport Number" section="sectorSpecific" field="passportNumber" formData={formData} updateForm={updateForm} />
                      <InputField label="Passport Expiry Date" section="sectorSpecific" field="passportExpiry" type="date" formData={formData} updateForm={updateForm} />
                      <InputField label="Ready to Relocate" section="sectorSpecific" field="readyToRelocate" options={["Immediately", "Within 1 Month", "Within 3 Months"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Medical Certificate" section="sectorSpecific" field="medicalCertificate" options={["Yes", "No"]} formData={formData} updateForm={updateForm} />
                      <InputField label="Police Clearance" section="sectorSpecific" field="policeClearance" options={["Yes", "No"]} formData={formData} updateForm={updateForm} />
                    </>
                  )}
                </div>
              )}

              {/* STEP 6: File Uploads */}
              {step === 6 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-6">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Upload Documents</h1>
                    <p className="text-[15px] text-gray-500">Provide your files (PDF, DOC, JPG, PNG)</p>
                  </div>
                  
                  <FileUploadCard id="cv" label="CV / Resume" required files={files} handleFileChange={handleFileChange} />
                  <FileUploadCard id="educationalCert" label="Highest Educational Certificate" required files={files} handleFileChange={handleFileChange} />
                  <FileUploadCard id="experienceCert" label="Experience Certificate (If any)" files={files} handleFileChange={handleFileChange} />
                  <FileUploadCard id="passportPhoto" label="Passport Size Photo" accept="image/*" required files={files} handleFileChange={handleFileChange} />
                  <FileUploadCard id="passport" label="Passport / ID Copy (Optional)" files={files} handleFileChange={handleFileChange} />
                </div>
              )}

              {/* STEP 7: Review & Final */}
              {step === 7 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-6">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Review & Submit</h1>
                    <p className="text-[15px] text-gray-500">Almost done! Please review your declarations.</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
                     <p className="text-[14px] font-bold text-gray-900 mb-1">Applying as: <span className="text-blue-600">{formData.status === 'fresh' ? 'Fresh Graduate' : 'Experienced Professional'}</span></p>
                     <p className="text-[14px] font-bold text-gray-900">Target Sector: <span className="text-blue-600">{SECTORS.find(s=>s.id===formData.sector)?.title}</span></p>
                  </div>

                  <div className="space-y-4 border-2 border-gray-100 p-5 rounded-[20px] bg-white">
                     <label className="flex items-start gap-4 cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={formData.declarations.isTrue} 
                         onChange={(e) => updateForm('declarations', 'isTrue', e.target.checked)}
                         className="w-6 h-6 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                       />
                       <span className="text-[14px] font-medium text-gray-700 leading-relaxed select-none group-hover:text-gray-900 transition-colors">
                         I confirm that all information provided in this application is true and accurate to the best of my knowledge.
                       </span>
                     </label>

                     <div className="h-px bg-gray-100 my-2" />

                     <label className="flex items-start gap-4 cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={formData.declarations.shareProfile} 
                         onChange={(e) => updateForm('declarations', 'shareProfile', e.target.checked)}
                         className="w-6 h-6 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                       />
                       <span className="text-[14px] font-medium text-gray-700 leading-relaxed select-none group-hover:text-gray-900 transition-colors">
                         I agree that Pathway Agency may share my profile and uploaded documents with prospective employers for recruitment purposes.
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
                   Back
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
                      Processing...
                    </span>
                  ) : (
                    step === 7 ? "Submit Application" : "Continue"
                  )}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

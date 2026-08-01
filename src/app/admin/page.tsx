"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getPathwayPosts, PathwayItem, PaymentConfig, getPaymentSettings, savePaymentSettings, deletePathwayPost, updatePathwayPostStatus, markApplicationAsViewed } from "@/lib/db";
import { useRouter } from "next/navigation";
import {
  Users, FileText, LogOut, Eye, X, Phone, MapPin,
  Briefcase, CheckCircle2, AlertCircle, Search, RefreshCw, Trash2, Settings, Calendar, Clock, Send
} from "lucide-react";

const SECTOR_LABELS: Record<string, string> = {
  embassy: "🏛️ Embassy & Diplomatic",
  ngo: "🌍 NGOs & UN Agencies",
  airport: "✈️ Airport & Aviation",
  foreign: "🌐 Foreign Employment",
};

const STATUS_LABELS: Record<string, string> = {
  fresh: "🎓 Fresh Graduate",
  experienced: "💼 Experienced",
};

function DetailModal({ app, onClose, onUpdate, onDelete }: { app: PathwayItem; onClose: () => void; onUpdate: (id: string, status: 'accepted' | 'rejected' | 'interview') => Promise<void>; onDelete: (id: string) => Promise<void>; }) {
  const fd = app.formData;
  // Status can be at top-level (Firebase/updated) or inside formData (legacy)
  const appStatus = app.applicationStatus || fd?.applicationStatus;
  const [processing, setProcessing] = useState(false);
  const [showInterviewPicker, setShowInterviewPicker] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!confirm("Are you sure you want to Accept this application?")) return;
    setProcessing(true);
    await onUpdate(app.id!, 'accepted');
    setProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to REJECT and completely DELETE this application?")) return;
    setProcessing(true);
    await onDelete(app.id!);
    setProcessing(false);
    onClose();
  };

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewTime) return;
    setEmailSending(true);
    setEmailError(null);
    try {
      // 1. Update status in DB
      await onUpdate(app.id!, 'interview');
      // 2. Send email notification
      const toEmail = fd?.personal?.email || app.authorEmail;
      const toName = fd?.personal?.fullName || app.authorName;
      const res = await fetch('/api/send-interview-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail,
          toName,
          interviewDate,
          interviewTime,
          sector: fd?.sector || '',
          role: fd?.sectorSpecific?.subCategory || '',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Email failed');
      setEmailSent(true);
    } catch (err: any) {
      setEmailError(err.message || 'Failed to send email');
    } finally {
      setEmailSending(false);
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">{title}</h3>
      <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">{children}</div>
    </div>
  );
  const Row = ({ label, value }: { label: string; value: string }) => (
    value ? (
      <div className="flex justify-between items-start px-4 py-2.5 gap-4">
        <span className="text-[13px] text-gray-400 font-semibold shrink-0">{label}</span>
        <span className="text-[13px] font-semibold text-gray-800 text-right">{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      <div className="w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-black text-gray-900">{fd?.personal?.fullName || app.authorName}</h2>
            <p className="text-[12px] text-gray-400">{SECTOR_LABELS[fd?.sector] || fd?.sector} · {STATUS_LABELS[fd?.status] || fd?.status}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">
          {appStatus && (
            <div className={`p-4 rounded-xl border ${appStatus === 'accepted' ? 'bg-green-50 border-green-200 text-green-700' : appStatus === 'interview' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-red-50 border-red-200 text-red-700'} flex items-center gap-3`}>
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <p className="text-sm font-bold">Application {appStatus.toUpperCase()}</p>
              </div>
            </div>
          )}

          {fd?.uploadedUrls?.paymentScreenshot && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="text-[12px] font-bold text-blue-800 uppercase tracking-widest mb-3">Payment Receipt</h3>
              <a href={fd.uploadedUrls.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                <img src={fd.uploadedUrls.paymentScreenshot} alt="Payment" className="w-full max-w-[200px] object-cover rounded-lg shadow-sm border border-blue-200 mx-auto block hover:opacity-90 transition-opacity" />
              </a>
            </div>
          )}

          <Section title="Contact">
            <Row label="Phone" value={fd?.personal?.phone ? `+251${fd.personal.phone}` : app.description} />
            <Row label="Email" value={fd?.personal?.email || app.authorEmail} />
            <Row label="Region" value={fd?.personal?.region} />
            <Row label="City" value={fd?.personal?.city} />
            <Row label="Gender" value={fd?.personal?.gender} />
            <Row label="Date of Birth" value={fd?.personal?.dob} />
          </Section>

          <Section title="Application">
            <Row label="Status" value={STATUS_LABELS[fd?.status] || fd?.status} />
            <Row label="Sector" value={SECTOR_LABELS[fd?.sector] || fd?.sector} />
            <Row label="Specific Role" value={fd?.sectorSpecific?.subCategory} />
            <Row label="Applied On" value={app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString('en-ET') : new Date(app.createdAt).toLocaleDateString('en-ET')} />
          </Section>

          <Section title="Education">
            <Row label="Level" value={fd?.education?.highestLevel} />
            <Row label="Institution" value={fd?.education?.university} />
            <Row label="Field of Study" value={fd?.education?.field} />
            <Row label="Graduation Year" value={fd?.education?.gradYear} />
            <Row label="CGPA" value={fd?.education?.cgpa} />
          </Section>

          {fd?.status === 'fresh' ? (
            <Section title="Background">
              <Row label="Internship/Volunteer" value={fd?.experience?.internship} />
              <Row label="Key Skills" value={fd?.experience?.skills} />
              <Row label="Languages" value={fd?.experience?.languages} />
            </Section>
          ) : (
            <Section title="Work Experience">
              <Row label="Years Exp." value={fd?.experience?.yearsOfExperience} />
              <Row label="Employer" value={fd?.experience?.currentEmployer} />
              <Row label="Position" value={fd?.experience?.currentPosition} />
              <Row label="Employment Type" value={fd?.experience?.employmentType} />
              <Row label="Professional Skills" value={fd?.experience?.professionalSkills} />
            </Section>
          )}

          {app.formData?.uploadedUrls && Object.keys(app.formData.uploadedUrls).length > 0 && (
            <div className="mb-6">
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Uploaded Documents</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(app.formData.uploadedUrls).map(([key, url]: any) => (
                  key !== 'paymentScreenshot' && (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-[13px] font-semibold hover:bg-blue-100 transition-colors">
                      <FileText className="w-4 h-4 shrink-0" />
                      {key === 'cv' ? 'CV / Resume' : key === 'passportPhoto' ? 'Passport Photo' : key === 'educationalCert' ? 'Edu. Certificate' : key === 'experienceCert' ? 'Experience Cert.' : key === 'passport' ? 'Passport / ID' : key}
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        {appStatus === 'accepted' ? (
          showInterviewPicker ? (
            <div className="px-5 py-5 border-t border-gray-100 shrink-0 space-y-4">
              <p className="text-[13px] font-black text-gray-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> Schedule Interview</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Date</label>
                  <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Time</label>
                  <input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
              </div>
              {emailError && <p className="text-[12px] text-red-500 font-semibold">{emailError}</p>}
              {emailSent ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-[13px] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Email sent successfully!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowInterviewPicker(false)} className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-[14px] hover:bg-gray-200">Cancel</button>
                  <button onClick={handleScheduleInterview} disabled={emailSending || !interviewDate || !interviewTime}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-[14px] hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50">
                    <Send className="w-4 h-4" /> {emailSending ? 'Sending...' : 'Send & Schedule'}
                  </button>
                </div>
              )}
              {emailSent && (
                <button onClick={onClose} className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] hover:bg-gray-200">Close</button>
              )}
            </div>
          ) : (
            <div className="px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-3 shrink-0">
              <button onClick={handleReject} disabled={processing} className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold text-[14px] hover:bg-red-100 flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> {processing ? 'Processing...' : 'Delete'}
              </button>
              <button onClick={() => setShowInterviewPicker(true)} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-[14px] hover:bg-blue-700 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Interview Appt.
              </button>
            </div>
          )
        ) : appStatus === 'interview' ? (
          <div className="px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-3 shrink-0">
            <button onClick={handleReject} disabled={processing} className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold text-[14px] hover:bg-red-100 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> {processing ? 'Processing...' : 'Delete'}
            </button>
            <div className="w-full py-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-[14px] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Interview Scheduled
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-3 shrink-0">
            <button onClick={handleReject} disabled={processing} className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold text-[14px] hover:bg-red-100 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> {processing ? 'Processing...' : 'Reject & Delete'}
            </button>
            <button onClick={handleAccept} disabled={processing} className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-[14px] hover:bg-green-700 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {processing ? 'Processing...' : 'Accept'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPaymentSettings().then(setConfig);
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await savePaymentSettings(config);
    setSaving(false);
    alert("Payment settings saved successfully!");
  };

  if (!config) return <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  const PaymentMethodEditor = ({ title, field }: { title: string, field: keyof Omit<PaymentConfig, 'feeAmount'> }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-900">{title}</h4>
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" checked={config[field].active} onChange={e => setConfig({ ...config, [field]: { ...config[field], active: e.target.checked } })} className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      {config[field].active && (
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Holder Name</label>
            <input type="text" value={config[field].holderName} onChange={e => setConfig({ ...config, [field]: { ...config[field], holderName: e.target.value } })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Account / Phone Number</label>
            <input type="text" value={config[field].account} onChange={e => setConfig({ ...config, [field]: { ...config[field], account: e.target.value } })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900">Application Fee Amount</h3>
          <p className="text-xs text-gray-500">The amount displayed to applicants on step 7.</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" value={config.feeAmount} onChange={e => setConfig({ ...config, feeAmount: parseInt(e.target.value) || 0 })} className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-900 text-center focus:outline-none focus:border-blue-500" />
          <span className="font-bold text-gray-400">ETB</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <PaymentMethodEditor title="Commercial Bank of Ethiopia (CBE)" field="cbe" />
        <PaymentMethodEditor title="Telebirr" field="telebirr" />
        <PaymentMethodEditor title="Bank of Abyssinia (BOA)" field="boa" />
        <PaymentMethodEditor title="Awash Bank" field="awash" />
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-sm transition-all disabled:opacity-50">
        {saving ? "Saving..." : "Save Payment Settings"}
      </button>
    </div>
  );
}

export default function AdminPage() {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'apps' | 'settings'>('apps');
  const [applications, setApplications] = useState<PathwayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<PathwayItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.push("/");
      return;
    }
    fetchApplications();
  }, [user, isAdmin, authLoading, router]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const posts = await getPathwayPosts();
      const apps = posts.filter(p => p.title?.startsWith("[App]"));
      setApplications(apps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'rejected' | 'interview') => {
    await updatePathwayPostStatus(id, status);
    fetchApplications();
  };

  const handleDelete = async (id: string) => {
    await deletePathwayPost(id);
    fetchApplications();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-gray-600 font-semibold">Access Denied</p>
        </div>
      </div>
    );
  }

  const filteredApps = applications.filter(app => {
    const fd = app.formData;
    const name = (fd?.personal?.fullName || app.authorName || "").toLowerCase();
    const email = (fd?.personal?.email || app.authorEmail || "").toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchSector = filterSector === "all" || fd?.sector === filterSector;
    const matchStatus = filterStatus === "all" || fd?.status === filterStatus;
    return matchSearch && matchSector && matchStatus;
  }).sort((a, b) => {
    const aViewed = a.isViewed || a.formData?.isViewed ? 1 : 0;
    const bViewed = b.isViewed || b.formData?.isViewed ? 1 : 0;
    return aViewed - bViewed;
  });

  const unviewedCount = applications.filter(a => !(a.isViewed || a.formData?.isViewed)).length;

  const stats = {
    total: applications.length,
    fresh: applications.filter(a => a.formData?.status === 'fresh').length,
    experienced: applications.filter(a => a.formData?.status === 'experienced').length,
    embassy: applications.filter(a => a.formData?.sector === 'embassy').length,
    ngo: applications.filter(a => a.formData?.sector === 'ngo').length,
    airport: applications.filter(a => a.formData?.sector === 'airport').length,
    foreign: applications.filter(a => a.formData?.sector === 'foreign').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[15px] font-black text-gray-900 leading-tight">Pathway Admin</p>
              </div>
            </div>
            
            <nav className="hidden sm:flex gap-1">
              <button onClick={() => setActiveTab('apps')} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2 ${activeTab === 'apps' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                Applications {unviewedCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unviewedCount}</span>}
              </button>
              <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={fetchApplications} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <div className="sm:hidden px-4 flex gap-1 border-t border-gray-50 pt-2 pb-2 bg-white">
          <button onClick={() => setActiveTab('apps')} className={`flex-1 py-2 rounded-lg text-[13px] font-bold text-center transition-all flex items-center justify-center gap-2 ${activeTab === 'apps' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
            Applications {unviewedCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unviewedCount}</span>}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 py-2 rounded-lg text-[13px] font-bold text-center transition-all flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {activeTab === 'settings' ? (
          <SettingsTab />
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Applications", value: stats.total, color: "from-blue-500 to-indigo-500" },
                { label: "Fresh Graduates", value: stats.fresh, color: "from-green-500 to-emerald-500" },
                { label: "Experienced", value: stats.experienced, color: "from-purple-500 to-violet-500" },
                { label: "Foreign Employment", value: stats.foreign, color: "from-orange-500 to-amber-500" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-[12px] font-bold text-gray-400 mb-1">{s.label}</p>
                  <p className={`text-3xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Sector Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'embassy', label: '🏛️ Embassy', value: stats.embassy },
                { id: 'ngo', label: '🌍 NGO/UN', value: stats.ngo },
                { id: 'airport', label: '✈️ Airport', value: stats.airport },
                { id: 'foreign', label: '🌐 Foreign', value: stats.foreign },
              ].map(s => (
                <button key={s.id}
                  onClick={() => setFilterSector(filterSector === s.id ? 'all' : s.id)}
                  className={`rounded-2xl p-3 border text-left transition-all ${filterSector === s.id ? 'border-blue-500 bg-blue-50' : 'bg-white border-gray-100 hover:border-blue-200'}`}>
                  <p className="text-[12px] font-bold text-gray-500">{s.label}</p>
                  <p className="text-xl font-black text-gray-900">{s.value}</p>
                </button>
              ))}
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                <option value="all">All Status</option>
                <option value="fresh">Fresh Graduate</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-[15px] font-black text-gray-900">
                  Applications <span className="text-gray-400 font-semibold ml-1">({filteredApps.length})</span>
                </h2>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[14px] font-bold text-gray-400">Loading applications...</p>
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Users className="w-12 h-12 text-gray-200" />
                  <p className="text-[14px] font-bold text-gray-400">No applications found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredApps.map((app) => {
                    const fd = app.formData;
                    const name = fd?.personal?.fullName || app.authorName || "Unknown";
                    const email = fd?.personal?.email || app.authorEmail || "";
                    const phone = fd?.personal?.phone ? `+251${fd.personal.phone}` : "";
                    const sector = fd?.sector || "";
                    const status = fd?.status || "";
                    const role = fd?.sectorSpecific?.subCategory || "";
                    const city = fd?.personal?.city || fd?.personal?.region || "";
                    const date = app.createdAt?.toDate
                      ? app.createdAt.toDate().toLocaleDateString('en-ET')
                      : app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-ET') : "";
                    const hasFiles = fd?.uploadedUrls && Object.keys(fd.uploadedUrls).length > 0;
                    const appStatus = app.applicationStatus || fd?.applicationStatus;
                    const isAccepted = appStatus === 'accepted';
                    const isInterview = appStatus === 'interview';
                    const isViewed = app.isViewed || fd?.isViewed;

                    return (
                      <div key={app.id} className={`px-5 py-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4 ${!isViewed ? 'bg-blue-50/10 border-l-2 border-l-blue-500' : ''} ${isAccepted ? 'bg-green-50/30' : isInterview ? 'bg-blue-50/30' : ''}`}>
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-[15px] shrink-0 shadow-sm relative">
                          {name.charAt(0).toUpperCase()}
                          {isAccepted && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"><CheckCircle2 className="w-2.5 h-2.5 text-white" /></div>}
                          {isInterview && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center"><CheckCircle2 className="w-2.5 h-2.5 text-white" /></div>}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="text-[14px] font-bold text-gray-900 truncate">{name}</p>
                            {status && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === 'fresh' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                                {status === 'fresh' ? 'Fresh Grad' : 'Experienced'}
                              </span>
                            )}
                            {isAccepted && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                Accepted
                              </span>
                            )}
                            {isInterview && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                Interview
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            {phone && <span className="text-[12px] font-medium text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{phone}</span>}
                            {sector && <span className="text-[12px] font-medium text-gray-500 flex items-center gap-1"><Briefcase className="w-3 h-3" />{SECTOR_LABELS[sector] || sector}</span>}
                          </div>
                          {role && <p className="text-[11px] text-blue-600 font-bold mt-1 truncate">{role}</p>}
                        </div>

                        {/* Date + View button */}
                        <div className="text-right shrink-0 flex flex-col items-end">
                          <p className="text-[11px] font-bold text-gray-400 mb-1.5">{date}</p>
                          <button onClick={() => {
                            setSelectedApp(app);
                            if (!isViewed) {
                              markApplicationAsViewed(app.id!);
                              setApplications(apps => apps.map(a => a.id === app.id ? { ...a, isViewed: true } : a));
                            }
                          }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-[12px] font-bold rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-sm">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedApp && <DetailModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdate={handleUpdateStatus} onDelete={handleDelete} />}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getPathwayPosts, PathwayItem } from "@/lib/db";
import { useRouter } from "next/navigation";
import {
  Users, FileText, LogOut, Eye, X, Phone, Mail, MapPin,
  Briefcase, GraduationCap, Globe, ChevronDown, ChevronRight,
  CheckCircle2, AlertCircle, Search, RefreshCw
} from "lucide-react";

const ADMIN_EMAIL = "shikurebrahim3828@gmail.com";

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

function DetailModal({ app, onClose }: { app: PathwayItem; onClose: () => void }) {
  const fd = app.formData;
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
        <div className="overflow-y-auto flex-1 px-5 py-5">
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

          {fd?.sector && (
            <Section title="Sector Info">
              {fd.sector === 'embassy' && <>
                <Row label="English Level" value={fd?.sectorSpecific?.englishLevel} />
                <Row label="Other Languages" value={fd?.sectorSpecific?.otherLanguages} />
                <Row label="Security Clearance" value={fd?.sectorSpecific?.securityClearance} />
                <Row label="Typing Speed" value={fd?.sectorSpecific?.typingSkills} />
              </>}
              {fd.sector === 'ngo' && <>
                <Row label="NGO Experience" value={fd?.sectorSpecific?.ngoExperience} />
                <Row label="Proposal Writing" value={fd?.sectorSpecific?.proposalWriting} />
                <Row label="Report Writing" value={fd?.sectorSpecific?.reportWriting} />
              </>}
              {fd.sector === 'airport' && <>
                <Row label="Preferred Role" value={fd?.sectorSpecific?.customerService} />
                <Row label="Ground Handling" value={fd?.sectorSpecific?.groundHandling} />
                <Row label="Shift Preference" value={fd?.sectorSpecific?.shiftAvailability} />
              </>}
              {fd.sector === 'foreign' && <>
                <Row label="Destination" value={fd?.sectorSpecific?.preferredCountry} />
                <Row label="Has Passport" value={fd?.sectorSpecific?.passportAvailable} />
                <Row label="Passport No." value={fd?.sectorSpecific?.passportNumber} />
                <Row label="Travel Ready" value={fd?.sectorSpecific?.readyToRelocate} />
                <Row label="Medical Cert." value={fd?.sectorSpecific?.medicalCertificate} />
                <Row label="Police Clearance" value={fd?.sectorSpecific?.policeClearance} />
              </>}
            </Section>
          )}

          {app.formData?.uploadedUrls && Object.keys(app.formData.uploadedUrls).length > 0 && (
            <div className="mb-6">
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Uploaded Documents</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(app.formData.uploadedUrls).map(([key, url]: any) => (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-[13px] font-semibold hover:bg-blue-100 transition-colors">
                    <FileText className="w-4 h-4 shrink-0" />
                    {key === 'cv' ? 'CV / Resume' : key === 'passportPhoto' ? 'Passport Photo' : key === 'educationalCert' ? 'Edu. Certificate' : key === 'experienceCert' ? 'Experience Cert.' : key === 'passport' ? 'Passport / ID' : key}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<PathwayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<PathwayItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user) { router.push("/"); return; }
    if (user.email !== ADMIN_EMAIL) { router.push("/"); return; }
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const posts = await getPathwayPosts();
      // Only show real applications (those with [App] prefix)
      const apps = posts.filter(p => p.title?.startsWith("[App]"));
      setApplications(apps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.email !== ADMIN_EMAIL) {
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
  });

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-black text-gray-900">Pathway Admin</p>
              <p className="text-[11px] text-gray-400">Applications Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchApplications} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

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
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-[15px] font-black text-gray-900">
              Applications <span className="text-gray-400 font-semibold ml-1">({filteredApps.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[14px] text-gray-400">Loading applications...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Users className="w-10 h-10 text-gray-200" />
              <p className="text-[14px] text-gray-400">No applications found</p>
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

                return (
                  <div key={app.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-[15px] shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-bold text-gray-900">{name}</p>
                        {status && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === 'fresh' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                            {status === 'fresh' ? 'Fresh Grad' : 'Experienced'}
                          </span>
                        )}
                        {hasFiles && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {Object.keys(fd.uploadedUrls).length} docs
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {phone && <span className="text-[12px] text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{phone}</span>}
                        {city && <span className="text-[12px] text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{city}</span>}
                        {sector && <span className="text-[12px] text-gray-400">{SECTOR_LABELS[sector] || sector}</span>}
                      </div>
                      {role && <p className="text-[11px] text-blue-600 font-semibold mt-0.5">{role}</p>}
                    </div>

                    {/* Date + View button */}
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-gray-400 mb-1">{date}</p>
                      <button onClick={() => setSelectedApp(app)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-[12px] font-bold rounded-xl hover:bg-blue-700 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedApp && <DetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
    </div>
  );
}

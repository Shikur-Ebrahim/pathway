"use client";

import React, { useEffect, useState } from "react";
import { PathwayItem, InterviewSession, getInterviews, createInterview, markInterviewResultSent, deleteInterview } from "@/lib/db";
import { Trophy, Calendar, Clock, Send, CheckCircle2, X, Trash2 } from "lucide-react";

export function InterviewTab({ applications }: { applications: PathwayItem[] }) {
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Schedule Form State
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [scheduling, setScheduling] = useState(false);

  // Sending result state
  const [sendingResultId, setSendingResultId] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const data = await getInterviews();
      setInterviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedEmail(val);
    const found = applications.find(a => (a.formData?.personal?.email || a.authorEmail) === val);
    if (found) {
      setSelectedName(found.formData?.personal?.fullName || found.authorName || '');
    } else {
      setSelectedName('');
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !selectedName || !schedDate || !schedTime) return;
    setScheduling(true);
    try {
      const scheduledAt = new Date(`${schedDate}T${schedTime}`).toISOString();

      // 1. Save interview session with questions auto-attached in db
      await createInterview({
        applicantEmail: selectedEmail,
        applicantName: selectedName,
        scheduledAt,
        status: 'scheduled',
        questions: [] // db.ts will auto-fill DEFAULT_QUESTIONS
      });

      // 2. Send notification email via Resend
      const res = await fetch('/api/send-interview-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: selectedEmail, toName: selectedName, scheduledAt })
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Email notification failed to send');
      }

      setShowSchedule(false);
      setSelectedEmail('');
      setSelectedName('');
      setSchedDate('');
      setSchedTime('');
      fetchInterviews();
      alert('✅ Interview scheduled and notification email sent successfully!');
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    } finally {
      setScheduling(false);
    }
  };

  const handleSendResult = async (session: InterviewSession) => {
    if (!session.id || session.score === undefined || session.passed === undefined) return;
    setSendingResultId(session.id);
    try {
      await fetch('/api/send-interview-result-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: session.applicantEmail,
          toName: session.applicantName,
          score: session.score,
          total: session.questions?.length || 10,
          passed: session.passed
        })
      });
      await markInterviewResultSent(session.id);
      fetchInterviews();
      alert('Result email sent successfully!');
    } catch (err: any) {
      alert('Error sending result: ' + err.message);
    } finally {
      setSendingResultId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview record?')) return;
    await deleteInterview(id);
    fetchInterviews();
  };

  const uniqueEmails = Array.from(new Set(applications.map(a => a.formData?.personal?.email || a.authorEmail).filter(Boolean)));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Trophy className="w-6 h-6 text-indigo-600" /> Online Interviews</h2>
        <button onClick={() => setShowSchedule(!showSchedule)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
          {showSchedule ? <X className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
          {showSchedule ? 'Close' : 'Schedule New'}
        </button>
      </div>

      {showSchedule && (
        <form onSubmit={handleSchedule} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Select Applicant Email</label>
              <select value={selectedEmail} onChange={handleEmailSelect} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none">
                <option value="">-- Select Email --</option>
                {uniqueEmails.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Applicant Name</label>
              <input type="text" value={selectedName} onChange={e => setSelectedName(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date</label>
              <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Time</label>
              <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={scheduling} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50">
              <Send className="w-4 h-4" /> {scheduling ? 'Scheduling & Emailing...' : 'Schedule & Notify Applicant'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : interviews.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4"><Clock className="w-8 h-8 text-gray-300" /></div>
            <h3 className="text-lg font-bold text-gray-900">No Interviews Scheduled</h3>
            <p className="text-gray-500 text-sm mt-1">Schedule an interview to see it here.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="p-4">Applicant</th>
                <th className="p-4">Scheduled For</th>
                <th className="p-4">Status / Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map(session => {
                const dt = new Date(session.scheduledAt);
                const isDone = session.status === 'completed';
                return (
                  <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-900 text-[14px]">{session.applicantName}</p>
                      <p className="text-gray-500 text-[12px] font-medium">{session.applicantEmail}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 text-[13px]">{dt.toLocaleDateString()}</p>
                      <p className="text-gray-500 text-[12px]">{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="p-4">
                      {!isDone ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200/50">
                          <Clock className="w-3.5 h-3.5" /> Scheduled
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border w-max ${session.passed ? 'bg-green-50 text-green-700 border-green-200/50' : 'bg-red-50 text-red-700 border-red-200/50'}`}>
                            {session.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            {session.passed ? 'PASSED' : 'FAILED'}
                          </span>
                          <span className="text-[12px] font-black text-gray-600">Score: {session.score}/{session.questions?.length || 10}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isDone && !session.resultSent && (
                          <button onClick={() => handleSendResult(session)} disabled={sendingResultId === session.id} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50">
                            <Send className="w-3.5 h-3.5" /> {sendingResultId === session.id ? 'Sending...' : 'Send Result'}
                          </button>
                        )}
                        {isDone && session.resultSent && (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-[12px] font-bold rounded-lg flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Result Sent
                          </span>
                        )}
                        <button onClick={() => handleDelete(session.id!)} className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors" title="Delete Record">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
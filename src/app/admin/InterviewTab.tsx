"use client";

import React, { useEffect, useState } from "react";
import { PathwayItem, InterviewSession, InterviewQuestion, getInterviews, createInterview, markInterviewResultSent, deleteInterview, saveDefaultQuestionsToFirestore, DEFAULT_QUESTIONS } from "@/lib/db";
import { Trophy, Calendar, Clock, Send, CheckCircle2, X, Trash2, Database, ChevronDown, ChevronUp, Eye, Pencil } from "lucide-react";

export function InterviewTab({ applications }: { applications: PathwayItem[] }) {
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const [showQuestions, setShowQuestions] = useState(false);
  const [editableQuestions, setEditableQuestions] = useState<InterviewQuestion[]>(
    DEFAULT_QUESTIONS.map(q => ({ ...q }))
  );
  const [editingQIndex, setEditingQIndex] = useState<number | null>(null);

  const [savingQ, setSavingQ] = useState(false);
  const [savedQ, setSavedQ] = useState(false);
  const [sendingResultId, setSendingResultId] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
    autoSeedQuestions();
  }, []);

  const autoSeedQuestions = async () => {
    try { await saveDefaultQuestionsToFirestore(); } catch (e) {}
  };

  const handleSaveQuestions = async () => {
    setSavingQ(true);
    try {
      await saveDefaultQuestionsToFirestore();
      setSavedQ(true);
      setTimeout(() => setSavedQ(false), 3000);
    } catch (err: any) {
      alert('Error saving questions: ' + err.message);
    } finally {
      setSavingQ(false);
    }
  };

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

      await createInterview({
        applicantEmail: selectedEmail,
        applicantName: selectedName,
        scheduledAt,
        status: 'scheduled',
        questions: editableQuestions
      });

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
      alert('Interview scheduled and notification email sent successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setScheduling(false);
    }
  };

  const handleSendResult = async (session: InterviewSession) => {
    if (!session.id || session.score === undefined || session.passed === undefined) return;
    setSendingResultId(session.id);
    try {
      const res = await fetch('/api/send-interview-result-email', {
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
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed');
      }
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

  const updateQuestion = (idx: number, field: keyof InterviewQuestion, value: any) => {
    setEditableQuestions(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    setEditableQuestions(prev => {
      const next = [...prev];
      const opts = [...next[qIdx].options];
      opts[optIdx] = value;
      next[qIdx] = { ...next[qIdx], options: opts };
      return next;
    });
  };

  const uniqueEmails = Array.from(new Set(applications.map(a => a.formData?.personal?.email || a.authorEmail).filter(Boolean)));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-indigo-600" /> Online Interviews
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveQuestions}
            disabled={savingQ}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${
              savedQ ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
            } disabled:opacity-50`}
          >
            <Database className="w-3.5 h-3.5" />
            {savingQ ? 'Saving...' : savedQ ? 'Questions Saved!' : `Save ${DEFAULT_QUESTIONS.length} Questions to DB`}
          </button>
          <button
            onClick={() => { setShowSchedule(!showSchedule); setShowQuestions(false); }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            {showSchedule ? <X className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            {showSchedule ? 'Close' : 'Schedule New'}
          </button>
        </div>
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

          <div className="border border-indigo-100 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowQuestions(!showQuestions)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <span className="flex items-center gap-2 text-[13px] font-bold text-indigo-700">
                <Eye className="w-4 h-4" />
                View / Edit Interview Questions ({editableQuestions.length} questions - 30 seconds each)
              </span>
              {showQuestions ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-indigo-600" />}
            </button>

            {showQuestions && (
              <div className="divide-y divide-gray-100 bg-white max-h-96 overflow-y-auto">
                {editableQuestions.map((q, qi) => (
                  <div key={qi} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 text-[12px] font-black rounded-full flex items-center justify-center mt-0.5">{qi + 1}</span>
                      <div className="flex-1 space-y-2">
                        {editingQIndex === qi ? (
                          <>
                            <textarea
                              value={q.question}
                              onChange={e => updateQuestion(qi, 'question', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                            />
                            <div className="space-y-1.5">
                              {q.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${qi}`}
                                    checked={q.correctIndex === oi}
                                    onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                                    className="w-4 h-4 text-indigo-600 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={e => updateOption(qi, oi, e.target.value)}
                                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                  />
                                  {q.correctIndex === oi && (
                                    <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">Correct</span>
                                  )}
                                </div>
                              ))}
                            </div>
                            <button type="button" onClick={() => setEditingQIndex(null)} className="text-[12px] font-bold text-indigo-600 hover:underline">
                              Done Editing
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="text-[13px] font-bold text-gray-800">{q.question}</p>
                            <ul className="space-y-1">
                              {q.options.map((opt, oi) => (
                                <li key={oi} className={`flex items-center gap-2 text-[12px] font-semibold px-3 py-1.5 rounded-lg ${q.correctIndex === oi ? 'bg-green-50 text-green-700' : 'text-gray-500 bg-gray-50'}`}>
                                  <span className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px] font-black border-current">
                                    {String.fromCharCode(65 + oi)}
                                  </span>
                                  {opt}
                                  {q.correctIndex === oi && <span className="ml-auto text-[10px] font-black text-green-600">correct</span>}
                                </li>
                              ))}
                            </ul>
                            <button type="button" onClick={() => setEditingQIndex(qi)} className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

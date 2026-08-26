"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Clock, CheckCircle2, AlertCircle, Trophy, XCircle, Volume2, VolumeX } from "lucide-react";
import { getInterviewByEmail, submitInterviewAnswers, InterviewSession, DEFAULT_QUESTIONS } from "@/lib/db";

const QUESTION_TIME = 45; // seconds per question
const TOTAL_TIME = QUESTION_TIME * 10; // total time for full quiz
const PASS_SCORE = 6;

type Phase = "email" | "waiting" | "quiz" | "done" | "already_done" | "not_found" | "expired";

export default function InterviewPortal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("email");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [countdown, setCountdown] = useState<number>(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [totalTimer, setTotalTimer] = useState(TOTAL_TIME);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleLookup = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const found = await getInterviewByEmail(email.trim());
      if (!found) { setPhase("not_found"); return; }
      if (found.status === "completed") { setPhase("already_done"); return; }
      setSession(found);
      const now = Date.now();
      const start = new Date(found.scheduledAt).getTime();
      const diff = Math.floor((start - now) / 1000);
      if (diff < -3600) { setPhase("expired"); return; }
      if (diff <= 0) {
        setPhase("quiz");
      } else {
        setCountdown(diff);
        setPhase("waiting");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phase !== "waiting") return;
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current!); setPhase("quiz"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current!);
  }, [phase]);

  // TTS - read all questions on quiz start
  useEffect(() => {
    if (phase !== "quiz" || !ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const questions = session?.questions || DEFAULT_QUESTIONS;
    let text = "Welcome. You have 45 seconds for each question. Please answer all 10 questions. ";
    questions.forEach((q, qi) => {
      text += `Question ${qi + 1}. ${q.question} Option A: ${q.options[0]}. Option B: ${q.options[1]}. Option C: ${q.options[2]}. Option D: ${q.options[3]}. `;
    });
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
    return () => { window.speechSynthesis.cancel(); };
  }, [phase, ttsEnabled]);

  const toggleTts = () => {
    setTtsEnabled(prev => {
      if (prev && typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  // Total quiz timer
  useEffect(() => {
    if (phase !== "quiz") return;
    totalTimerRef.current = setInterval(() => {
      setTotalTimer(prev => {
        if (prev <= 1) { clearInterval(totalTimerRef.current!); handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(totalTimerRef.current!);
  }, [phase]);

  const handleSubmit = (auto = false) => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(totalTimerRef.current!);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    const questions = session?.questions || DEFAULT_QUESTIONS;
    const finalAnswers = answers.map(a => a === null ? -1 : a);
    const score = finalAnswers.reduce((acc, a, i) => a === questions[i].correctIndex ? acc + 1 : acc, 0);
    const passed = score >= PASS_SCORE;
    if (session?.id) submitInterviewAnswers(session.id, finalAnswers, score, passed);
    setPhase("done");
  };

  const fmtCountdown = (s: number) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (d > 0) return `${d}d ${h}h ${m}m ${sec}s`;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const timerPct = (totalTimer / TOTAL_TIME) * 100;
  const timerColor = totalTimer > 200 ? "#22c55e" : totalTimer > 90 ? "#f59e0b" : "#ef4444";
  const questions = session?.questions || DEFAULT_QUESTIONS;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[14px] font-black text-gray-900">Online Interview</p>
              {phase === "quiz" && <p className="text-[11px] text-gray-400 font-semibold">{answeredCount}/10 answered</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {phase === "quiz" && (
              <button onClick={toggleTts} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                {ttsEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </button>
            )}
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer Bar (quiz only) */}
        {phase === "quiz" && (
          <div className="px-4 py-3 border-b border-gray-100 bg-white shrink-0">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" style={{ color: timerColor }} />
                <span className="text-[13px] font-black" style={{ color: timerColor }}>Time Remaining</span>
              </div>
              <span className="text-[20px] font-black font-mono" style={{ color: timerColor }}>{fmtCountdown(totalTimer)}</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${timerPct}%`, background: timerColor }} />
            </div>
            <p className="text-[11px] text-gray-400 font-semibold mt-1 text-right">45s per question · {TOTAL_TIME}s total</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">

          {/* EMAIL ENTRY */}
          {phase === "email" && (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Enter Your Email</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">Enter the email address you used to apply. If an interview has been scheduled for you, it will appear here.</p>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[13px]">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLookup()} placeholder="your@email.com" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              <button onClick={handleLookup} disabled={loading || !email.trim()} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[15px] rounded-2xl shadow-lg transition-all disabled:opacity-50">
                {loading ? "Checking..." : "Check My Interview →"}
              </button>
            </div>
          )}

          {/* NOT FOUND */}
          {phase === "not_found" && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto"><AlertCircle className="w-8 h-8 text-gray-400" /></div>
              <h2 className="text-lg font-black text-gray-900">No Interview Found</h2>
              <p className="text-[14px] text-gray-500">No interview scheduled for <strong>{email}</strong>. Please check your email or contact Pathway Agency.</p>
              <button onClick={() => { setPhase("email"); setError(null); }} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200">← Try Again</button>
            </div>
          )}

          {/* EXPIRED */}
          {phase === "expired" && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto"><XCircle className="w-8 h-8 text-red-500" /></div>
              <h2 className="text-lg font-black text-gray-900">Interview Missed</h2>
              <p className="text-[14px] text-gray-500">The scheduled time for your interview has passed. Please contact Pathway Agency to reschedule.</p>
              <button onClick={onClose} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200">Close</button>
            </div>
          )}

          {/* ALREADY DONE */}
          {phase === "already_done" && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-green-500" /></div>
              <h2 className="text-lg font-black text-gray-900">Already Completed</h2>
              <p className="text-[14px] text-gray-500">You have already completed your interview. Results will be sent to <strong>{email}</strong>.</p>
            </div>
          )}

          {/* WAITING */}
          {phase === "waiting" && session && (
            <div className="p-6 text-center space-y-5">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto"><Clock className="w-8 h-8 text-indigo-600" /></div>
              <div><h2 className="text-lg font-black text-gray-900 mb-1">Get Ready!</h2><p className="text-[14px] text-gray-500">Your interview starts in</p></div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
                <p className="text-3xl font-black font-mono">{fmtCountdown(countdown)}</p>
                <p className="text-blue-200 text-[13px] mt-2 font-semibold">Keep this page open</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2">
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">Interview Details</p>
                <div className="flex justify-between text-[13px]"><span className="text-gray-500">Questions</span><span className="font-bold">10 MCQ</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-gray-500">Time per question</span><span className="font-bold">45s</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-gray-500">Total time</span><span className="font-bold">7m 30s</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-gray-500">Pass score</span><span className="font-bold">6/10</span></div>
              </div>
            </div>
          )}

          {/* QUIZ - All questions on one page */}
          {phase === "quiz" && (
            <div className="p-4 space-y-5 pb-6">
              {questions.map((q, qi) => (
                <div key={qi} className={`rounded-2xl border-2 overflow-hidden transition-all ${answers[qi] !== null ? "border-blue-300 bg-blue-50/30" : "border-gray-100 bg-white"}`}>
                  {/* Question header */}
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-start gap-3">
                      <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black ${answers[qi] !== null ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>{qi + 1}</span>
                      <p className="text-[15px] font-bold text-gray-900 leading-snug">{q.question}</p>
                    </div>
                  </div>
                  {/* Options */}
                  <div className="px-4 pb-4 space-y-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => { const updated = [...answers]; updated[qi] = oi; setAnswers(updated); }}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-start gap-3 ${answers[qi] === oi ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
                      >
                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black mt-0.5 ${answers[qi] === oi ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                          {["A","B","C","D"][oi]}
                        </span>
                        <span className={`text-[14px] font-semibold leading-snug ${answers[qi] === oi ? "text-blue-800" : "text-gray-700"}`}>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Submit */}
              <button
                onClick={() => handleSubmit(false)}
                className={`w-full py-4 font-black text-[16px] rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${answeredCount === 10 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200" : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"}`}
              >
                <CheckCircle2 className="w-5 h-5" />
                {answeredCount === 10 ? `Submit All Answers (${answeredCount}/10)` : `Submit (${answeredCount}/10 answered)`}
              </button>
            </div>
          )}

          {/* DONE */}
          {phase === "done" && (
            <div className="p-6 text-center space-y-5">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Answers Submitted!</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">Your interview answers have been submitted. You will receive your results via email at <strong>{email}</strong>.</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-[13px] text-blue-700 font-semibold">📧 Keep an eye on your inbox — your pass/fail result will be sent shortly by Pathway Agency.</div>
              <button onClick={onClose} className="w-full py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200">Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

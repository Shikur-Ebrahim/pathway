"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Clock, CheckCircle2, AlertCircle, Trophy, XCircle, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { getInterviewByEmail, submitInterviewAnswers, InterviewSession, DEFAULT_QUESTIONS } from "@/lib/db";

const QUESTION_TIME = 45;
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

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [qTimer, setQTimer] = useState(QUESTION_TIME);
  const qTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);

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
      if (diff <= 0) { setPhase("quiz"); }
      else { setCountdown(diff); setPhase("waiting"); }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Waiting countdown
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

  // Per-question timer
  useEffect(() => {
    if (phase !== "quiz") return;
    clearInterval(qTimerRef.current!);
    setQTimer(QUESTION_TIME);
    qTimerRef.current = setInterval(() => {
      setQTimer(prev => {
        if (prev <= 1) {
          clearInterval(qTimerRef.current!);
          advanceQuestion(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(qTimerRef.current!);
  }, [phase, qIndex]);

  // TTS: read current question only
  useEffect(() => {
    if (phase !== "quiz" || !ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    const questions = session?.questions || DEFAULT_QUESTIONS;
    const q = questions[qIndex];
    if (!q) return;
    window.speechSynthesis.cancel();
    let text = `Question ${qIndex + 1}. ${q.question}. Option A: ${q.options[0]}. Option B: ${q.options[1]}. Option C: ${q.options[2]}. Option D: ${q.options[3]}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    return () => { window.speechSynthesis.cancel(); };
  }, [phase, qIndex, ttsEnabled]);

  const toggleTts = () => {
    setTtsEnabled(prev => {
      if (prev && typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  const advanceQuestion = (ans: number) => {
    clearInterval(qTimerRef.current!);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    const newAnswers = [...answers, ans];
    const questions = session?.questions || DEFAULT_QUESTIONS;
    if (qIndex + 1 >= questions.length) {
      const score = newAnswers.reduce((acc, a, i) => a === questions[i].correctIndex ? acc + 1 : acc, 0);
      const passed = score >= PASS_SCORE;
      if (session?.id) submitInterviewAnswers(session.id, newAnswers, score, passed);
      setAnswers(newAnswers);
      setPhase("done");
    } else {
      setAnswers(newAnswers);
      setQIndex(i => i + 1);
      setSelected(null);
    }
  };

  const fmtCountdown = (s: number) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (d > 0) return `${d}d ${h}h ${m}m ${sec}s`;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const questions = session?.questions || DEFAULT_QUESTIONS;
  const currentQ = questions[qIndex];
  const timerPct = (qTimer / QUESTION_TIME) * 100;
  const timerColor = qTimer > 25 ? "#22c55e" : qTimer > 12 ? "#f59e0b" : "#ef4444";

  return (
    <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[16px] font-black text-gray-900">Online Interview</p>
              {phase === "quiz" && <p className="text-[12px] text-gray-400 font-semibold">Question {qIndex + 1} of {questions.length}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {phase === "quiz" && (
              <button onClick={toggleTts} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                {ttsEnabled ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
              </button>
            )}
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* EMAIL */}
          {phase === "email" && (
            <div className="p-6 space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Enter Your Email</h2>
                <p className="text-[15px] text-gray-500 leading-relaxed">Enter the email you used to apply. Your interview will appear here.</p>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[14px]">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLookup()} placeholder="your@email.com" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[16px] font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              <button onClick={handleLookup} disabled={loading || !email.trim()} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[17px] rounded-2xl shadow-lg transition-all disabled:opacity-50">
                {loading ? "Checking..." : "Check My Interview →"}
              </button>
            </div>
          )}

          {/* NOT FOUND */}
          {phase === "not_found" && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto"><AlertCircle className="w-8 h-8 text-gray-400" /></div>
              <h2 className="text-xl font-black text-gray-900">No Interview Found</h2>
              <p className="text-[15px] text-gray-500">No interview scheduled for <strong>{email}</strong>. Please check your email or contact Pathway Agency.</p>
              <button onClick={() => { setPhase("email"); setError(null); }} className="w-full py-4 bg-gray-100 text-gray-700 font-bold text-[16px] rounded-2xl hover:bg-gray-200">← Try Again</button>
            </div>
          )}

          {/* EXPIRED */}
          {phase === "expired" && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto"><XCircle className="w-8 h-8 text-red-500" /></div>
              <h2 className="text-xl font-black text-gray-900">Interview Missed</h2>
              <p className="text-[15px] text-gray-500">The scheduled time has passed. Please contact Pathway Agency to reschedule.</p>
              <button onClick={onClose} className="w-full py-4 bg-gray-100 text-gray-700 font-bold text-[16px] rounded-2xl hover:bg-gray-200">Close</button>
            </div>
          )}

          {/* ALREADY DONE */}
          {phase === "already_done" && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-green-500" /></div>
              <h2 className="text-xl font-black text-gray-900">Already Completed</h2>
              <p className="text-[15px] text-gray-500">You have already completed your interview. Results will be sent to <strong>{email}</strong>.</p>
            </div>
          )}

          {/* WAITING */}
          {phase === "waiting" && session && (
            <div className="p-6 text-center space-y-5">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto"><Clock className="w-8 h-8 text-indigo-600" /></div>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">Get Ready!</h2>
                <p className="text-[15px] text-gray-500">Your interview starts in</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
                <p className="text-4xl font-black font-mono">{fmtCountdown(countdown)}</p>
                <p className="text-blue-200 text-[14px] mt-2 font-semibold">Keep this page open</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2">
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">Interview Details</p>
                <div className="flex justify-between text-[15px]"><span className="text-gray-500">Questions</span><span className="font-bold">10 MCQ</span></div>
                <div className="flex justify-between text-[15px]"><span className="text-gray-500">Time per question</span><span className="font-bold">45s</span></div>
                <div className="flex justify-between text-[15px]"><span className="text-gray-500">Pass score</span><span className="font-bold">6 / 10</span></div>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {phase === "quiz" && currentQ && (
            <div className="p-4 space-y-5 pb-6">
              {/* Progress + Timer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-bold text-gray-500">Question {qIndex + 1} of {questions.length}</span>
                  <span className="text-[22px] font-black font-mono" style={{ color: timerColor }}>{qTimer}s</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${timerPct}%`, background: timerColor }} />
                </div>
                {/* Step dots */}
                <div className="flex gap-1 justify-center pt-1">
                  {questions.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i < qIndex ? "bg-blue-500 w-4" : i === qIndex ? "bg-indigo-600 w-6" : "bg-gray-200 w-2"}`} />
                  ))}
                </div>
              </div>

              {/* Question */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5">
                <p className="text-[18px] font-bold text-gray-900 leading-relaxed">{currentQ.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${selected === i ? "border-blue-500 bg-blue-600" : "border-gray-100 bg-gray-50 hover:border-gray-300"}`}
                  >
                    <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-black ${selected === i ? "bg-white text-blue-600" : "bg-gray-200 text-gray-600"}`}>
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <span className={`text-[16px] font-semibold leading-snug flex-1 ${selected === i ? "text-white" : "text-gray-800"}`}>{opt}</span>
                    {selected === i && <CheckCircle2 className="shrink-0 w-6 h-6 text-white" />}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => advanceQuestion(selected ?? -1)}
                disabled={selected === null}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[18px] rounded-2xl shadow-lg transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {qIndex + 1 === questions.length ? "Submit Answers ✓" : "Next Question"}
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* DONE */}
          {phase === "done" && (
            <div className="p-6 text-center space-y-5">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Answers Submitted!</h2>
                <p className="text-[15px] text-gray-500 leading-relaxed">Your answers have been submitted. Results will be sent to <strong>{email}</strong>.</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-[15px] text-blue-700 font-semibold">📧 Keep an eye on your inbox — your pass/fail result will be sent shortly.</div>
              <button onClick={onClose} className="w-full py-4 bg-gray-100 text-gray-700 font-bold text-[16px] rounded-2xl hover:bg-gray-200">Close</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

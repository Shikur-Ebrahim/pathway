"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Clock, CheckCircle2, AlertCircle, ChevronRight, Trophy, XCircle } from "lucide-react";
import { getInterviewByEmail, submitInterviewAnswers, InterviewSession, DEFAULT_QUESTIONS } from "@/lib/db";




const QUESTION_TIME = 60; // seconds per question
const PASS_SCORE = 6; // out of 10

type Phase = 'email' | 'waiting' | 'quiz' | 'done' | 'already_done' | 'not_found';

export default function InterviewPortal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('email');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown to start
  const [countdown, setCountdown] = useState<number>(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz state
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [qTimer, setQTimer] = useState(QUESTION_TIME);
  const qTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLookup = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const found = await getInterviewByEmail(email.trim());
      if (!found) { setPhase('not_found'); return; }
      if (found.status === 'completed') { setPhase('already_done'); return; }
      setSession(found);
      const now = Date.now();
      const start = new Date(found.scheduledAt).getTime();
      const diff = Math.floor((start - now) / 1000);
      if (diff <= 0) {
        setPhase('quiz');
        startQuestion();
      } else {
        setCountdown(diff);
        setPhase('waiting');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (phase !== 'waiting') return;
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setPhase('quiz');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current!);
  }, [phase]);

  const startQuestion = () => {
    setQTimer(QUESTION_TIME);
    setSelected(null);
  };

  // Per-question timer
  useEffect(() => {
    if (phase !== 'quiz') return;
    clearInterval(qTimerRef.current!);
    qTimerRef.current = setInterval(() => {
      setQTimer(prev => {
        if (prev <= 1) {
          clearInterval(qTimerRef.current!);
          advanceQuestion(-1); // -1 = timed out / skipped
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(qTimerRef.current!);
  }, [phase, qIndex]);

  const advanceQuestion = (ans: number) => {
    clearInterval(qTimerRef.current!);
    const newAnswers = [...answers, ans];
    const questions = session?.questions || DEFAULT_QUESTIONS;
    if (qIndex + 1 >= questions.length) {
      // Done — calculate score and submit
      const score = newAnswers.reduce((acc, a, i) => {
        return a === questions[i].correctIndex ? acc + 1 : acc;
      }, 0);
      const passed = score >= PASS_SCORE;
      if (session?.id) {
        submitInterviewAnswers(session.id, newAnswers, score, passed);
      }
      setAnswers(newAnswers);
      setPhase('done');
    } else {
      setAnswers(newAnswers);
      setQIndex(i => i + 1);
      setSelected(null);
      setQTimer(QUESTION_TIME);
    }
  };

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const questions = session?.questions || DEFAULT_QUESTIONS;
  const currentQ = questions[qIndex];
  const timerPct = (qTimer / QUESTION_TIME) * 100;
  const timerColor = qTimer > 20 ? '#22c55e' : qTimer > 10 ? '#f59e0b' : '#ef4444';

  return (
    <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-black text-gray-900">Online Interview</p>
              {phase === 'quiz' && <p className="text-[11px] text-gray-400 font-semibold">Question {qIndex + 1} of {questions.length}</p>}
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* EMAIL ENTRY */}
          {phase === 'email' && (
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
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLookup()}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleLookup}
                disabled={loading || !email.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[15px] rounded-2xl shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check My Interview →'}
              </button>
            </div>
          )}

          {/* NOT FOUND */}
          {phase === 'not_found' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-lg font-black text-gray-900">No Interview Found</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">No interview has been scheduled for <strong>{email}</strong>. Please double-check your email or contact Pathway Agency.</p>
              <button onClick={() => { setPhase('email'); setError(null); }} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200">
                ← Try Again
              </button>
            </div>
          )}

          {/* ALREADY DONE */}
          {phase === 'already_done' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-black text-gray-900">Already Completed</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">You have already completed your interview. Your results will be sent to <strong>{email}</strong> by email.</p>
            </div>
          )}

          {/* WAITING / COUNTDOWN */}
          {phase === 'waiting' && session && (
            <div className="p-6 text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-1">Get Ready!</h2>
                <p className="text-[14px] text-gray-500">Your interview starts in</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
                <p className="text-5xl font-black tracking-tight font-mono">{fmtTime(countdown)}</p>
                <p className="text-blue-200 text-[13px] mt-2 font-semibold">Keep this page open</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2">
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-3">Interview Details</p>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Questions</span>
                  <span className="font-bold text-gray-800">{questions.length} MCQ</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Time per question</span>
                  <span className="font-bold text-gray-800">{QUESTION_TIME}s</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Pass score</span>
                  <span className="font-bold text-gray-800">{PASS_SCORE}/{questions.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {phase === 'quiz' && currentQ && (
            <div className="p-5 space-y-5">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[12px] font-bold">
                  <span className="text-gray-500">Question {qIndex + 1} of {questions.length}</span>
                  <span style={{ color: timerColor }} className="font-black">{qTimer}s</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${timerPct}%`, background: timerColor }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5">
                <p className="text-[16px] font-bold text-gray-900 leading-relaxed">{currentQ.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-semibold text-[14px] ${
                      selected === i
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`inline-flex w-6 h-6 rounded-full mr-3 items-center justify-center text-[11px] font-black shrink-0 ${
                      selected === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>{['A','B','C','D'][i]}</span>
                    {opt}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => advanceQuestion(selected ?? -1)}
                disabled={selected === null}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[15px] rounded-2xl shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {qIndex + 1 === questions.length ? 'Submit Answers' : 'Next Question'} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* DONE */}
          {phase === 'done' && (
            <div className="p-6 text-center space-y-5">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Answers Submitted!</h2>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  Your interview answers have been submitted successfully. You will receive your results via email at <strong>{email}</strong>.
                </p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-[13px] text-blue-700 font-semibold">
                📧 Keep an eye on your inbox — your pass/fail result will be sent shortly by Pathway Agency.
              </div>
              <button onClick={onClose} className="w-full py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200">
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

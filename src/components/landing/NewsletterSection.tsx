"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, Loader2, Mail } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "exists">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      // Check if email already subscribed
      const q = query(collection(db, "newsletter_subscribers"), where("email", "==", email.toLowerCase().trim()));
      const existing = await getDocs(q);

      if (!existing.empty) {
        setStatus("exists");
        return;
      }

      // Save to Firestore
      await addDoc(collection(db, "newsletter_subscribers"), {
        email: email.toLowerCase().trim(),
        subscribedAt: serverTimestamp(),
      });

      // Send welcome email
      await fetch("/api/send-newsletter-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: email.toLowerCase().trim() }),
      });

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="w-full py-12 px-5 bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-center relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-4"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-black text-white">You're Subscribed! 🎉</h2>
                <p className="text-gray-300 text-sm">A welcome email has been sent to your inbox. Stay tuned for the latest job alerts!</p>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight mb-3">
                  Get Job Alerts
                </h2>
                <p className="text-sm text-gray-300 mb-6">Subscribe to receive the latest premium job postings directly in your inbox.</p>

                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                      placeholder="Enter your email address"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  {/* Status messages */}
                  {status === "error" && (
                    <p className="text-red-400 text-xs text-left pl-2">{errorMsg}</p>
                  )}
                  {status === "exists" && (
                    <p className="text-yellow-400 text-xs text-left pl-2">This email is already subscribed! ✅</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold text-sm rounded-2xl px-5 py-4 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

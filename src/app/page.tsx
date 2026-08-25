"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ApplicationModal } from "@/components/ApplicationModal";
import { AuthModal } from "@/components/AuthModal";
import { Language } from "@/lib/translations";
import { useAuth } from "@/context/AuthContext";

// New Landing Page Components
import { HeroSection } from "@/components/landing/HeroSection";
import { ImageBannerSection } from "@/components/landing/ImageBannerSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LatestJobsSection } from "@/components/landing/LatestJobsSection";
import { ResourcesSection } from "@/components/landing/ResourcesSection";
import { ProcessTimelineSection } from "@/components/landing/ProcessTimelineSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { TrustedCompaniesSection } from "@/components/landing/TrustedCompaniesSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { Footer } from "@/components/landing/Footer";
import { InstallBanner } from "@/components/InstallBanner";
import { StatusTrackerModal } from "@/components/StatusTrackerModal";
import InterviewPortal from "@/components/InterviewPortal";

export default function Home() {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("pathway_lang") as Language;
    if (saved) setLangState(saved);
  }, []);

  // ── Scroll Save / Restore ──────────────────────────────────────────
  // On mount: if we stored a scroll position before navigating away, restore it
  useEffect(() => {
    const savedY = sessionStorage.getItem("pathway_scroll");
    if (savedY) {
      const y = parseInt(savedY, 10);
      // Small delay so the page has fully rendered before scrolling
      setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 80);
      sessionStorage.removeItem("pathway_scroll");
    }
  }, []);

  // On scroll: continuously save position so router.back() can restore it
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem("pathway_scroll", String(window.scrollY));
    };
    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => window.removeEventListener("scroll", saveScroll);
  }, []);
  // ──────────────────────────────────────────────────────────────────

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("pathway_lang", newLang);
  };

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const { user } = useAuth();

  const handleApplyClick = () => {
    if (user) setIsAppModalOpen(true);
    else setIsAuthOpen(true);
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setShowAllJobs(true);
    setTimeout(() => {
      document.getElementById("latest-jobs")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBrowseJobs = () => {
    setShowAllJobs(true);
    setActiveCategory(null);
    setTimeout(() => {
      document.getElementById("latest-jobs")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAuthSuccess = () => setIsAppModalOpen(true);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      <Navbar lang={lang} setLang={setLang} onApplyClick={handleApplyClick} onCheckStatus={() => setIsStatusOpen(true)} onOnlineInterview={() => setIsInterviewOpen(true)} />

      <main className="flex-1 w-full flex flex-col overflow-x-hidden">
        <HeroSection onApplyClick={handleApplyClick} onBrowseJobs={handleBrowseJobs} lang={lang} />
        <ImageBannerSection lang={lang} />
        <CategoriesSection onSelectCategory={handleCategorySelect} lang={lang} />
        <GallerySection lang={lang} />
        <TrustedCompaniesSection lang={lang} />
        <LatestJobsSection 
          onApplyClick={handleApplyClick} 
          filterCategory={activeCategory} 
          onClearFilter={() => setActiveCategory(null)}
          showAll={showAllJobs}
          onToggleShowAll={() => setShowAllJobs(prev => !prev)}
          lang={lang}
        />
        <ResourcesSection lang={lang} />
        <ProcessTimelineSection lang={lang} />
        <FeaturesSection lang={lang} />
        <FAQSection lang={lang} />
        <NewsletterSection lang={lang} />
      </main>

      <Footer lang={lang} />

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
        lang={lang} 
        defaultMode="signup" 
      />
      
      <ApplicationModal 
        isOpen={isAppModalOpen} 
        onClose={() => setIsAppModalOpen(false)} 
        lang={lang} 
      />

      {/* PWA Install Banner */}
      <InstallBanner />

      <StatusTrackerModal isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} lang={lang} />

      {isInterviewOpen && <InterviewPortal onClose={() => setIsInterviewOpen(false)} />}
    </div>
  );
}

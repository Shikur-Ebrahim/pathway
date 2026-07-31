"use client";

import React, { useState } from "react";
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

export default function Home() {
  const [lang, setLang] = useState<Language>("am");
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
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
      <Navbar lang={lang} setLang={setLang} onApplyClick={handleApplyClick} />

      <main className="flex-1 w-full flex flex-col overflow-x-hidden">
        {/* We pass handleApplyClick to sections that need to trigger the modal */}
        <HeroSection onApplyClick={handleApplyClick} onBrowseJobs={handleBrowseJobs} />
        <ImageBannerSection />
        <CategoriesSection onSelectCategory={handleCategorySelect} />
        <GallerySection />
        <TrustedCompaniesSection />
        <LatestJobsSection 
          onApplyClick={handleApplyClick} 
          filterCategory={activeCategory} 
          onClearFilter={() => setActiveCategory(null)}
          showAll={showAllJobs}
          onToggleShowAll={() => setShowAllJobs(prev => !prev)}
        />
        <ResourcesSection />
        <ProcessTimelineSection />
        <FeaturesSection />
        <FAQSection />
        <NewsletterSection />
      </main>

      <Footer />

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
    </div>
  );
}

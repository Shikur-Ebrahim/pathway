"use client";

import React from "react";
import { content, Language } from "@/lib/translations";

export const Footer = ({ lang }: { lang: Language }) => {
  const t = content[lang];
  return (
    <footer className="w-full max-w-full md:max-w-5xl lg:max-w-7xl mx-auto bg-gray-50 pt-16 pb-8 px-8 rounded-t-[40px] border-t border-gray-100">
      <div className="mb-10">
        <h3 className="text-[20px] font-black text-gray-900 tracking-tight mb-2">Pathway</h3>
        <p className="text-[13px] text-gray-500 max-w-[250px]">{t.footerTagline}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h4 className="text-[14px] font-bold text-gray-900 mb-4">{t.footerQuickLinks}</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">{t.footerHome}</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">{t.footerJobs}</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">{t.footerRequirements}</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">{t.footerApply}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-gray-900 mb-4">{t.footerLegal}</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">{t.footerPrivacy}</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">{t.footerTerms}</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">{t.footerContact}</a></li>
          </ul>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200 mb-6" />

      <div className="flex flex-col items-center gap-2">
        <p className="text-[12px] text-gray-400">© 2026 Pathway Recruitment.</p>
        <p className="text-[12px] text-gray-400">{t.footerRights}</p>
      </div>
    </footer>
  );
};

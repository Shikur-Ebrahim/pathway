"use client";

import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full max-w-[430px] mx-auto bg-gray-50 pt-16 pb-8 px-8 rounded-t-[40px] border-t border-gray-100">
      <div className="mb-10">
        <h3 className="text-[20px] font-black text-gray-900 tracking-tight mb-2">Pathway</h3>
        <p className="text-[13px] text-gray-500 max-w-[250px]">
          The most trusted recruitment platform connecting Ethiopian professionals with global opportunities.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h4 className="text-[14px] font-bold text-gray-900 mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">Find Jobs</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">For Employers</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">Career Advice</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-gray-900 mb-4">Legal</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-[13px] text-gray-500 hover:text-blue-600 transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200 mb-6" />

      <div className="flex flex-col items-center gap-2">
        <p className="text-[12px] text-gray-400">© 2026 Pathway Recruitment.</p>
        <p className="text-[12px] text-gray-400">All rights reserved.</p>
      </div>
    </footer>
  );
};

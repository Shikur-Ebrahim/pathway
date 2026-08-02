"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed (running in standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Don't show if dismissed recently
    const dismissed = sessionStorage.getItem("pwa_banner_dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa_banner_dismissed", "1");
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "12px 16px",
        background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        animation: "slideUp 0.35s ease",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* App Icon */}
      <img
        src="/icons/icon-72x72.png"
        alt="Pathway"
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          border: "2px solid rgba(255,255,255,0.3)",
          flexShrink: 0,
          objectFit: "cover",
        }}
      />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, color: "#fff", fontWeight: 800, fontSize: 14, lineHeight: 1.3 }}>
          Install Pathway App
        </p>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>
          Add to home screen for fast access
        </p>
      </div>

      {/* Install Button */}
      <button
        onClick={handleInstall}
        disabled={installing}
        style={{
          background: "#fff",
          color: "#1d4ed8",
          border: "none",
          borderRadius: 10,
          padding: "8px 16px",
          fontWeight: 800,
          fontSize: 13,
          cursor: "pointer",
          flexShrink: 0,
          opacity: installing ? 0.7 : 1,
        }}
      >
        {installing ? "..." : "Install"}
      </button>

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          fontSize: 20,
          cursor: "pointer",
          padding: "4px 2px",
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

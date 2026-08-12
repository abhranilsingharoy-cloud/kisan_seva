"use client";

import { useEffect } from "react";
import Script from "next/script";

// Extend the Window interface to include Google Translate API
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslateWidget({ className = "" }: { className?: string }) {
  useEffect(() => {
    // Define the global callback function required by Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,bn,te,ta,mr,gu,kn,ml,pa,or,es,fr,ar", // Major Indian languages + English/Spanish/French/Arabic
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  return (
    <>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div 
        id="google_translate_element" 
        className={`inline-block overflow-hidden transition-opacity ${className}`}
        style={{ minHeight: '38px', minWidth: '130px' }}
      ></div>
    </>
  );
}

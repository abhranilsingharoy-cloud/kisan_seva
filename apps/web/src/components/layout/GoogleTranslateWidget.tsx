"use client";

import React, { useEffect } from "react";
import Script from "next/script";

// Extend the Window interface to include Google Translate API
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const GoogleTranslateWidget = ({ className = "" }: { className?: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 1. Setup the callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,bn,te,ta,mr,gu,kn,ml,pa,or,es,fr,ar",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // 2. Dynamically create the div so React never reconciles its children
    if (containerRef.current) {
      // Clear previous instances if any
      containerRef.current.innerHTML = '';
      
      const targetDiv = document.createElement('div');
      targetDiv.id = 'google_translate_element';
      containerRef.current.appendChild(targetDiv);

      // 3. If script is already loaded (client navigation), trigger init
      if (window.google?.translate?.TranslateElement) {
        window.googleTranslateElementInit();
      }
    }
  }, []);

  return (
    <>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
      <div 
        ref={containerRef}
        className={`inline-block overflow-hidden transition-opacity ${className}`}
        style={{ minHeight: '38px', minWidth: '130px' }}
      ></div>
    </>
  );
};

export default GoogleTranslateWidget;


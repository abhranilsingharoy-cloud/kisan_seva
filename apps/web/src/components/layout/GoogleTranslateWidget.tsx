"use client";

import React, { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const GoogleTranslateWidget = ({ className = "" }: { className?: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // We want to avoid Google Translate failing to render on React route changes.
    // So we use a globally persistent div.
    
    let globalDiv = document.getElementById('google_translate_element');
    
    if (!globalDiv) {
      // First time mounting anywhere in the app
      globalDiv = document.createElement('div');
      globalDiv.id = 'google_translate_element';
      
      // We set the callback for the script
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
    }

    // Move the global div into our React container
    if (containerRef.current && globalDiv) {
      containerRef.current.appendChild(globalDiv);
    }
    
    // If the script is already loaded, we might need to force a re-init if it's empty
    if (window.google?.translate?.TranslateElement && globalDiv.innerHTML.trim() === '') {
        try {
            window.googleTranslateElementInit();
        } catch (e) {
            console.error(e);
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

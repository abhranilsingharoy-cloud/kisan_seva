import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | KisanSeva",
  description: "Terms and conditions for using the KisanSeva platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-[#2A854B] hover:text-[#1e6136] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#e7f4ec] text-[#2A854B] rounded-2xl">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Terms of Service</h1>
        </div>

        <div className="prose prose-slate prose-a:text-[#2A854B] max-w-none text-slate-600 leading-relaxed">
          <p><strong>Last Updated:</strong> August 2026</p>
          
          <p>
            Please read these Terms of Service ("Terms") carefully before using the KisanSeva website and mobile application (the "Service") operated by KisanSeva Solutions.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Use of Service</h2>
          <p>
            The Service is intended to provide agricultural advisory, market prices, and AI-powered disease detection. You agree to use the Service only for lawful purposes and in accordance with these Terms.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Accuracy of Information</h2>
          <p>
            While we strive for accuracy, the agricultural advice and disease detections provided by our AI models are for informational purposes only. We do not guarantee 100% accuracy. Farmers should verify critical decisions with local agricultural experts or Krishi Vigyan Kendras (KVKs).
          </p>
          <p>
            Market prices are sourced from AGMARKNET. We are not responsible for discrepancies between the displayed prices and the actual prices at physical mandis.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of KisanSeva Solutions and its licensors. The Service is protected by copyright, trademark, and other laws of India.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>
        </div>
      </div>
    </div>
  );
}


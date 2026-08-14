import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | KisanSeva",
  description: "Privacy policy and data handling practices for KisanSeva.",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
        </div>

        <div className="prose prose-slate prose-a:text-[#2A854B] max-w-none text-slate-600 leading-relaxed">
          <p><strong>Last Updated:</strong> August 2026</p>
          
          <p>
            At KisanSeva, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect includes:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Personal Data:</strong> Demographics, phone number, and location data if you choose to provide it for accurate weather and market pricing.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the app, such as your IP address, browser type, and access times.</li>
            <li><strong>Farm Data:</strong> Crop types, field size, and images uploaded for disease detection. These are processed securely and used solely to provide agricultural advice.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the application to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Generate personalized irrigation and fertilization schedules.</li>
            <li>Detect crop diseases using our AI engine.</li>
            <li>Provide localized Mandi prices and weather forecasts.</li>
            <li>Improve application performance and train our agricultural AI models (anonymized data only).</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Third-Party Data Sharing</h2>
          <p>
            We <strong>never</strong> sell your personal data or farming records to third parties. We only share anonymized queries with our AI partners (e.g., Google Cloud) for the sole purpose of generating disease diagnostics and AI chatbot responses.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@kisanseva.in">privacy@kisanseva.in</a>
          </p>
        </div>
      </div>
    </div>
  );
}


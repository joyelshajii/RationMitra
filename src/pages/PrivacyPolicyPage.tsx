import React from 'react';
import { usePds } from '../context/PdsContext';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const PrivacyPolicyPage: React.FC = () => {
  const { language, setActiveView } = usePds();
  const isMl = language === 'ml';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => setActiveView('HOME')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isMl ? 'പോർട്ടലിലേക്ക് മടങ്ങുക' : 'Return to Portal Home'}</span>
      </button>

      <div className="bg-white border border-slate-300 p-8 sm:p-10 shadow-xs space-y-6 text-slate-800 text-xs leading-relaxed" style={{ borderRadius: '6px' }}>
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <h1 className="text-xl font-bold text-slate-900">
              {isMl ? 'സ്വകാര്യതാ നയം (Privacy Policy)' : 'Citizen Privacy Policy & Data Governance'}
            </h1>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">
            Last Updated: September 2026 • Governed under the Digital Personal Data Protection Act (DPDPA), 2023
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Civic Technology Commitment</h2>
          <p>
            RationMitra Kerala is dedicated to protecting the confidentiality, integrity, and privacy of cardholders, dealers, and citizens using the Public Distribution System (PDS) stock visibility portal. We operate under strict principles of data minimization: we only collect information strictly required to inform you of food grain availability.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>
              <strong>Stock Alert Mobile Numbers:</strong> When you subscribe to SMS or WhatsApp alerts for commodity arrivals, your phone number is encrypted and stored solely to transmit delivery notifications. It is never sold, shared, or used for commercial marketing.
            </li>
            <li>
              <strong>Crowdsourced Verification Slips:</strong> Transaction receipt numbers submitted during citizen reporting are matched only for verification weight algorithms and are decoupled from personal cardholder Aadhaar identifiers.
            </li>
            <li>
              <strong>Locational Coordinates:</strong> Dealership distances are calculated client-side in your browser. We do not track or persist user GPS movements.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Purpose of Processing</h2>
          <p>
            Your information is processed exclusively for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Dispatching timely arrival notifications when subsidized food grain shipments reach your mapped ARD.</li>
            <li>Maintaining mathematical integrity and preventing malicious disinformation in the public stock ledger.</li>
            <li>Enabling Taluk Supply Officers to review counter shortages and ePOS network latency.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. Retention and Erasure</h2>
          <p>
            Cardholders may deactivate alert subscriptions at any time through the notification center. Upon deactivation, contact records are purged from the alert dispatch queue.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">5. Grievance Redressal</h2>
          <p>
            For privacy inquiries or data rights requests, contact the Public Data Protection Officer, Department of Food &amp; Civil Supplies, Mini Civil Station, Kanjirappally, Kottayam District, Kerala. Toll-Free: 1967.
          </p>
        </section>
      </div>
    </div>
  );
};

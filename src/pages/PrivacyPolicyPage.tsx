import React from 'react';
import { usePds } from '../context/PdsContext';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { language, setActiveView } = usePds();
  const isMl = language === 'ml';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => setActiveView('HOME')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isMl ? 'പോർട്ടലിലേക്ക് മടങ്ങുക' : 'Return to Portal Home'}</span>
      </button>

      <div className="bg-white border border-slate-200 p-8 sm:p-12 shadow-2xs space-y-6 text-slate-800 text-xs leading-relaxed" style={{ borderRadius: '6px' }}>
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <span className="text-xs font-mono font-bold tracking-wide uppercase text-blue-700">
              CIVIC DATA GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isMl ? 'സ്വകാര്യതാ നയം (Privacy Policy)' : 'Citizen Privacy Policy & Data Protection Framework'}
          </h1>
          <p className="text-slate-400 font-mono text-[11px] mt-1">
            Last Updated: September 2026 • Governed under the Digital Personal Data Protection Act (DPDPA), 2023
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Civic Technology Commitment</h2>
          <p className="text-slate-600">
            RationMitra Kerala is built upon strict principles of citizen data minimization. We only collect and process data strictly required to inform cardholders of food grain arrival at their mapped Authorised Ration Dealership (ARD).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Information Collection and Processing</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Stock Alert Contact Details:</strong> Mobile numbers entered when registering for commodity arrival alerts are stored solely to transmit automated notifications. Numbers are never shared with third parties or used for commercial marketing.
            </li>
            <li>
              <strong>ePOS Transaction Corroboration:</strong> Paper bill transaction slip numbers submitted during community reporting are used only to evaluate verification weight and are completely decoupled from individual Aadhaar numbers.
            </li>
            <li>
              <strong>Browser Geolocation:</strong> Dealership distances are calculated strictly client-side within your browser. User GPS coordinates are never stored or tracked.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Purpose Limitation</h2>
          <p className="text-slate-600">
            Data collected is processed exclusively for food grain availability verification, preventing hoarding or disinformation, and enabling Taluk Supply Officers to address counter shortages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. Retention and Erasure</h2>
          <p className="text-slate-600">
            Cardholders can purge their alert subscriptions at any time through the notification center. Upon deactivation, contact records are erased from active broadcast queues.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">5. Contact and Grievances</h2>
          <p className="text-slate-600">
            For data protection inquiries, contact the Public Grievance Officer, Department of Food &amp; Civil Supplies, Mini Civil Station, Kanjirappally, Kottayam, Kerala. Helpline: 1967.
          </p>
        </section>
      </div>
    </div>
  );
};

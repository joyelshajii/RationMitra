import React from 'react';
import { usePds } from '../context/PdsContext';
import { FileText, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
            <FileText className="w-5 h-5 text-blue-700" />
            <span className="text-xs font-mono font-bold tracking-wide uppercase text-blue-700">
              LEGAL TERMS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isMl ? 'ഉപയോഗ നിബന്ധനകൾ (Terms of Service)' : 'Terms of Service & PDS Guidelines'}
          </h1>
          <p className="text-slate-400 font-mono text-[11px] mt-1">
            Conforming to National Food Security Act (NFSA), 2013 &amp; Kerala Targeted Public Distribution System Control Order
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Nature of Service</h2>
          <p className="text-slate-600">
            RationMitra is a community-assisted civic visibility portal engineered to reduce wasted travel and improve transparency in the distribution of subsidized essential commodities (Rice, Wheat, Atta, Sugar, and Kerosene). Stock balances are aggregated via official dealer logs, Supplyco Delivery Challans, and citizen crowdsourced reports.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Code of Conduct for Cardholders &amp; Citizens</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Users agree to provide truthful observations when reporting stock exhaustion or availability.</li>
            <li>Deliberate falsification of inventory levels or automated spam reports may result in IP and phone number throttling under state cyber safety guidelines.</li>
            <li>Receipt verification slips should correspond to genuine ePOS biometric transactions issued during the active calendar month.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Authorised Ration Dealer (ARD) Obligations</h2>
          <p className="text-slate-600">
            Licensees logging inventory entries must record authentic Delivery Challan (DC) reference numbers issued by Food Corporation of India (FCI) or Supplyco godowns. Dealerships must observe state mandated distribution timings (08:30–12:30 and 15:30–19:00) and ensure ePOS connectivity logs are accurate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. Dispute Resolution &amp; Escalation</h2>
          <p className="text-slate-600">
            In the event that 2 or more cardholders dispute reported dealer balances, the system flags the inventory item as "Disputed - Escrow Review" and alerts the Taluk Supply Office. Official inspections take precedence over automated algorithmic scores.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">5. Contact Information</h2>
          <p className="text-slate-600">
            Kerala Civil Supplies Consumer Redressal Helpline: 1967. Official State Portal: civilsupplieskerala.gov.in.
          </p>
        </section>
      </div>
    </div>
  );
};

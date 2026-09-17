import React from 'react';
import { usePds } from '../context/PdsContext';
import { Shield, Phone, MapPin, ExternalLink } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const Footer: React.FC = () => {
  const { language, setActiveView, resetToSeedData } = usePds();
  const t = (key: any) => getTranslation(language, key);
  const isMl = language === 'ml';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Portal Identification */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-900 text-amber-400 flex items-center justify-center border border-blue-700" style={{ borderRadius: '4px' }}>
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                {t('portalTitle')}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {isMl
                ? 'കേരളത്തിലെ റേഷൻ കടകളിലെ സ്റ്റോക്ക് വിവരങ്ങൾ സുതാര്യമായി പൊതുജനങ്ങളിലേക്ക് എത്തിക്കുന്ന പൗര സേവന പോർട്ടൽ.'
                : 'A civic technology platform providing cardholders real-time stock visibility and verifiable delivery receipts across Authorised Ration Dealers.'}
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-500 block">
                ANAVANDI 2026 Selection Submission
              </span>
              <span className="text-[11px] font-mono text-slate-500 block">
                Problem Statement: SC-09
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isMl ? 'പോർട്ടൽ ലിങ്കുകൾ' : 'Portal Navigation'}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('HOME')}
                  className="hover:text-white transition-colors"
                >
                  {t('navShops')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('REPORT')}
                  className="hover:text-white transition-colors"
                >
                  {t('navReport')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('DEALER')}
                  className="hover:text-white transition-colors"
                >
                  {t('navDealer')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('DECK')}
                  className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>{t('navDeck')}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Verification Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isMl ? 'നിയമപരവും സുതാര്യതയും' : 'Compliance & Governance'}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('PRIVACY')}
                  className="hover:text-white transition-colors"
                >
                  {t('navPrivacy')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('TERMS')}
                  className="hover:text-white transition-colors"
                >
                  {t('navTerms')}
                </button>
              </li>
              <li>
                <span className="text-slate-400">National Food Security Act (NFSA) 2013</span>
              </li>
              <li>
                <span className="text-slate-400">ePOS Tri-Factor Verification Protocol</span>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={resetToSeedData}
                  className="text-[11px] text-slate-500 hover:text-slate-300 underline"
                  title="Reset demo data to initial realistic seed"
                >
                  {isMl ? 'ഡെമോ ഡാറ്റ റീസെറ്റ് ചെയ്യുക' : 'Reset Demo Stock Data'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Helpline Contacts */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isMl ? 'ഹെൽപ്പ്‌ലൈൻ നമ്പറുകൾ' : 'PDS Public Helplines'}
            </h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white block">1967 (Toll Free)</span>
                  <span className="text-[11px] text-slate-500">Kerala Civil Supplies Consumer Grievance</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white block">1800-425-1550</span>
                  <span className="text-[11px] text-slate-500">State Consumer Helpline</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-[11px] text-slate-400">
                  Taluk Supply Office (TSO), Mini Civil Station, Kanjirappally
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>
            © 2026 RationMitra. Developed for ANAVANDI 2026 Hackathon (School of Future, Jain University Kochi).
          </p>
          <div className="flex items-center gap-4">
            <span>Domain: rationmitra.kerala.gov.in</span>
            <span>All citizen data handled with strict privacy safeguards.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

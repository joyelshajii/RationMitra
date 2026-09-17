import React from 'react';
import { usePds } from '../context/PdsContext';
import { Shield, Phone, MapPin, ExternalLink, RefreshCw } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const Footer: React.FC = () => {
  const { language, setActiveView, resetToSeedData } = usePds();
  const t = (key: any) => getTranslation(language, key);
  const isMl = language === 'ml';

  return (
    <footer className="bg-[#0C1E33] text-slate-300 border-t border-slate-800 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800/80">
          {/* Col 1: Portal Identification */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 bg-slate-800 text-amber-400 flex items-center justify-center border border-slate-700"
                style={{ borderRadius: '4px' }}
              >
                <Shield className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight block">
                  {t('portalTitle')}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Govt. of Kerala • Civil Supplies Portal
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {isMl
                ? 'കേരളത്തിലെ റേഷൻ കടകളിലെ സ്റ്റോക്ക് വിവരങ്ങൾ സുതാര്യമായി പൊതുജനങ്ങളിലേക്ക് എത്തിക്കുന്ന പൗര സേവന പോർട്ടൽ.'
                : 'A civic technology initiative providing cardholders live stock visibility, verified delivery challans, and instant arrival alerts across Authorised Ration Dealers.'}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="font-mono text-[11px] text-slate-400">
                PDS Grid: 6 ARDs Synchronized • Operational
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isMl ? 'നാവിഗേഷൻ' : 'Directory'}
            </h4>
            <ul className="space-y-2 text-slate-400">
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
                  className="hover:text-amber-400 text-amber-400/90 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>{t('navDeck')}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isMl ? 'നിയമവും സുതാര്യതയും' : 'Governance & Policies'}
            </h4>
            <ul className="space-y-2 text-slate-400">
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
              <li className="text-slate-400">
                National Food Security Act (NFSA) 2013
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={resetToSeedData}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 underline font-mono"
                  title="Reset demo data to initial realistic seed"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isMl ? 'ഡെമോ ഡാറ്റ പുനഃസ്ഥാപിക്കുക' : 'Reset Demo Stock Data'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Helplines */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isMl ? 'സഹായ നമ്പറുകൾ' : 'Public Grievance Contacts'}
            </h4>
            <div className="space-y-2.5 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-white font-semibold block">1967 (Toll-Free)</span>
                  <span className="text-[11px] text-slate-400">Kerala Civil Supplies Consumer Toll-Free</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-[11px] text-slate-400 leading-tight">
                  Taluk Supply Office (TSO), Mini Civil Station, Kanjirappally, Kottayam
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>
            © 2026 RationMitra Kerala • ANAVANDI 2026 Selection Submission (SC-09) • Amal Jyothi College of Engineering
          </p>
          <div className="flex items-center gap-3 font-mono">
            <span>Domain: rationmitra.kerala.gov.in</span>
            <span>•</span>
            <span>Zero Commercial Monetization</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

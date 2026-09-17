import React, { useEffect } from 'react';
import { usePds } from '../context/PdsContext';
import { X, ShieldCheck, FileText, UserCheck, AlertOctagon, Info } from 'lucide-react';
import { calculateTrustScore } from '../utils/trustCalculator';

export const AuditModal: React.FC = () => {
  const { auditModalItem, setAuditModalItem, language } = usePds();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAuditModalItem(null);
      }
    };
    if (auditModalItem) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [auditModalItem, setAuditModalItem]);

  if (!auditModalItem) return null;

  const { shop, item } = auditModalItem;
  const isMl = language === 'ml';

  const trustEval = calculateTrustScore(
    item.lastUpdated,
    Boolean(item.lastChallanNo),
    item.lastChallanDate,
    item.verifiedReportsCount,
    item.disputeCount
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
    >
      <div
        className="bg-white border border-slate-200 w-full max-w-2xl max-h-[88vh] overflow-y-auto shadow-2xl transition-transform"
        style={{ borderRadius: '6px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <h2 id="audit-modal-title" className="text-base font-bold text-slate-900">
                {isMl ? 'ഡാറ്റാ വിശ്വാസ്യത & പരിശോധനാ രേഖകൾ' : 'Verification Ledger & Credibility Breakdown'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              {shop.ardNumber} • {shop.nameEn} • {isMl ? item.nameMl : item.nameEn}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAuditModalItem(null)}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
            style={{ borderRadius: '4px' }}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Trust Score Summary Banner */}
          <div className="border border-slate-200 bg-slate-50/60 p-4" style={{ borderRadius: '4px' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isMl ? 'വിശ്വാസ്യത സ്കോർ' : 'Tri-Factor Confidence Rating'}
              </span>
              <span className="text-xl font-mono font-bold text-slate-900 tabular-nums">
                {trustEval.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </span>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-slate-200 h-2 mb-2.5 overflow-hidden" style={{ borderRadius: '2px' }}>
              <div
                className={`h-2 transition-all duration-300 ${
                  trustEval.score >= 75
                    ? 'bg-emerald-600'
                    : trustEval.score >= 45
                    ? 'bg-amber-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${trustEval.score}%`, borderRadius: '2px' }}
              />
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {isMl ? trustEval.explanationMl : trustEval.explanationEn}
            </p>
          </div>

          {/* Tri-Factor Component Scores */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              {isMl ? 'സ്കോർ നിർണ്ണയ ഘടകങ്ങൾ' : 'Scoring Model Factors'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-slate-200 p-3 bg-white" style={{ borderRadius: '4px' }}>
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold mb-1">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>{isMl ? 'സപ്ലൈകോ ചെല്ലാൻ' : 'Delivery Challan'}</span>
                </div>
                <div className="text-base font-mono font-bold text-slate-900 tabular-nums">
                  +{trustEval.breakdown.challanPoints} <span className="text-xs text-slate-400 font-normal">/ 40 pts</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {item.lastChallanNo ? `DC #${item.lastChallanNo}` : 'No recent DC logged'}
                </p>
              </div>

              <div className="border border-slate-200 p-3 bg-white" style={{ borderRadius: '4px' }}>
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold mb-1">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>{isMl ? 'ഉപഭോക്തൃ സ്ഥിരീകരണം' : 'PoS Receipts'}</span>
                </div>
                <div className="text-base font-mono font-bold text-slate-900 tabular-nums">
                  +{trustEval.breakdown.crowdPoints} <span className="text-xs text-slate-400 font-normal">/ 35 pts</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {item.verifiedReportsCount} citizen confirmations
                </p>
              </div>

              <div className="border border-slate-200 p-3 bg-white" style={{ borderRadius: '4px' }}>
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold mb-1">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>{isMl ? 'തത്സമയ പുതുക്കൽ' : 'Freshness Decay'}</span>
                </div>
                <div className="text-base font-mono font-bold text-slate-900 tabular-nums">
                  +{trustEval.breakdown.freshnessPoints} <span className="text-xs text-slate-400 font-normal">/ 25 pts</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Updated {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {trustEval.breakdown.disputePenalty > 0 && (
              <div
                className="mt-3 p-2.5 bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2"
                style={{ borderRadius: '4px' }}
              >
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  Discrepancy Penalty: -{trustEval.breakdown.disputePenalty} pts ({item.disputeCount} cardholders flagged item unavailable).
                </span>
              </div>
            )}
          </div>

          {/* Audit Trail Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              {isMl ? 'തീയതി രേഖപ്പെടുത്തിയ പരിശോധനാ ചരിത്രം' : 'Timestamped Ledger Entries'}
            </h3>
            {item.verificationHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                {isMl ? 'പരിശോധനാ രേഖകൾ ലഭ്യമല്ല.' : 'No previous audit entries for this item.'}
              </p>
            ) : (
              <div className="border border-slate-200 divide-y divide-slate-100" style={{ borderRadius: '4px' }}>
                {item.verificationHistory.map((entry) => (
                  <div key={entry.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            entry.reporterType === 'DEALER'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          {entry.reporterType}
                        </span>
                        <span className="font-semibold text-slate-900">{entry.reporterLabel}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {new Date(entry.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-700 mt-1">{entry.details}</p>
                      {entry.referenceProof && (
                        <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                          Proof Ref: {entry.referenceProof}
                        </p>
                      )}
                    </div>
                    <div className="font-mono text-xs font-bold text-slate-700 self-start sm:self-center tabular-nums shrink-0">
                      {entry.trustImpact >= 0 ? `+${entry.trustImpact}` : `${entry.trustImpact}`} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={() => setAuditModalItem(null)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
            style={{ borderRadius: '4px' }}
          >
            {isMl ? 'അടയ്ക്കുക' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

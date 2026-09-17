import React from 'react';
import { usePds } from '../context/PdsContext';
import { X, ShieldCheck, FileText, UserCheck, AlertOctagon, Info } from 'lucide-react';
import { calculateTrustScore } from '../utils/trustCalculator';

export const AuditModal: React.FC = () => {
  const { auditModalItem, setAuditModalItem, language } = usePds();

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        className="bg-white border border-slate-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        style={{ borderRadius: '6px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 id="audit-modal-title" className="text-lg font-bold text-slate-900">
                {isMl ? 'ഡാറ്റാ വിശ്വാസ്യത & പരിശോധനാ രേഖകൾ' : 'Data Credibility & Verification Trail'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {shop.ardNumber} • {shop.nameEn} • {isMl ? item.nameMl : item.nameEn}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAuditModalItem(null)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            style={{ borderRadius: '4px' }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Trust Score Summary Banner */}
          <div className="border border-slate-200 bg-slate-50 p-4" style={{ borderRadius: '4px' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">
                {isMl ? 'വിശ്വാസ്യത സ്കോർ' : 'Overall Trust Score'}
              </span>
              <span className="text-2xl font-mono font-bold text-slate-900">
                {trustEval.score} / 100
              </span>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 mb-3" style={{ borderRadius: '2px' }}>
              <div
                className={`h-2.5 ${
                  trustEval.score >= 75
                    ? 'bg-emerald-600'
                    : trustEval.score >= 45
                    ? 'bg-amber-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${trustEval.score}%`, borderRadius: '2px' }}
              />
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {isMl ? trustEval.explanationMl : trustEval.explanationEn}
            </p>
          </div>

          {/* Tri-Factor Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {isMl ? 'സ്കോർ നിർണ്ണയ ഘടകങ്ങൾ (ത്രിതല പരിശോധന)' : 'Tri-Factor Scoring Breakdown'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-slate-200 p-3 bg-white" style={{ borderRadius: '4px' }}>
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold mb-1">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>{isMl ? 'സപ്ലൈകോ ചെല്ലാൻ' : 'Official Challan'}</span>
                </div>
                <div className="text-lg font-mono font-bold text-slate-900">
                  +{trustEval.breakdown.challanPoints} <span className="text-xs text-slate-500 font-normal">/ 40 pts</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {item.lastChallanNo ? `Challan #${item.lastChallanNo}` : 'No recent DC logged'}
                </p>
              </div>

              <div className="border border-slate-200 p-3 bg-white" style={{ borderRadius: '4px' }}>
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold mb-1">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>{isMl ? 'ഉപഭോക്തൃ സ്ഥിരീകരണം' : 'Crowd Receipts'}</span>
                </div>
                <div className="text-lg font-mono font-bold text-slate-900">
                  +{trustEval.breakdown.crowdPoints} <span className="text-xs text-slate-500 font-normal">/ 35 pts</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {item.verifiedReportsCount} verified citizen receipts
                </p>
              </div>

              <div className="border border-slate-200 p-3 bg-white" style={{ borderRadius: '4px' }}>
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold mb-1">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>{isMl ? 'തത്സമയ പുതുക്കൽ' : 'Freshness Factor'}</span>
                </div>
                <div className="text-lg font-mono font-bold text-slate-900">
                  +{trustEval.breakdown.freshnessPoints} <span className="text-xs text-slate-500 font-normal">/ 25 pts</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Updated {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {trustEval.breakdown.disputePenalty > 0 && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2" style={{ borderRadius: '4px' }}>
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  Discrepancy Penalty: -{trustEval.breakdown.disputePenalty} pts ({item.disputeCount} cardholders flagged item unavailable).
                </span>
              </div>
            )}
          </div>

          {/* Audit Trail Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {isMl ? 'തീയതി രേഖപ്പെടുത്തിയ പരിശോധനാ ചരിത്രം' : 'Timestamped Verification Log'}
            </h3>
            {item.verificationHistory.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                {isMl ? 'പരിശോധനാ രേഖകൾ ലഭ്യമല്ല.' : 'No audit entries logged for this item yet.'}
              </p>
            ) : (
              <div className="border border-slate-200 divide-y divide-slate-200" style={{ borderRadius: '4px' }}>
                {item.verificationHistory.map((entry) => (
                  <div key={entry.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            entry.reporterType === 'DEALER'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          {entry.reporterType}
                        </span>
                        <span className="font-semibold text-slate-900">{entry.reporterLabel}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-mono">
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
                          Ref: {entry.referenceProof}
                        </p>
                      )}
                    </div>
                    <div className="font-mono text-xs font-bold text-slate-700 self-start sm:self-center">
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

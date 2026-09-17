import React from 'react';
import { RationShop, StockItem, CardType } from '../types';
import { usePds } from '../context/PdsContext';
import { CARD_TYPES } from '../data/seedData';
import { TrustBadge } from './TrustBadge';
import { Bell, Check, Clock, AlertCircle, FileText } from 'lucide-react';

interface StockTableProps {
  shop: RationShop;
  cardTypeFilter: CardType | 'ALL';
  compact?: boolean;
}

export const StockTable: React.FC<StockTableProps> = ({
  shop,
  cardTypeFilter,
  compact = false,
}) => {
  const { setAuditModalItem, setSubscribeModalData, language } = usePds();
  const isMl = language === 'ml';

  const filteredStock = shop.stock.filter((item) => {
    if (cardTypeFilter === 'ALL') return true;
    return item.eligibleCards.includes(cardTypeFilter);
  });

  const getStatusBadge = (status: StockItem['status']) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
            style={{ borderRadius: '3px' }}
          >
            <Check className="w-3 h-3 text-emerald-600" />
            <span>{isMl ? 'ലഭ്യമാണ്' : 'In Stock'}</span>
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200"
            style={{ borderRadius: '3px' }}
          >
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>{isMl ? 'കുറവാണ്' : 'Low Stock'}</span>
          </span>
        );
      case 'EXHAUSTED':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200"
            style={{ borderRadius: '3px' }}
          >
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>{isMl ? 'തീർന്നു' : 'Exhausted'}</span>
          </span>
        );
      case 'AWAITING_SUPPLY':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200"
            style={{ borderRadius: '3px' }}
          >
            <Clock className="w-3 h-3 text-blue-600" />
            <span>{isMl ? 'വരുന്നതേയുള്ളൂ' : 'In Transit'}</span>
          </span>
        );
    }
  };

  if (filteredStock.length === 0) {
    return (
      <div
        className="p-6 text-center text-xs text-slate-500 bg-slate-50/70 border border-slate-200"
        style={{ borderRadius: '4px' }}
      >
        {isMl
          ? 'ഈ കാർഡ് വിഭാഗത്തിന് അനുവദിച്ച സ്റ്റോക്കുകൾ ഈ കടയിൽ ഇപ്പോൾ ലഭ്യമല്ല.'
          : 'No specific stock allocation registered for this cardholder category at this dealership.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 bg-white" style={{ borderRadius: '4px' }}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
            <th className="py-2.5 px-3.5">{isMl ? 'സാധനം & നിരക്ക്' : 'Commodity & Rate'}</th>
            <th className="py-2.5 px-3.5 text-right">{isMl ? 'ലഭ്യമായ അളവ്' : 'Balance'}</th>
            <th className="py-2.5 px-3.5">{isMl ? 'നിലവാരം' : 'Status'}</th>
            {!compact && <th className="py-2.5 px-3.5">{isMl ? 'അർഹത' : 'Eligible Cards'}</th>}
            <th className="py-2.5 px-3.5">{isMl ? 'വിശ്വാസ്യത' : 'Credibility'}</th>
            <th className="py-2.5 px-3.5 text-right">{isMl ? 'നടപടി' : 'Action'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-sans">
          {filteredStock.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
              {/* Commodity & Rate */}
              <td className="py-3 px-3.5">
                <div className="font-semibold text-slate-900">
                  {isMl ? item.nameMl : item.nameEn}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {item.subsidyRatePerKg}
                </div>
              </td>

              {/* Quantity */}
              <td className="py-3 px-3.5 text-right">
                <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                  {item.quantityAvailable}
                </span>{' '}
                <span className="text-[11px] text-slate-500 font-normal">
                  {item.unit}
                </span>
              </td>

              {/* Status */}
              <td className="py-3 px-3.5">{getStatusBadge(item.status)}</td>

              {/* Eligible Cards */}
              {!compact && (
                <td className="py-3 px-3.5">
                  <div className="flex flex-wrap gap-1">
                    {item.eligibleCards.map((c) => {
                      const cInfo = CARD_TYPES[c];
                      return (
                        <span
                          key={c}
                          className="px-1.5 py-0.5 text-[10px] font-bold border font-mono"
                          style={{
                            backgroundColor: cInfo?.bgHex || '#f1f5f9',
                            color: cInfo?.textHex || '#0f172a',
                            borderColor: cInfo?.borderHex || '#cbd5e1',
                            borderRadius: '2px',
                          }}
                          title={cInfo?.nameEn}
                        >
                          {cInfo?.code || c}
                        </span>
                      );
                    })}
                  </div>
                </td>
              )}

              {/* Trust Badge */}
              <td className="py-3 px-3.5">
                <TrustBadge
                  level={item.trustLevel}
                  score={item.trustScore}
                  onClickAudit={() => setAuditModalItem({ shop, item })}
                  compact={compact}
                />
              </td>

              {/* Action Button */}
              <td className="py-3 px-3.5 text-right">
                {item.status === 'EXHAUSTED' || item.status === 'AWAITING_SUPPLY' || item.status === 'LOW_STOCK' ? (
                  <button
                    type="button"
                    onClick={() => setSubscribeModalData({ shop, item })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50/80 border border-blue-200 hover:bg-blue-100/70 transition-colors"
                    style={{ borderRadius: '4px' }}
                  >
                    <Bell className="w-3 h-3" />
                    <span>{isMl ? 'അറിയിപ്പ്' : 'Alert Me'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuditModalItem({ shop, item })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                    style={{ borderRadius: '4px' }}
                  >
                    <FileText className="w-3 h-3 text-slate-500" />
                    <span>{isMl ? 'രേഖകൾ' : 'Audit'}</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

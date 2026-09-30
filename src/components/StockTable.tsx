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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{isMl ? 'ലഭ്യമാണ്' : 'In Stock'}</span>
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{isMl ? 'കുറവാണ്' : 'Low Stock'}</span>
          </span>
        );
      case 'EXHAUSTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>{isMl ? 'തീർന്നു' : 'Exhausted'}</span>
          </span>
        );
      case 'AWAITING_SUPPLY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{isMl ? 'വരുന്നതേയുള്ളൂ' : 'In Transit'}</span>
          </span>
        );
    }
  };

  if (filteredStock.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-slate-50/70 border border-slate-200 rounded-xl">
        {isMl
          ? 'ഈ കാർഡ് വിഭാഗത്തിന് അനുവദിച്ച സ്റ്റോക്കുകൾ ഈ കടയിൽ ഇപ്പോൾ ലഭ്യമല്ല.'
          : 'No specific stock allocation registered for this cardholder category at this dealership.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200/80 bg-white rounded-xl shadow-2xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
            <th className="py-3 px-4">{isMl ? 'സാധനം & നിരക്ക്' : 'Commodity & Rate'}</th>
            <th className="py-3 px-4 text-right">{isMl ? 'ലഭ്യമായ അളവ്' : 'Balance'}</th>
            <th className="py-3 px-4">{isMl ? 'നിലവാരം' : 'Status'}</th>
            {!compact && <th className="py-3 px-4">{isMl ? 'അർഹത' : 'Eligible Cards'}</th>}
            <th className="py-3 px-4">{isMl ? 'വിശ്വാസ്യത' : 'Credibility'}</th>
            <th className="py-3 px-4 text-right">{isMl ? 'നടപടി' : 'Action'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-sans">
          {filteredStock.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
              {/* Commodity & Rate */}
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  {isMl ? item.nameMl : item.nameEn}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {item.subsidyRatePerKg}
                </div>
              </td>

              {/* Quantity */}
              <td className="py-3.5 px-4 text-right">
                <span className="font-bold text-slate-900 tabular-nums text-sm">
                  {item.quantityAvailable}
                </span>{' '}
                <span className="text-xs text-slate-500 font-normal">
                  {item.unit}
                </span>
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>

              {/* Eligible Cards */}
              {!compact && (
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1">
                    {item.eligibleCards.map((c) => {
                      const cInfo = CARD_TYPES[c];
                      return (
                        <span
                          key={c}
                          className="px-2 py-0.5 text-[10px] font-bold border rounded-md"
                          style={{
                            backgroundColor: cInfo?.bgHex || '#f1f5f9',
                            color: cInfo?.textHex || '#0f172a',
                            borderColor: cInfo?.borderHex || '#cbd5e1',
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
              <td className="py-3.5 px-4">
                <TrustBadge
                  level={item.trustLevel}
                  score={item.trustScore}
                  onClickAudit={() => setAuditModalItem({ shop, item })}
                  compact={compact}
                />
              </td>

              {/* Action Button */}
              <td className="py-3.5 px-4 text-right">
                {item.status === 'EXHAUSTED' || item.status === 'AWAITING_SUPPLY' || item.status === 'LOW_STOCK' ? (
                  <button
                    type="button"
                    onClick={() => setSubscribeModalData({ shop, item })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 rounded-lg transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isMl ? 'അറിയിപ്പ്' : 'Alert Me'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuditModalItem({ shop, item })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
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

import React from 'react';
import { RationShop, StockItem, CardType } from '../types';
import { usePds } from '../context/PdsContext';
import { CARD_TYPES } from '../data/seedData';
import { TrustBadge } from './TrustBadge';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';

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

  // Filter items if cardTypeFilter is active
  const filteredStock = shop.stock.filter((item) => {
    if (cardTypeFilter === 'ALL') return true;
    return item.eligibleCards.includes(cardTypeFilter);
  });

  const getStatusBadge = (status: StockItem['status']) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300"
            style={{ borderRadius: '4px' }}
          >
            <Check className="w-3 h-3" />
            {isMl ? 'ലഭ്യമാണ്' : 'In Stock'}
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300"
            style={{ borderRadius: '4px' }}
          >
            <AlertCircle className="w-3 h-3" />
            {isMl ? 'കുറവാണ്' : 'Low Stock'}
          </span>
        );
      case 'EXHAUSTED':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border border-red-300"
            style={{ borderRadius: '4px' }}
          >
            <AlertCircle className="w-3 h-3" />
            {isMl ? 'തീർന്നു' : 'Exhausted'}
          </span>
        );
      case 'AWAITING_SUPPLY':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300"
            style={{ borderRadius: '4px' }}
          >
            <Clock className="w-3 h-3" />
            {isMl ? 'വരുന്നതേയുള്ളൂ' : 'In Transit'}
          </span>
        );
    }
  };

  if (filteredStock.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200" style={{ borderRadius: '4px' }}>
        {isMl
          ? 'ഈ കാർഡ് വിഭാഗത്തിന് അനുവദിച്ച സ്റ്റോക്കുകൾ ഈ കടയിൽ ഇപ്പോൾ ലഭ്യമല്ല.'
          : 'No specific stock quota registered for this cardholder category at this dealership.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200" style={{ borderRadius: '4px' }}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-2.5 px-3">{isMl ? 'സാധനം' : 'Commodity'}</th>
            <th className="py-2.5 px-3">{isMl ? 'അളവ്' : 'Balance'}</th>
            <th className="py-2.5 px-3">{isMl ? 'നിലവാരം' : 'Status'}</th>
            {!compact && <th className="py-2.5 px-3">{isMl ? 'അർഹത' : 'Eligible Cards'}</th>}
            <th className="py-2.5 px-3">{isMl ? 'വിശ്വാസ്യത' : 'Credibility'}</th>
            <th className="py-2.5 px-3 text-right">{isMl ? 'നടപടി' : 'Action'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white font-sans">
          {filteredStock.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
              {/* Commodity Name & Price */}
              <td className="py-2.5 px-3">
                <div className="font-semibold text-slate-900">
                  {isMl ? item.nameMl : item.nameEn}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {item.subsidyRatePerKg}
                </div>
              </td>

              {/* Quantity */}
              <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                {item.quantityAvailable}{' '}
                <span className="text-[11px] font-normal text-slate-500 font-sans">
                  {item.unit}
                </span>
              </td>

              {/* Status Badge */}
              <td className="py-2.5 px-3">{getStatusBadge(item.status)}</td>

              {/* Eligible Cards */}
              {!compact && (
                <td className="py-2.5 px-3">
                  <div className="flex flex-wrap gap-1">
                    {item.eligibleCards.map((c) => {
                      const cInfo = CARD_TYPES[c];
                      return (
                        <span
                          key={c}
                          className="px-1.5 py-0.2 text-[10px] font-bold border"
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
              <td className="py-2.5 px-3">
                <TrustBadge
                  level={item.trustLevel}
                  score={item.trustScore}
                  onClickAudit={() => setAuditModalItem({ shop, item })}
                  compact={compact}
                />
              </td>

              {/* Action Button */}
              <td className="py-2.5 px-3 text-right">
                {item.status === 'EXHAUSTED' || item.status === 'AWAITING_SUPPLY' || item.status === 'LOW_STOCK' ? (
                  <button
                    type="button"
                    onClick={() => setSubscribeModalData({ shop, item })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                    style={{ borderRadius: '4px' }}
                  >
                    <Bell className="w-3 h-3" />
                    <span>{isMl ? 'അറിയിപ്പ്' : 'Alert Me'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuditModalItem({ shop, item })}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-300 hover:bg-slate-100 transition-colors"
                    style={{ borderRadius: '4px' }}
                  >
                    {isMl ? 'രേഖകൾ' : 'Audit'}
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

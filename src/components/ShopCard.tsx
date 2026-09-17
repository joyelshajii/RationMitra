import React, { useState } from 'react';
import { RationShop, CardType } from '../types';
import { usePds } from '../context/PdsContext';
import { StockTable } from './StockTable';
import {
  MapPin,
  Phone,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle,
  FileSpreadsheet,
  Bell,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ShopCardProps {
  shop: RationShop;
  cardTypeFilter: CardType | 'ALL';
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, cardTypeFilter }) => {
  const {
    setSelectedShopId,
    setActiveView,
    setSubscribeModalData,
    language,
  } = usePds();

  const isMl = language === 'ml';
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getEposBadge = () => {
    switch (shop.eposStatus) {
      case 'ONLINE':
        return (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50/90 px-2 py-0.5 border border-emerald-200"
            style={{ borderRadius: '3px' }}
          >
            <Wifi className="w-3 h-3 text-emerald-600" />
            <span>ePOS Online</span>
          </span>
        );
      case 'SLOW':
        return (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200"
            style={{ borderRadius: '3px' }}
          >
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>ePOS Latency</span>
          </span>
        );
      case 'OFFLINE':
        return (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-mono text-red-800 bg-red-50 px-2 py-0.5 border border-red-200"
            style={{ borderRadius: '3px' }}
          >
            <WifiOff className="w-3 h-3 text-red-600" />
            <span>ePOS Down</span>
          </span>
        );
    }
  };

  // Commodities summary overview
  const inStockCount = shop.stock.filter((s) => s.status === 'IN_STOCK').length;
  const totalCount = shop.stock.length;

  return (
    <article
      className="bg-white border border-slate-200/90 transition-all hover:border-slate-300 shadow-2xs overflow-hidden"
      style={{ borderRadius: '6px' }}
    >
      {/* Header Info Area */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className="px-2 py-0.5 text-xs font-mono font-bold bg-[#0C1E33] text-white tracking-wide"
              style={{ borderRadius: '3px' }}
            >
              {shop.ardNumber}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-medium border ${
                shop.isOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
              style={{ borderRadius: '3px' }}
            >
              {shop.isOpen ? (isMl ? 'വിതരണം നടക്കുന്നു' : 'Open for Distribution') : (isMl ? 'അടച്ചിരിക്കുന്നു' : 'Closed')}
            </span>
            {getEposBadge()}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {isMl ? shop.nameMl : shop.nameEn}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isMl ? 'ലൈസൻസി' : 'Licensee'}: <span className="font-medium text-slate-800">{shop.licensee}</span> • {shop.ward}, {shop.taluk}
          </p>
        </div>

        {/* Distance, Queue, Sync indicators */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 text-right gap-1 shrink-0">
          <div
            className="text-xs font-mono font-semibold text-slate-800 bg-slate-100/80 px-2.5 py-1 border border-slate-200"
            style={{ borderRadius: '3px' }}
          >
            {shop.distanceKm} km {isMl ? 'ദൂരം' : 'away'}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Est. Wait: ~{shop.queueEstimateMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Quick Commodity Chips Snapshot */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {isMl ? 'ലഭ്യത' : 'Stock Snapshot'}:
          </span>
          {shop.stock.slice(0, 5).map((st) => (
            <span
              key={st.id}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium border ${
                st.status === 'IN_STOCK'
                  ? 'bg-white text-slate-800 border-slate-200'
                  : st.status === 'LOW_STOCK'
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200 opacity-75'
              }`}
              style={{ borderRadius: '3px' }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  st.status === 'IN_STOCK'
                    ? 'bg-emerald-500'
                    : st.status === 'LOW_STOCK'
                    ? 'bg-amber-500'
                    : 'bg-red-400'
                }`}
              />
              <span className="truncate max-w-[120px]">{isMl ? st.nameMl.split(' ')[0] : st.nameEn.split(' ')[0]}</span>
              <span className="font-mono text-[10px] text-slate-500 tabular-nums">({st.quantityAvailable})</span>
            </span>
          ))}
          {shop.stock.length > 5 && (
            <span className="text-[11px] text-slate-400 font-mono">+{shop.stock.length - 5} more</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors py-1"
        >
          <span>{isExpanded ? (isMl ? 'പട്ടിക ചുരുക്കുക' : 'Hide Table') : (isMl ? 'പട്ടിക കാണുക' : 'Show Full Table')}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Inventory Table */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isMl ? 'തത്സമയ സ്റ്റോക്ക് നിലവാരം' : 'Live Commodity Balance Table'}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Sync: {new Date(shop.eposLastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <StockTable shop={shop} cardTypeFilter={cardTypeFilter} compact={false} />
        </div>
      )}

      {/* Card Action Strip */}
      <div className="px-4 sm:px-5 py-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedShopId(shop.id);
              setActiveView('REPORT');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            style={{ borderRadius: '4px' }}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>{isMl ? 'വിവരം അറിയിക്കുക' : 'Report Status'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubscribeModalData({ shop })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50/70 border border-blue-200 hover:bg-blue-100/70 transition-colors"
            style={{ borderRadius: '4px' }}
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>{isMl ? 'അറിയിപ്പ് സജ്ജമാക്കുക' : 'Arrival Alert'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedShopId(shop.id);
            setActiveView('SHOP_DETAIL');
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
        >
          <span>{isMl ? 'കൂടുതൽ വിവരങ്ങൾ & രേഖകൾ' : 'Dealership Profile & Ledger'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};

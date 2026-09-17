import React from 'react';
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

  const getEposBadge = () => {
    switch (shop.eposStatus) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200" style={{ borderRadius: '2px' }}>
            <Wifi className="w-3 h-3 text-emerald-700" />
            <span>ePOS Online</span>
          </span>
        );
      case 'SLOW':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200" style={{ borderRadius: '2px' }}>
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            <span>ePOS Latency</span>
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-red-800 bg-red-50 px-2 py-0.5 border border-red-200" style={{ borderRadius: '2px' }}>
            <WifiOff className="w-3 h-3 text-red-700" />
            <span>ePOS Down</span>
          </span>
        );
    }
  };

  return (
    <article
      className="bg-white border border-slate-300 shadow-xs hover:border-slate-400 transition-shadow overflow-hidden"
      style={{ borderRadius: '6px' }}
    >
      {/* Card Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#0F2942] text-white" style={{ borderRadius: '3px' }}>
              {shop.ardNumber}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold border ${
                shop.isOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-red-50 text-red-800 border-red-300'
              }`}
              style={{ borderRadius: '3px' }}
            >
              {shop.isOpen ? (isMl ? 'തുറന്നിരിക്കുന്നു' : 'Open') : (isMl ? 'അടച്ചിരിക്കുന്നു' : 'Closed')}
            </span>
            {getEposBadge()}
          </div>

          <h3 className="text-base font-bold text-slate-900">
            {isMl ? shop.nameMl : shop.nameEn}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {isMl ? 'ലൈസൻസി' : 'Licensee'}: <span className="font-semibold text-slate-800">{shop.licensee}</span> • {shop.ward}
          </p>
        </div>

        {/* Distance & Queue info */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 text-right">
          <div className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 border border-blue-200" style={{ borderRadius: '3px' }}>
            {shop.distanceKm} km {isMl ? 'ദൂരം' : 'away'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{isMl ? 'ക്യൂ സമയം' : 'Est. Queue'}: ~{shop.queueEstimateMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="px-4 sm:px-5 py-3 text-xs text-slate-600 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{isMl ? shop.addressMl : shop.addressEn}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-slate-700">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{shop.phone}</span>
        </div>
      </div>

      {/* Commodity Stock Table */}
      <div className="p-4 sm:p-5 bg-white">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isMl ? 'സ്റ്റോക്ക് നിലവാരം' : 'Stock Availability'}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {isMl ? 'അവസാനം രേഖപ്പെടുത്തിയത്' : 'Sync'}: {new Date(shop.eposLastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <StockTable shop={shop} cardTypeFilter={cardTypeFilter} compact={false} />
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedShopId(shop.id);
              setActiveView('REPORT');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
            style={{ borderRadius: '4px' }}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span>{isMl ? 'വിവരം അറിയിക്കുക' : 'Report Status'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubscribeModalData({ shop })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
            style={{ borderRadius: '4px' }}
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>{isMl ? 'അറിയിപ്പ് സജ്ജമാക്കുക' : 'Get Alerts'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedShopId(shop.id);
            setActiveView('SHOP_DETAIL');
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950 transition-colors"
        >
          <span>{isMl ? 'കൂടുതൽ വിവരങ്ങൾ' : 'Full Details'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};

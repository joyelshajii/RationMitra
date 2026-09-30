import React, { useState } from 'react';
import { RationShop, CardType, StockItem } from '../types';
import { usePds } from '../context/PdsContext';
import { StockTable } from './StockTable';
import { TrustBadge } from './TrustBadge';
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
  Navigation,
  CheckCircle2,
  Package,
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
    setAuditModalItem,
    language,
  } = usePds();

  const isMl = language === 'ml';
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getEposBadge = () => {
    switch (shop.eposStatus) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <Wifi className="w-3 h-3 text-emerald-600" />
            <span>ePOS Online</span>
          </span>
        );
      case 'SLOW':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>ePOS Latency</span>
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            <WifiOff className="w-3 h-3 text-rose-600" />
            <span>ePOS Offline</span>
          </span>
        );
    }
  };

  // Filter stock for the selected card
  const filteredStock = shop.stock.filter((item) => {
    if (cardTypeFilter === 'ALL') return true;
    return item.eligibleCards.includes(cardTypeFilter);
  });

  const getStockStatusTag = (status: StockItem['status'], qty: number, unit: string) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{isMl ? 'ലഭ്യമാണ്' : 'In Stock'}</span>
            <span className="text-[11px] font-mono text-emerald-700 font-semibold ml-1">
              ({qty} {unit})
            </span>
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>{isMl ? 'കുറവാണ്' : 'Low Stock'}</span>
            <span className="text-[11px] font-mono text-amber-800 font-semibold ml-1">
              ({qty} {unit})
            </span>
          </span>
        );
      case 'EXHAUSTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
            <span>{isMl ? 'സ്റ്റോക്ക് തീർന്നു' : 'Out of Stock'}</span>
          </span>
        );
      case 'AWAITING_SUPPLY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span>{isMl ? 'വരുന്നതേയുള്ളൂ' : 'In Transit'}</span>
          </span>
        );
    }
  };

  return (
    <article className="bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden group">
      {/* Header Info Area */}
      <div className="p-5 sm:p-6 border-b border-slate-100/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-slate-900 text-white rounded-md tracking-wider">
                {shop.ardNumber}
              </span>

              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                  shop.isOpen
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {shop.isOpen
                  ? isMl
                    ? 'വിതരണം നടക്കുന്നു'
                    : 'Open Now'
                  : isMl
                  ? 'അടച്ചിരിക്കുന്നു'
                  : 'Closed'}
              </span>

              {getEposBadge()}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pt-0.5">
              {isMl ? shop.nameMl : shop.nameEn}
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span>
                {isMl ? 'ലൈസൻസി' : 'Licensee'}:{' '}
                <strong className="text-slate-800 font-semibold">{shop.licensee}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{shop.ward}, {shop.taluk}</span>
              </span>
            </div>
          </div>

          {/* Distance, Queue, Hours Info Strip */}
          <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
              <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{shop.distanceKm} km {isMl ? 'ദൂരം' : 'away'}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Est. Wait: ~{shop.queueEstimateMinutes} min</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Commodities Visual Grid (Clean 2-to-4 column responsive grid) */}
      <div className="p-5 sm:p-6 bg-slate-50/40 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isMl ? 'പ്രധാന ഭക്ഷ്യധാന്യ ലഭ്യത' : 'Key Commodity Availability'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
          >
            <span>
              {isExpanded
                ? isMl
                  ? 'ചുരുക്കുക'
                  : 'Hide Details'
                : isMl
                ? 'എല്ലാ സാധനങ്ങളും കാണുക'
                : 'Show All Commodities'}
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Commodity Mini-Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredStock.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {isMl ? item.nameMl : item.nameEn}
                  </h4>
                  <TrustBadge
                    level={item.trustLevel}
                    score={item.trustScore}
                    onClickAudit={() => setAuditModalItem({ shop, item })}
                    compact
                  />
                </div>

                <div className="text-[11px] text-slate-500 truncate">
                  {item.subsidyRatePerKg}
                </div>
              </div>

              <div className="pt-1">
                {getStockStatusTag(item.status, item.quantityAvailable, item.unit)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Table (when toggled) */}
      {isExpanded && (
        <div className="p-5 sm:p-6 bg-white border-b border-slate-100 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isMl ? 'തത്സമയ സ്റ്റോക്ക് നിലവാരം' : 'Complete Stock Ledger & Challans'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Synced: {new Date(shop.eposLastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <StockTable shop={shop} cardTypeFilter={cardTypeFilter} compact={false} />
        </div>
      )}

      {/* Clean Bottom Action Strip */}
      <div className="px-5 py-3.5 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Call */}
          <a
            href={`tel:${shop.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Call dealership"
          >
            <Phone className="w-3.5 h-3.5 text-slate-600" />
            <span>{isMl ? 'വിളിക്കുക' : 'Call'}</span>
          </a>

          {/* Quick Map Directions */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${shop.coordinates.lat},${shop.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Open in Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{isMl ? 'ദിശ' : 'Directions'}</span>
          </a>

          {/* Set Alert */}
          <button
            type="button"
            onClick={() => setSubscribeModalData({ shop })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-lg transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>{isMl ? 'അറിയിപ്പ്' : 'Get Alert'}</span>
          </button>

          {/* Report */}
          <button
            type="button"
            onClick={() => {
              setSelectedShopId(shop.id);
              setActiveView('REPORT');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>{isMl ? 'റിപ്പോർട്ട്' : 'Report'}</span>
          </button>
        </div>

        {/* Primary View Profile Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedShopId(shop.id);
            setActiveView('SHOP_DETAIL');
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors ml-auto sm:ml-0"
        >
          <span>{isMl ? 'മുഴുവൻ വിവരങ്ങൾ കാണുക' : 'Dealership Details & History'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};


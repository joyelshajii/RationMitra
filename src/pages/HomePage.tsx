import React, { useMemo, useState } from 'react';
import { usePds } from '../context/PdsContext';
import { ShopCard } from '../components/ShopCard';
import { CARD_TYPES } from '../data/seedData';
import { CardType } from '../types';
import {
  Search,
  Filter,
  ShieldCheck,
  FileSpreadsheet,
  Building,
  Radio,
  X,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const HomePage: React.FC = () => {
  const {
    shops,
    searchQuery,
    setSearchQuery,
    selectedCardType,
    setSelectedCardType,
    selectedTaluk,
    setSelectedTaluk,
    setActiveView,
    language,
  } = usePds();

  const t = (key: any) => getTranslation(language, key);
  const isMl = language === 'ml';

  // Toggle quick filters
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [eposOnlineOnly, setEposOnlineOnly] = useState<boolean>(false);

  // Distinct Taluks
  const taluks = useMemo(() => {
    const set = new Set(shops.map((s) => s.taluk));
    return ['ALL', ...Array.from(set)];
  }, [shops]);

  // Filtered Shops
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      if (selectedTaluk !== 'ALL' && shop.taluk !== selectedTaluk) {
        return false;
      }
      if (openOnly && !shop.isOpen) {
        return false;
      }
      if (eposOnlineOnly && shop.eposStatus !== 'ONLINE') {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesArd = shop.ardNumber.toLowerCase().includes(q);
        const matchesName = shop.nameEn.toLowerCase().includes(q) || shop.nameMl.toLowerCase().includes(q);
        const matchesLicensee = shop.licensee.toLowerCase().includes(q);
        const matchesWard = shop.ward.toLowerCase().includes(q) || shop.taluk.toLowerCase().includes(q);
        if (!matchesArd && !matchesName && !matchesLicensee && !matchesWard) {
          return false;
        }
      }
      return true;
    });
  }, [shops, selectedTaluk, searchQuery, openOnly, eposOnlineOnly]);

  // Metrics
  const totalStockItems = shops.reduce((acc, s) => acc + s.stock.length, 0);
  const totalInStock = shops.reduce(
    (acc, s) => acc + s.stock.filter((item) => item.status === 'IN_STOCK').length,
    0
  );
  const avgTrustScore = Math.round(
    shops.reduce(
      (acc, s) => acc + s.stock.reduce((sum, item) => sum + item.trustScore, 0),
      0
    ) / Math.max(1, totalStockItems)
  );

  return (
    <div className="space-y-8">
      {/* Top Page Header (Open, Refined, Non-Generic) */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-semibold" style={{ borderRadius: '3px' }}>
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>PDS KERALA LIVE DISPATCH GRID</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">
                Central Travancore Sector
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {isMl ? 'റേഷൻ കടകളിലെ സ്റ്റോക്ക് പരിശോധന' : 'Ration Availability & Stock Intelligence'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {isMl
                ? 'നിങ്ങളുടെ റേഷൻ കടയിൽ അരി, ആട്ട, പഞ്ചസാര, മണ്ണെണ്ണ എന്നിവ ലഭ്യമാണോ എന്ന് വീട്ടിലിരുന്ന് അറിയൂ. ഔദ്യോഗിക സപ്ലൈകോ ചെല്ലാൻ വഴി സ്ഥിരീകരിച്ച കണക്കുകൾ.'
                : 'Real-time commodity balances across nearby Authorised Ration Dealers (ARDs). Ground data corroborated via Supplyco delivery challans and physical cardholder transaction slips.'}
            </p>
          </div>

          {/* Quick Metrics Capsule Strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono shrink-0">
            <div className="bg-white border border-slate-200 px-3 py-2 text-slate-700" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Active ARDs</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">{shops.length} Dealerships</span>
            </div>

            <div className="bg-white border border-slate-200 px-3 py-2 text-slate-700" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Commodities Ready</span>
              <span className="text-sm font-bold text-emerald-700 tabular-nums">{totalInStock} / {totalStockItems}</span>
            </div>

            <div className="bg-white border border-slate-200 px-3 py-2 text-slate-700" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Avg. Trust</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{avgTrustScore}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Precision Search & Filter Console */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4" style={{ borderRadius: '6px' }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-9 py-2 border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
              style={{ borderRadius: '4px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Taluk Dropdown */}
          <div className="md:col-span-4 relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
              aria-label={isMl ? 'താലൂക്ക് തിരഞ്ഞെടുക്കുക' : 'Select Taluk'}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
              style={{ borderRadius: '4px' }}
            >
              <option value="ALL">{t('allTaluks')} (All Kottayam)</option>
              {taluks.filter((t) => t !== 'ALL').map((taluk) => (
                <option key={taluk} value={taluk}>
                  {taluk} Taluk
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ration Card Category Bar (Vital for Cardholders!) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('filterByCard')}:</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Select card colour to verify your monthly quota allocation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCardType('ALL')}
              className={`p-2 border text-left transition-all ${
                selectedCardType === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <span className="font-bold block">{t('allCards')}</span>
              <span className="text-[10px] opacity-80 block truncate">Complete stock list</span>
            </button>

            {Object.values(CARD_TYPES).map((card) => {
              const isSelected = selectedCardType === card.type;
              return (
                <button
                  key={card.type}
                  type="button"
                  onClick={() => setSelectedCardType(card.type)}
                  className={`p-2 border text-left transition-all ${
                    isSelected ? 'ring-2 ring-blue-700 shadow-xs' : 'hover:opacity-95'
                  }`}
                  style={{
                    backgroundColor: card.bgHex,
                    color: card.textHex,
                    borderColor: card.borderHex,
                    borderRadius: '4px',
                  }}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-xs">{card.code}</span>
                    <span
                      className="w-2 h-2 rounded-full border"
                      style={{ backgroundColor: card.colorHex, borderColor: card.borderHex }}
                    />
                  </div>
                  <span className="text-[10px] block truncate font-medium">
                    {isMl ? card.nameMl.split(' ')[0] : card.nameEn.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed quota explanation banner when a card is selected */}
          {selectedCardType !== 'ALL' && (
            <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between gap-2" style={{ borderRadius: '4px' }}>
              <div>
                <span className="font-bold text-slate-900">
                  {CARD_TYPES[selectedCardType]?.nameEn}:
                </span>{' '}
                <span>{CARD_TYPES[selectedCardType]?.description}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardType('ALL')}
                className="text-blue-700 hover:underline shrink-0 text-[10px] font-semibold"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Quick Operational Checkboxes */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span>{t('openOnly')}</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700">
              <input
                type="checkbox"
                checked={eposOnlineOnly}
                onChange={(e) => setEposOnlineOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span>{t('eposOnlineOnly')}</span>
            </label>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Showing <span className="font-bold text-slate-900 tabular-nums">{filteredShops.length}</span> of {shops.length} ARDs
          </div>
        </div>
      </div>

      {/* Main Dealership Directory Listings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {isMl ? 'റേഷൻ കടകളുടെ വിവരങ്ങൾ' : 'Verified Authorised Ration Dealerships'}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Sorted by Proximity
          </span>
        </div>

        {filteredShops.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 text-center space-y-3" style={{ borderRadius: '6px' }}>
            <p className="text-sm text-slate-600">
              {isMl
                ? 'തിരഞ്ഞെടുത്ത മാനദണ്ഡങ്ങൾക്ക് അനുസൃതമായ റേഷൻ കടകൾ ലഭ്യമല്ല.'
                : 'No dealerships match the specified search or operational filters.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTaluk('ALL');
                setSelectedCardType('ALL');
                setOpenOnly(false);
                setEposOnlineOnly(false);
              }}
              className="px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100"
              style={{ borderRadius: '4px' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                cardTypeFilter={selectedCardType}
              />
            ))}
          </div>
        )}
      </section>

      {/* Community Observation Action Strip */}
      <section className="bg-white border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: '6px' }}>
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">
              {isMl ? 'നിങ്ങൾ ഇപ്പോൾ റേഷൻ കടയിലാണോ?' : 'Just Visited Your Local Dealership?'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isMl
              ? 'സ്റ്റോക്ക് തീർന്നതോ പുതിയ ലോഡ് എത്തിയതോ 30 സെക്കൻഡിൽ രേഖപ്പെടുത്തൂ. നിങ്ങളുടെ വിവരം മറ്റുള്ളവരുടെ സമയം ലാഭിക്കും.'
              : 'Submit a 30-second ground status report. Entering your ePOS bill transaction number increases local data trust score by +20 points.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('REPORT')}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-xs shrink-0"
          style={{ borderRadius: '4px' }}
        >
          {t('citizenReportTitle')}
        </button>
      </section>
    </div>
  );
};

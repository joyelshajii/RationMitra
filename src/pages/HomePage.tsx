import React, { useMemo, useState } from 'react';
import { usePds } from '../context/PdsContext';
import { ShopCard } from '../components/ShopCard';
import { ShopMapModal } from '../components/ShopMapModal';
import { CardScannerModal } from '../components/CardScannerModal';
import { CARD_TYPES } from '../data/seedData';
import { CardType } from '../types';
import {
  Search,
  Filter,
  ShieldCheck,
  FileSpreadsheet,
  Building,
  X,
  CheckCircle2,
  Calculator,
  LayoutGrid,
  List,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  ArrowRight,
  PackageCheck,
  QrCode,
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
    setSelectedShopId,
    language,
  } = usePds();

  const t = (key: any) => getTranslation(language, key);
  const isMl = language === 'ml';

  // Quick filters & view states
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [eposOnlineOnly, setEposOnlineOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  // Interactive Quota Calculator State
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calcMembers, setCalcMembers] = useState<number>(4);
  const [calcCard, setCalcCard] = useState<CardType>('PHH_PINK');

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

  // Calculate entitlement for the quick calculator
  const getCalculatedQuota = () => {
    switch (calcCard) {
      case 'AAY_YELLOW':
        return {
          rice: '30 kg (Free)',
          wheat: '5 kg (Free)',
          atta: 'Optional periodic quota',
          sugar: '1 kg @ ₹21/kg',
          kerosene: '1.5 Litres @ ₹59/L',
          monthlyTotal: '₹21.00 approx.',
        };
      case 'PHH_PINK':
        return {
          rice: `${calcMembers * 4} kg (${calcMembers} × 4kg, Free)`,
          wheat: `${calcMembers * 1} kg (${calcMembers} × 1kg, Free)`,
          atta: '1-2 packets @ ₹17/pkt',
          sugar: 'Not standard subsidized quota',
          kerosene: '1 Litre @ ₹59/L',
          monthlyTotal: 'Free for food grains',
        };
      case 'NPS_BLUE':
        return {
          rice: `${calcMembers * 2} kg (${calcMembers} × 2kg @ ₹4/kg)`,
          wheat: 'Subject to godown availability',
          atta: `${Math.min(calcMembers, 3)} packets @ ₹17/pkt`,
          sugar: 'Festival special allocation',
          kerosene: '0.5 Litre (as available)',
          monthlyTotal: `₹${calcMembers * 2 * 4 + 34}.00 approx.`,
        };
      case 'NPNS_WHITE':
        return {
          rice: 'Periodic market-intervention @ ₹10.90/kg',
          wheat: 'Not subsidized',
          atta: 'Up to 2 packets @ ₹17/pkt',
          sugar: 'Not subsidized',
          kerosene: 'Not subsidized',
          monthlyTotal: 'Pay per market allocation',
        };
    }
  };

  const calculatedQuota = getCalculatedQuota();

  return (
    <div className="space-y-6">
      {/* Modern, Uncluttered Citizen Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-[#0C1E33] text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        {/* Background decorative ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-300 rounded-full text-xs font-semibold backdrop-blur-xs border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kottayam Central PDS Live Grid</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80 font-normal">Real-Time Challans</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {isMl
              ? 'റേഷൻ കടകളിലെ തത്സമയ സ്റ്റോക്ക് അറിയൂ'
              : 'Know Your Ration Stock Before You Go'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            {isMl
              ? 'നിങ്ങളുടെ റേഷൻ കടയിൽ അരി, ആട്ട, പഞ്ചസാര, മണ്ണെണ്ണ എന്നിവ ലഭ്യമാണോ എന്ന് തത്സമയം അറിയൂ. സപ്ലൈകോ ചെല്ലാൻ വഴിയും ഉപഭോക്തൃ രസീത് വഴിയും സ്ഥിരീകരിച്ച കണക്കുകൾ.'
              : 'Check live balances of Rice, Wheat, Atta, and Kerosene across Authorised Ration Dealers (ARDs). Corroborated with Supplyco godown delivery challans and ePOS receipts.'}
          </p>

          {/* Inline Live Status Metrics */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/10">
              <strong className="text-white font-bold">{shops.length}</strong>
              <span className="text-slate-300">Active Dealerships</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <strong className="text-emerald-300 font-bold">{totalInStock} / {totalStockItems}</strong>
              <span className="text-slate-300">Commodities Ready</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <strong className="text-white font-bold">{avgTrustScore}%</strong>
              <span className="text-slate-300">Avg. Trust</span>
            </span>

            {/* Scan Card Trigger Button */}
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/25 hover:bg-blue-500/35 text-blue-200 border border-blue-400/30 font-semibold transition-all cursor-pointer ml-auto"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{isMl ? 'കാർഡ് സ്കാൻ' : 'Scan Card'}</span>
            </button>

            {/* Quota Calculator Trigger Button */}
            <button
              type="button"
              onClick={() => setShowCalculator(!showCalculator)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30 font-semibold transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isMl ? 'എൻ്റെ വിഹിതം കണക്കാക്കുക' : 'Check My Monthly Quota'}</span>
              {showCalculator ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Quota Calculator Tool (Collapsible & Intuitive) */}
      {showCalculator && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {isMl ? 'നിങ്ങളുടെ പ്രതിമാസ റേഷൻ വിഹിത കാൽക്കുലേറ്റർ' : 'Personal Monthly Ration Entitlement Calculator'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isMl
                    ? 'കാർഡ് തരവും കുടുംബാംഗങ്ങളുടെ എണ്ണവും തിരഞ്ഞെടുത്ത് അർഹത പരിശോധിക്കൂ'
                    : 'Select your card colour and number of registered family members to see your exact quota.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCalculator(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Choose Card */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                {isMl ? 'റേഷൻ കാർഡ് തരം' : 'Ration Card Category'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.values(CARD_TYPES).map((card) => (
                  <button
                    key={card.type}
                    type="button"
                    onClick={() => setCalcCard(card.type)}
                    className={`px-3 py-2 text-left rounded-xl border text-xs font-medium transition-all ${
                      calcCard === card.type
                        ? 'ring-2 ring-blue-600 font-bold shadow-xs'
                        : 'hover:bg-slate-50 opacity-80'
                    }`}
                    style={{
                      backgroundColor: card.bgHex,
                      color: card.textHex,
                      borderColor: card.borderHex,
                    }}
                  >
                    <div className="font-bold">{card.code}</div>
                    <div className="text-[11px] truncate">{card.nameEn.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Members */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                {isMl ? 'കുടുംബാംഗങ്ങൾ' : 'Family Members in Card'}
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCalcMembers(num)}
                    className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all ${
                      calcMembers === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {num}{num === 6 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Entitlement Result Card */}
            <div className="md:col-span-4 bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-blue-700 block tracking-wider">
                Monthly Entitlement
              </span>
              <div className="space-y-1 pt-0.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Rice (അരി):</span>
                  <strong className="text-slate-900">{calculatedQuota.rice}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Wheat (ഗോതമ്പ്):</span>
                  <strong className="text-slate-900">{calculatedQuota.wheat}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Atta (ആട്ട):</span>
                  <strong className="text-slate-900">{calculatedQuota.atta}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-emerald-800 font-semibold">
                  <span>Govt. Subsidized Cost:</span>
                  <span>{calculatedQuota.monthlyTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streamlined Search & Filter Console (No Congestion!) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Row 1: Search Input & Taluk Select */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Taluk Dropdown */}
          <div className="md:col-span-4 relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
              aria-label={isMl ? 'താലൂക്ക് തിരഞ്ഞെടുക്കുക' : 'Select Taluk'}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-medium text-slate-700"
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

        {/* Row 2: Sleek Pill Tabs for Card Types */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('filterByCard')}:</span>
            </span>
            <span className="text-xs text-slate-400">
              Filter by card to see your eligible price &amp; availability
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCardType('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedCardType === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t('allCards')}
            </button>

            {Object.values(CARD_TYPES).map((card) => {
              const isSelected = selectedCardType === card.type;
              return (
                <button
                  key={card.type}
                  type="button"
                  onClick={() => setSelectedCardType(card.type)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected ? 'ring-2 ring-blue-600 shadow-xs' : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: card.bgHex,
                    color: card.textHex,
                    borderColor: card.borderHex,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full border shrink-0"
                    style={{ backgroundColor: card.colorHex, borderColor: card.borderHex }}
                  />
                  <span>{card.code} • {isMl ? card.nameMl.split(' ')[0] : card.nameEn.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Card Entitlement Explainer */}
          {selectedCardType !== 'ALL' && (
            <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-950 flex items-center justify-between gap-3">
              <div>
                <strong>{CARD_TYPES[selectedCardType]?.nameEn}:</strong>{' '}
                <span className="text-slate-700">{CARD_TYPES[selectedCardType]?.description}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardType('ALL')}
                className="text-xs font-bold text-blue-700 hover:underline shrink-0"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Row 3: Quick Filter Chips & View Mode Switcher */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenOnly(!openOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                openOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${openOnly ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>{t('openOnly')}</span>
            </button>

            <button
              type="button"
              onClick={() => setEposOnlineOnly(!eposOnlineOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                eposOnlineOnly
                  ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${eposOnlineOnly ? 'bg-blue-500' : 'bg-slate-400'}`} />
              <span>{t('eposOnlineOnly')}</span>
            </button>
          </div>

          {/* View Mode & Count */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('navMap')}</span>
            </button>

            <span className="text-xs text-slate-500 hidden sm:inline">
              Showing <strong className="text-slate-900 font-bold">{filteredShops.length}</strong> of {shops.length} ARDs
            </span>

            <div className="flex items-center border border-slate-200 bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('CARDS')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'CARDS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'TABLE'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Compact List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dealership Directory Listings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {isMl ? 'റേഷൻ കടകളുടെ വിവരങ്ങൾ' : 'Verified Authorised Ration Dealerships'}
          </h2>
          <span className="text-xs text-slate-500">
            Sorted by Proximity to Central Travancore
          </span>
        </div>

        {filteredShops.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
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
              className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'CARDS' ? (
          /* Cards View */
          <div className="grid grid-cols-1 gap-5">
            {filteredShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                cardTypeFilter={selectedCardType}
              />
            ))}
          </div>
        ) : (
          /* Compact Table View (Fast scanning for power users) */
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">ARD &amp; Dealership</th>
                    <th className="py-3 px-4">Status &amp; ePOS</th>
                    <th className="py-3 px-4">Distance &amp; Wait</th>
                    <th className="py-3 px-4">In Stock Items</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredShops.map((shop) => {
                    const inStockCount = shop.stock.filter((s) => s.status === 'IN_STOCK').length;
                    return (
                      <tr key={shop.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{shop.nameEn}</div>
                          <div className="text-slate-500 text-[11px]">
                            <span className="font-mono font-bold text-slate-800">{shop.ardNumber}</span> • {shop.ward}, {shop.taluk}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                shop.isOpen ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span className="font-medium text-slate-800">
                              {shop.isOpen ? 'Open' : 'Closed'}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 text-[11px]">ePOS {shop.eposStatus}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{shop.distanceKm} km away</div>
                          <div className="text-slate-500 text-[11px]">~{shop.queueEstimateMinutes} min queue</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {inStockCount} / {shop.stock.length} in stock
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedShopId(shop.id);
                              setActiveView('SHOP_DETAIL');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Community Observation Action Strip */}
      <section className="bg-gradient-to-r from-blue-50/70 to-slate-50 border border-blue-200/70 p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {isMl ? 'നിങ്ങൾ ഇപ്പോൾ റേഷൻ കടയിലാണോ?' : 'Just Visited Your Local Dealership?'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isMl
              ? 'സ്റ്റോക്ക് തീർന്നതോ പുതിയ ലോഡ് എത്തിയതോ 30 സെക്കൻഡിൽ രേഖപ്പെടുത്തൂ. നിങ്ങളുടെ വിവരം മറ്റുള്ളവരുടെ സമയം ലാഭിക്കും.'
              : 'Submit a quick 30-second ground status report. Entering your ePOS transaction slip number boosts local credibility by +20 points.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('REPORT')}
          className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all rounded-xl shadow-xs shrink-0 self-start sm:self-auto"
        >
          {t('citizenReportTitle')}
        </button>
      </section>

      {/* Interactive GIS Map Modal */}
      <ShopMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelectShop={(id) => {
          setSelectedShopId(id);
          setActiveView('SHOP_DETAIL');
        }}
      />

      {/* Optical Card Scanner Modal */}
      <CardScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onCardDetected={(cardType, shopId) => {
          setSelectedCardType(cardType);
          if (shopId) {
            setSelectedShopId(shopId);
          }
        }}
      />
    </div>
  );
};


import React, { useMemo } from 'react';
import { usePds } from '../context/PdsContext';
import { ShopCard } from '../components/ShopCard';
import { CARD_TYPES } from '../data/seedData';
import { CardType } from '../types';
import {
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  Building,
  Radio,
  MapPin,
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

  // Distinct Taluks
  const taluks = useMemo(() => {
    const set = new Set(shops.map((s) => s.taluk));
    return ['ALL', ...Array.from(set)];
  }, [shops]);

  // Filtered Shops
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      // Taluk filter
      if (selectedTaluk !== 'ALL' && shop.taluk !== selectedTaluk) {
        return false;
      }

      // Search query
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
  }, [shops, selectedTaluk, searchQuery]);

  // Metric summaries
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
      {/* Hero Civic Search Banner */}
      <div className="bg-[#0F2942] text-white border-b border-slate-800 -mx-4 sm:-mx-6 px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-900/80 border border-blue-700 text-blue-200 text-xs font-mono font-medium" style={{ borderRadius: '4px' }}>
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{isMl ? 'തത്സമയ സ്റ്റോക്ക് പരിശോധന' : 'Real-Time PDS Inventory Tracking'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isMl
                ? 'റേഷൻ കടകളിലെ സാധനങ്ങളുടെ ലഭ്യത പരിശോധിക്കുക'
                : 'Know What is in Stock Before Leaving Home'}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isMl
                ? 'നിങ്ങളുടെ സമീപത്തുള്ള റേഷൻ കടകളിൽ അരി, ആട്ട, പഞ്ചസാര, മണ്ണെണ്ണ തുടങ്ങിയവ ലഭ്യമാണോ എന്ന് തത്സമയം അറിയൂ. പുതിയ ലോഡ് എത്തുമ്പോൾ അറിയിപ്പ് നേടൂ.'
                : 'Transparent stock visibility for Kerala cardholders. Check grain, flour, sugar, and kerosene balances backed by official FCI delivery challans and cardholder receipt corroboration.'}
            </p>
          </div>

          {/* Search Bar & Primary Controls */}
          <div className="bg-white p-3 sm:p-4 text-slate-900 shadow-md border border-slate-300" style={{ borderRadius: '6px' }}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="md:col-span-7 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              {/* Taluk Selector */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={selectedTaluk}
                    onChange={(e) => setSelectedTaluk(e.target.value)}
                    aria-label={isMl ? 'താലൂക്ക് തിരഞ്ഞെടുക്കുക' : 'Select Taluk'}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                    style={{ borderRadius: '4px' }}
                  >
                    <option value="ALL">{t('allTaluks')}</option>
                    {taluks.filter((t) => t !== 'ALL').map((taluk) => (
                      <option key={taluk} value={taluk}>
                        {taluk} Taluk
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Citizen report quick button */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setActiveView('REPORT')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors"
                  style={{ borderRadius: '4px' }}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{t('navReport')}</span>
                </button>
              </div>
            </div>

            {/* Card Category Filters */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t('filterByCard')}:
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCardType('ALL')}
                  className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    selectedCardType === 'ALL'
                      ? 'bg-[#0F2942] text-white border-[#0F2942]'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                  style={{ borderRadius: '4px' }}
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition-colors ${
                        isSelected
                          ? 'ring-2 ring-blue-700 shadow-xs'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: card.bgHex,
                        color: card.textHex,
                        borderColor: card.borderHex,
                        borderRadius: '4px',
                      }}
                    >
                      <span
                        className="w-2 h-2 shrink-0 border"
                        style={{ backgroundColor: card.colorHex, borderColor: card.borderHex, borderRadius: '1px' }}
                      />
                      <span>{isMl ? card.nameMl : card.code}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Card description helper */}
              {selectedCardType !== 'ALL' && (
                <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2 border border-slate-200" style={{ borderRadius: '4px' }}>
                  <span className="font-semibold text-slate-800">
                    {CARD_TYPES[selectedCardType]?.nameEn}:
                  </span>{' '}
                  {CARD_TYPES[selectedCardType]?.description}
                </p>
              )}
            </div>
          </div>

          {/* Trust & Freshness Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/80 border border-slate-700 p-3" style={{ borderRadius: '4px' }}>
              <span className="text-slate-400 block text-[11px]">{isMl ? 'റേഷൻ കടകൾ' : 'Active Dealerships'}</span>
              <span className="text-lg font-mono font-bold text-white">{shops.length} ARDs</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-3" style={{ borderRadius: '4px' }}>
              <span className="text-slate-400 block text-[11px]">{isMl ? 'വിതരണത്തിലുള്ള ഇനങ്ങൾ' : 'Items In Stock'}</span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {totalInStock} / {totalStockItems}
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-3" style={{ borderRadius: '4px' }}>
              <span className="text-slate-400 block text-[11px]">{isMl ? 'ശരാശരി വിശ്വാസ്യത' : 'Average Credibility'}</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-mono font-bold text-white">{avgTrustScore}%</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-3" style={{ borderRadius: '4px' }}>
              <span className="text-slate-400 block text-[11px]">{isMl ? 'പരിശോധനാ രീതി' : 'Verification Model'}</span>
              <span className="text-xs font-mono font-semibold text-blue-300">
                Tri-Factor (DC + Crowd)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Shop Listings Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isMl ? 'സമീപത്തെ റേഷൻ കടകൾ' : 'Nearby Authorised Ration Dealers'}
            </h2>
            <p className="text-xs text-slate-500">
              {filteredShops.length}{' '}
              {filteredShops.length === 1 ? 'dealership found' : 'dealerships found in Kottayam grid'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-500" style={{ borderRadius: '1px' }} />
              <span>In Stock</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-amber-500" style={{ borderRadius: '1px' }} />
              <span>Low Stock</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-red-500" style={{ borderRadius: '1px' }} />
              <span>Exhausted</span>
            </span>
          </div>
        </div>

        {filteredShops.length === 0 ? (
          <div className="bg-white border border-slate-300 p-12 text-center space-y-3" style={{ borderRadius: '6px' }}>
            <p className="text-sm text-slate-600">
              {isMl ? 'തിരഞ്ഞെടുത്ത മാനദണ്ഡങ്ങൾക്ക് അനുസൃതമായ കടകൾ ലഭ്യമല്ല.' : 'No ration shops matched your query or taluk filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTaluk('ALL');
                setSelectedCardType('ALL');
              }}
              className="px-4 py-2 text-xs font-semibold text-blue-700 border border-blue-300 hover:bg-blue-50"
              style={{ borderRadius: '4px' }}
            >
              {isMl ? 'തിരയൽ പുനഃക്രമീകരിക്കുക' : 'Reset Search Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
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

      {/* Cardholder Community Reporting Callout */}
      <section className="bg-slate-100 border border-slate-300 p-6 sm:p-8" style={{ borderRadius: '6px' }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-bold text-slate-900">
                {isMl ? 'നിങ്ങൾ ഇപ്പോൾ റേഷൻ കടയിലാണോ?' : 'Just Visited Your Ration Shop?'}
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
              {isMl
                ? 'നിങ്ങൾ വാങ്ങിയ സാധനങ്ങൾ, ബാക്കിയുള്ള സ്റ്റോക്ക്, അല്ലെങ്കിൽ ഇ-പോസ് സെർവർ തടസ്സങ്ങൾ എന്നിവ 30 സെക്കൻഡിനുള്ളിൽ രേഖപ്പെടുത്തൂ. നിങ്ങളുടെ ഒരു റിപ്പോർട്ട് അയൽവാസികൾക്ക് ആവശ്യമില്ലാത്ത യാത്രകൾ ഒഴിവാക്കും.'
                : 'Help elderly cardholders and neighbors avoid futile travel. Enter your quick observation or ePOS transaction number to corroborate physical availability in your village.'}
            </p>
          </div>

          <div className="md:col-span-4 flex md:justify-end">
            <button
              type="button"
              onClick={() => setActiveView('REPORT')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-xs"
              style={{ borderRadius: '4px' }}
            >
              {t('citizenReportTitle')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

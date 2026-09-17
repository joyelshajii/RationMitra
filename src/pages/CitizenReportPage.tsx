import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { CommodityId, CardType, StockStatus } from '../types';
import { CARD_TYPES } from '../data/seedData';
import {
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  History,
  Store,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const CitizenReportPage: React.FC = () => {
  const {
    shops,
    selectedShopId,
    setSelectedShopId,
    addCitizenReport,
    reports,
    language,
    setActiveView,
  } = usePds();

  const isMl = language === 'ml';
  const t = (key: any) => getTranslation(language, key);

  const [shopId, setShopId] = useState<string>(selectedShopId || shops[0]?.id || 'ARD-104');
  const [commodityId, setCommodityId] = useState<CommodityId>('atta');
  const [statusReported, setStatusReported] = useState<StockStatus | 'EPOS_DOWN' | 'LONG_QUEUE'>('IN_STOCK');
  const [cardType, setCardType] = useState<CardType>('PHH_PINK');
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [phoneMasked, setPhoneMasked] = useState<string>('98470');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const selectedShop = shops.find((s) => s.id === shopId) || shops[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCitizenReport({
      shopId,
      commodityId,
      statusReported,
      cardType,
      receiptNumber: receiptNumber.trim() ? receiptNumber.trim() : undefined,
      notes: notes.trim() ? notes.trim() : undefined,
      phoneMasked: `+91 ${phoneMasked}••••`,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReceiptNumber('');
      setNotes('');
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-blue-50 text-blue-800 border border-blue-200" style={{ borderRadius: '3px' }}>
            COMMUNITY REPORTING CONSOLE
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t('citizenReportTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          {t('citizenReportDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 shadow-2xs space-y-5" style={{ borderRadius: '6px' }}>
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center" style={{ borderRadius: '4px' }}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {isMl ? 'വിവരം വിജയകരമായി രേഖപ്പെടുത്തി!' : 'Observation Successfully Logged!'}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {isMl
                  ? 'നിങ്ങളുടെ റിപ്പോർട്ട് പ്രാദേശിക ഡാറ്റാബേസിൽ ചേർത്തു. വിശ്വാസ്യത സ്കോർ പുതുക്കിയിട്ടുണ്ട്.'
                  : 'Your ground observation has been factored into the live stock calculation and audit log.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShopId(shopId);
                    setActiveView('SHOP_DETAIL');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow-xs"
                  style={{ borderRadius: '4px' }}
                >
                  {isMl ? 'ഈ കടയിലെ പുതിയ സ്റ്റോക്ക് കാണുക' : 'View Updated Dealership Stock'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Step 1: Shop and Item Selection */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  1. Location &amp; Item Observed
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isMl ? 'റേഷൻ കട' : 'Authorised Dealership'}
                    </label>
                    <select
                      value={shopId}
                      onChange={(e) => setShopId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 text-xs bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                      style={{ borderRadius: '4px' }}
                    >
                      {shops.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.ardNumber} • {s.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isMl ? 'സാധനം' : 'Commodity'}
                    </label>
                    <select
                      value={commodityId}
                      onChange={(e) => setCommodityId(e.target.value as CommodityId)}
                      className="w-full px-3 py-2 border border-slate-300 text-xs bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                      style={{ borderRadius: '4px' }}
                    >
                      {selectedShop.stock.map((item) => (
                        <option key={item.id} value={item.id}>
                          {isMl ? item.nameMl : item.nameEn} ({item.status})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Ground Status Tiles */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  2. Ground Availability Observed
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`flex items-start gap-2.5 p-3 border cursor-pointer transition-all ${
                      statusReported === 'IN_STOCK'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="IN_STOCK"
                      checked={statusReported === 'IN_STOCK'}
                      onChange={() => setStatusReported('IN_STOCK')}
                      className="mt-0.5 text-emerald-600"
                    />
                    <div>
                      <span className="font-bold block">{isMl ? 'ലഭ്യമാണ് & വിതരണം ചെയ്യുന്നു' : 'In Stock & Distributing'}</span>
                      <span className="text-[10px] text-slate-500 font-normal">Active counter distribution</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 border cursor-pointer transition-all ${
                      statusReported === 'EXHAUSTED'
                        ? 'border-red-600 bg-red-50/60 text-red-950 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="EXHAUSTED"
                      checked={statusReported === 'EXHAUSTED'}
                      onChange={() => setStatusReported('EXHAUSTED')}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <span className="font-bold block">{isMl ? 'സ്റ്റോക്ക് തീർന്നു' : 'Exhausted / No Stock'}</span>
                      <span className="text-[10px] text-slate-500 font-normal">Counter ran out of bags</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 border cursor-pointer transition-all ${
                      statusReported === 'LOW_STOCK'
                        ? 'border-amber-600 bg-amber-50/60 text-amber-950 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="LOW_STOCK"
                      checked={statusReported === 'LOW_STOCK'}
                      onChange={() => setStatusReported('LOW_STOCK')}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <span className="font-bold block">{isMl ? 'അളവ് കുറവാണ് (< 20%)' : 'Low Stock (< 20% left)'}</span>
                      <span className="text-[10px] text-slate-500 font-normal">Only a few sacks remain</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 border cursor-pointer transition-all ${
                      statusReported === 'EPOS_DOWN'
                        ? 'border-red-600 bg-red-50/60 text-red-950 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="EPOS_DOWN"
                      checked={statusReported === 'EPOS_DOWN'}
                      onChange={() => setStatusReported('EPOS_DOWN')}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <span className="font-bold block">{isMl ? 'ഇ-പോസ് സെർവർ ഡൗൺ' : 'ePOS Terminal Down'}</span>
                      <span className="text-[10px] text-slate-500 font-normal">Biometrics failure / offline</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 3: Card Category */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  3. Your Cardholder Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(CARD_TYPES).map((card) => (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => setCardType(card.type)}
                      className={`p-2 border text-left transition-all ${
                        cardType === card.type ? 'ring-2 ring-blue-700 shadow-2xs font-bold' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: card.bgHex,
                        color: card.textHex,
                        borderColor: card.borderHex,
                        borderRadius: '4px',
                      }}
                    >
                      <span className="block font-bold">{card.code}</span>
                      <span className="text-[10px] block truncate">{isMl ? card.nameMl.split(' ')[0] : card.nameEn.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Verification Corroboration */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 space-y-2" style={{ borderRadius: '4px' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Receipt className="w-4 h-4 text-emerald-700" />
                    <span>ePOS Transaction Slip No. (High Trust Bonus)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 font-bold" style={{ borderRadius: '2px' }}>
                    +20 Trust Points
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Entering your paper receipt slip number validates this as a physical counter transaction.
                </p>
                <input
                  type="text"
                  placeholder="e.g. TXN-KL-EPOS-99412"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 border border-slate-300 text-xs font-mono bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              {/* Step 5: Anti-Spam & Notes */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isMl ? 'കുറിപ്പുകൾ' : 'Optional Notes / Context'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Around 10 cardholders in queue; dealer says atta truck unloading"
                    className="w-full px-3 py-2 border border-slate-300 text-xs bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                    style={{ borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    First 5 Digits of Your Phone (Anti-Spam Throttling)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1.5 bg-slate-100 border border-slate-300 text-xs font-mono text-slate-600" style={{ borderRadius: '4px' }}>
                      +91
                    </span>
                    <input
                      type="text"
                      maxLength={5}
                      pattern="[0-9]{5}"
                      value={phoneMasked}
                      onChange={(e) => setPhoneMasked(e.target.value.replace(/\D/g, ''))}
                      className="w-28 px-3 py-1.5 border border-slate-300 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                      style={{ borderRadius: '4px' }}
                    />
                    <span className="text-xs font-mono text-slate-400">•••• (Protected)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-xs"
                  style={{ borderRadius: '4px' }}
                >
                  {isMl ? 'സ്റ്റോക്ക് വിവരം സമർപ്പിക്കുക' : 'Submit Ground Observation'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar: Credibility Guardrails & Activity Stream */}
        <div className="lg:col-span-5 space-y-6">
          {/* Trust Scoring Guardrails */}
          <div className="bg-white border border-slate-200 p-5 shadow-2xs space-y-3" style={{ borderRadius: '6px' }}>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Anti-Disinformation Guardrails</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 mt-1.5 rounded-full shrink-0" />
                <span>
                  <strong>Challan Primacy:</strong> Godown Delivery Challans log 40 base points.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-600 mt-1.5 rounded-full shrink-0" />
                <span>
                  <strong>Receipt Corroboration:</strong> Valid ePOS transaction slips add verified weight.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 rounded-full shrink-0" />
                <span>
                  <strong>Dispute Threshold:</strong> 2+ counter-reports flag dealership inventory as "Disputed" and alerts the Taluk Supply Office.
                </span>
              </li>
            </ul>
          </div>

          {/* Live Community Stream */}
          <div className="bg-white border border-slate-200 p-5 shadow-2xs space-y-3" style={{ borderRadius: '6px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <History className="w-4 h-4 text-blue-700" />
                <span>Live Community Audit Stream</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Real-time</span>
            </div>

            {reports.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No observations recorded in this browser session yet.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {reports.slice(0, 6).map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 bg-slate-50 border border-slate-200 text-xs space-y-1"
                    style={{ borderRadius: '4px' }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-900">{rep.shopName.split('-')[0]}</span>
                      <span className="text-slate-400 font-mono">
                        {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rep.commodityName}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700" style={{ borderRadius: '2px' }}>
                        {rep.statusReported}
                      </span>
                    </div>
                    {rep.notes && <p className="text-slate-600 text-[11px]">{rep.notes}</p>}
                    <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-0.5">
                      <span>Card: {rep.cardType.split('_')[0]}</span>
                      <span className="text-emerald-700 font-bold tabular-nums">+{rep.trustScoreAssigned} trust</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

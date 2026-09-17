import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { CommodityId, CardType, StockStatus } from '../types';
import { CARD_TYPES } from '../data/seedData';
import {
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  AlertTriangle,
  History,
  Lock,
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
      // Reset form fields
      setReceiptNumber('');
      setNotes('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-300 p-6 shadow-xs" style={{ borderRadius: '6px' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200" style={{ borderRadius: '4px' }}>
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {t('citizenReportTitle')}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {t('citizenReportDesc')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white border border-slate-300 p-6 shadow-xs" style={{ borderRadius: '6px' }}>
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center" style={{ borderRadius: '4px' }}>
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {isMl ? 'വിവരം വിജയകരമായി രേഖപ്പെടുത്തി!' : 'Observation Successfully Logged!'}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {isMl
                  ? 'നിങ്ങളുടെ റിപ്പോർട്ട് പ്രാദേശിക ഡാറ്റാബേസിൽ ഉൾപ്പെടുത്തി. വിശ്വാസ്യത സ്കോർ പുതുക്കിയിട്ടുണ്ട്.'
                  : 'Your observation has updated the live stock status and credibility rating for this dealership.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShopId(shopId);
                    setActiveView('SHOP_DETAIL');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800"
                  style={{ borderRadius: '4px' }}
                >
                  {isMl ? 'ഈ കടയിലെ പുതിയ സ്റ്റോക്ക് കാണുക' : 'View Updated Dealership Stock'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Select Shop */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isMl ? 'റേഷൻ കട തിരഞ്ഞെടുക്കുക' : 'Select Authorised Ration Dealership (ARD)'}
                </label>
                <select
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.ardNumber} • {s.nameEn} ({s.ward}, {s.taluk})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Commodity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isMl ? 'നിരീക്ഷിച്ച സാധനം' : 'Commodity Observed'}
                </label>
                <select
                  value={commodityId}
                  onChange={(e) => setCommodityId(e.target.value as CommodityId)}
                  className="w-full px-3 py-2 border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                >
                  {selectedShop.stock.map((item) => (
                    <option key={item.id} value={item.id}>
                      {isMl ? item.nameMl : item.nameEn} (Current: {item.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Observed Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isMl ? 'നിങ്ങൾ കണ്ട അവസ്ഥ' : 'Observed Ground Status'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors ${
                      statusReported === 'IN_STOCK'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="IN_STOCK"
                      checked={statusReported === 'IN_STOCK'}
                      onChange={() => setStatusReported('IN_STOCK')}
                      className="text-emerald-600"
                    />
                    <span>{isMl ? 'ലഭ്യമാണ് & വിതരണം ചെയ്യുന്നു' : 'In Stock & Distributing'}</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors ${
                      statusReported === 'EXHAUSTED'
                        ? 'border-red-600 bg-red-50 text-red-950 font-semibold'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="EXHAUSTED"
                      checked={statusReported === 'EXHAUSTED'}
                      onChange={() => setStatusReported('EXHAUSTED')}
                      className="text-red-600"
                    />
                    <span>{isMl ? 'സ്റ്റോക്ക് തീർന്നു' : 'Exhausted / No Stock'}</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors ${
                      statusReported === 'LOW_STOCK'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="LOW_STOCK"
                      checked={statusReported === 'LOW_STOCK'}
                      onChange={() => setStatusReported('LOW_STOCK')}
                      className="text-amber-600"
                    />
                    <span>{isMl ? 'അളവ് കുറവാണ് (< 20%)' : 'Low Stock (< 20% left)'}</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors ${
                      statusReported === 'EPOS_DOWN'
                        ? 'border-red-600 bg-red-50 text-red-950 font-semibold'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="EPOS_DOWN"
                      checked={statusReported === 'EPOS_DOWN'}
                      onChange={() => setStatusReported('EPOS_DOWN')}
                      className="text-red-600"
                    />
                    <span>{isMl ? 'ഇ-പോസ് മെഷീൻ സെർവർ ഡൗൺ' : 'ePOS Terminal Down'}</span>
                  </label>
                </div>
              </div>

              {/* Cardholder Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isMl ? 'നിങ്ങളുടെ റേഷൻ കാർഡ് തരം' : 'Your Ration Card Category'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(CARD_TYPES).map((card) => (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => setCardType(card.type)}
                      className={`px-2.5 py-1.5 text-xs font-bold border transition-colors ${
                        cardType === card.type ? 'ring-2 ring-blue-700' : 'opacity-75 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: card.bgHex,
                        color: card.textHex,
                        borderColor: card.borderHex,
                        borderRadius: '4px',
                      }}
                    >
                      {card.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Proof: ePOS Receipt Slip */}
              <div className="p-3.5 bg-slate-50 border border-slate-300 space-y-2" style={{ borderRadius: '4px' }}>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <span>{isMl ? 'റസീറ്റ് സ്ഥിരീകരണം (ഓപ്ഷണൽ - വിശ്വാസ്യത കൂട്ടും)' : 'ePOS Transaction Slip No. (High Trust Corroboration)'}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Entering your paper receipt or transaction number marks this report as verified physical visit, granting +20 trust points.
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

              {/* Observation Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isMl ? 'കുറിപ്പുകൾ (ഓപ്ഷണൽ)' : 'Additional Notes / Timestamps'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isMl ? 'ഉദാ: കടയിൽ 10 പേരുടെ ക്യൂ ഉണ്ട്, ആട്ട 1 മണിക്ക് എത്തി.' : 'e.g. Around 12 cardholders in queue; dealer says atta truck unloading.'}
                  className="w-full px-3 py-2 border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              {/* Anti-Spam Masked Mobile */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isMl ? 'ഫോൺ നമ്പറിന്റെ ആദ്യ 5 അക്കങ്ങൾ (ആന്റി-സ്പാം വെരിഫിക്കേഷൻ)' : 'First 5 digits of your mobile (Anti-Spam Verification)'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-2 bg-slate-100 border border-slate-300 text-xs font-mono text-slate-600" style={{ borderRadius: '4px' }}>
                    +91
                  </span>
                  <input
                    type="text"
                    maxLength={5}
                    pattern="[0-9]{5}"
                    value={phoneMasked}
                    onChange={(e) => setPhoneMasked(e.target.value.replace(/\D/g, ''))}
                    className="w-32 px-3 py-2 border border-slate-300 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    style={{ borderRadius: '4px' }}
                  />
                  <span className="text-xs font-mono text-slate-400">•••• (Protected)</span>
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

        {/* Sidebar: Credibility Guardrails & Recent Stream */}
        <div className="lg:col-span-5 space-y-6">
          {/* How Trustworthiness is Enforced */}
          <div className="bg-white border border-slate-300 p-5 shadow-xs space-y-3" style={{ borderRadius: '6px' }}>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isMl ? 'ഡാറ്റാ വിശ്വാസ്യത ഉറപ്പാക്കുന്ന വിധം' : 'Credibility & Anti-Misinformation Engine'}</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 mt-1.5 shrink-0" style={{ borderRadius: '1px' }} />
                <span>
                  <strong>Delivery Challan Primacy:</strong> Dealer logged Supplyco/FCI receipts have baseline 40% weight.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-600 mt-1.5 shrink-0" style={{ borderRadius: '1px' }} />
                <span>
                  <strong>Receipt Corroboration:</strong> Citizen reports with transaction numbers add verified consensus points.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 shrink-0" style={{ borderRadius: '1px' }} />
                <span>
                  <strong>Discrepancy Escrow:</strong> If 2+ cardholders report stock exhaustion while dealer claims available, status switches to "Disputed" and flags the Taluk Supply Officer.
                </span>
              </li>
            </ul>
          </div>

          {/* Recent Live Citizen Reports Stream */}
          <div className="bg-white border border-slate-300 p-5 shadow-xs space-y-3" style={{ borderRadius: '6px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <History className="w-4 h-4 text-blue-700" />
                <span>{isMl ? 'സമീപകാല പൊതുജന റിപ്പോർട്ടുകൾ' : 'Live Community Audit Stream'}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Real-time</span>
            </div>

            {reports.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No citizen observations recorded in this session yet.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {reports.slice(0, 6).map((rep) => (
                  <div
                    key={rep.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 text-xs space-y-1"
                    style={{ borderRadius: '4px' }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800">{rep.shopName.split('-')[0]}</span>
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
                      <span className="text-emerald-700 font-bold">+{rep.trustScoreAssigned} trust</span>
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

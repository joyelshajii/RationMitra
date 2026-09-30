import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { CommodityId } from '../types';
import {
  KeyRound,
  Truck,
  CheckCircle2,
  AlertCircle,
  Layers,
  Save,
  LogOut,
  Radio,
  Wifi,
  DoorOpen,
  Send,
  ShieldCheck,
  Building2,
  BellRing,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const DealerPortalPage: React.FC = () => {
  const {
    shops,
    updateDealerStock,
    toggleShopOpenStatus,
    updateEposHealth,
    subscriptions,
    language,
  } = usePds();

  const isMl = language === 'ml';
  const t = (key: any) => getTranslation(language, key);

  // Auth State
  const [selectedArdId, setSelectedArdId] = useState<string>('ARD-104');
  const [pin, setPin] = useState<string>('1040');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Shipment Form
  const [shipmentCommodity, setShipmentCommodity] = useState<CommodityId>('atta');
  const [shipmentQty, setShipmentQty] = useState<number>(200);
  const [challanNo, setChallanNo] = useState<string>('DC-KL-FCI-2026-98440');
  const [godownSource, setGodownSource] = useState<string>('Supplyco Ponkunnam Central Godown');
  const [shipmentSuccess, setShipmentSuccess] = useState<boolean>(false);

  // Counter edits
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  const activeShop = shops.find((s) => s.id === selectedArdId) || shops[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeShop && pin === activeShop.dealerPin) {
      setIsAuthenticated(true);
      setAuthError(null);
      const initialEdits: Record<string, number> = {};
      activeShop.stock.forEach((item) => {
        initialEdits[item.id] = item.quantityAvailable;
      });
      setStockEdits(initialEdits);
    } else {
      setAuthError(
        isMl
          ? 'തെറ്റായ സുരക്ഷാ പിൻ. ദയവായി വീണ്ടും ശ്രമിക്കുക (ഡെമോ പിൻ: 1040).'
          : 'Invalid Dealer PIN. Check test credentials (Demo PIN for ARD 104 is 1040).'
      );
    }
  };

  const handleLogShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challanNo.trim() || shipmentQty <= 0) {
      alert('Please provide valid delivery challan and quantity.');
      return;
    }

    updateDealerStock(
      activeShop.id,
      shipmentCommodity,
      shipmentQty,
      challanNo.trim(),
      `FCI Inward Delivery via ${godownSource}`
    );

    setShipmentSuccess(true);
    setTimeout(() => {
      setShipmentSuccess(false);
    }, 3500);
  };

  const handleSaveStockAdjustment = (commodityId: CommodityId) => {
    const newQty = stockEdits[commodityId];
    if (newQty === undefined || newQty < 0) return;

    updateDealerStock(
      activeShop.id,
      commodityId,
      newQty,
      undefined,
      'Physical counter stock count verified by dealer'
    );
    alert(isMl ? 'സ്റ്റോക്ക് അളവ് വിജയകരമായി പുതുക്കി.' : 'Stock balance updated successfully.');
  };

  const activeSubsForShop = subscriptions.filter(
    (s) => s.shopId === activeShop.id || s.shopId === 'ANY_NEARBY'
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>ARD DEALERSHIP CONSOLE</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            Civil Supplies Department, Govt. of Kerala
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t('dealerLoginTitle')}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          {t('dealerLoginDesc')}
        </p>
      </div>

      {!isAuthenticated ? (
        /* Dealer PIN Authentication Terminal */
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Dealer Authentication</h2>
              <p className="text-xs text-slate-500">Enter licensed ARD credentials to proceed</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Quick Demo Testing Credentials:</span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 pl-5">
              ARD 104 PIN: <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">1040</span> • ARD 118 PIN:{' '}
              <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">1180</span>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
                {isMl ? 'റേഷൻ കട തിരഞ്ഞെടുക്കുക' : 'Select Authorised Dealership'}
              </label>
              <select
                value={selectedArdId}
                onChange={(e) => {
                  setSelectedArdId(e.target.value);
                  const shp = shops.find((s) => s.id === e.target.value);
                  if (shp) setPin(shp.dealerPin);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
              >
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.ardNumber} • {s.nameEn} ({s.licensee})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
                {isMl ? '4-അക്ക ഡീലർ സുരക്ഷാ പിൻ' : '4-Digit Dealer Security PIN'}
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-lg font-mono tracking-widest text-center bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                placeholder="••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isMl ? 'ഡീലർ പോർട്ടലിൽ പ്രവേശിക്കുക' : 'Authenticate Terminal Access'}</span>
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Management Console */
        <div className="space-y-6">
          {/* Active Terminal Info Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold bg-[#0C1E33] text-white">
                  {activeShop.ardNumber}
                </span>
                <span className="text-base font-bold text-slate-900">
                  {activeShop.nameEn}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Licensee: <span className="font-semibold text-slate-800">{activeShop.licensee}</span> • {activeShop.ward}, {activeShop.taluk}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right text-xs font-mono text-slate-500 hidden sm:block bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-1.5">
                <span className="text-emerald-700 font-bold tabular-nums">{activeSubsForShop.length} households</span> subscribed to alerts
              </div>

              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Master Switchboard: Door & ePOS Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Door Switch */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Counter Distribution Gate
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleShopOpenStatus(activeShop.id, true)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    activeShop.isOpen
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isMl ? 'തുറന്നിരിക്കുന്നു' : 'Open for Distribution'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleShopOpenStatus(activeShop.id, false)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    !activeShop.isOpen
                      ? 'bg-red-600 text-white border-red-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isMl ? 'അടച്ചിരിക്കുന്നു' : 'Closed'}
                </button>
              </div>
            </div>

            {/* ePOS Health Switch */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Biometric ePOS Connectivity State
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'ONLINE')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    activeShop.eposStatus === 'ONLINE'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Online
                </button>

                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'SLOW')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    activeShop.eposStatus === 'SLOW'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Slow Latency
                </button>

                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'OFFLINE')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    activeShop.eposStatus === 'OFFLINE'
                      ? 'bg-red-600 text-white border-red-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Server Down
                </button>
              </div>
            </div>
          </div>

          {/* Inbound Shipment Logger with Broadcast Trigger */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Log Inbound Consignment &amp; Trigger Arrival Broadcast
                  </h2>
                  <p className="text-xs text-slate-500">Record incoming stock from central FCI / Supplyco godowns</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <BellRing className="w-3.5 h-3.5" />
                <span>Instant Alert Trigger</span>
              </span>
            </div>

            {shipmentSuccess && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Shipment logged and verified!</div>
                  <p className="text-emerald-900 mt-0.5">
                    Stock status updated to "In Stock" with high-trust delivery challan. Automated SMS &amp; Web alerts broadcasted to all registered cardholders.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogShipment} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Commodity Received
                </label>
                <select
                  value={shipmentCommodity}
                  onChange={(e) => setShipmentCommodity(e.target.value as CommodityId)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                >
                  {activeShop.stock.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nameEn} ({item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  New Available Balance
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={shipmentQty}
                  onChange={(e) => setShipmentQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Delivery Challan (DC) No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DC-FCI-2026-98440"
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono uppercase bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Issuing Godown Depot
                </label>
                <input
                  type="text"
                  value={godownSource}
                  onChange={(e) => setGodownSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4 pt-1">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isMl
                      ? 'ചെല്ലാൻ രേഖപ്പെടുത്തുക & കാർഡുടമകൾക്ക് അറിയിപ്പ് അയക്കുക'
                      : 'Record Delivery Challan & Dispatch Instant Arrival Alerts'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Physical Counter Adjustments */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isMl ? 'കൗണ്ടർ സ്റ്റോക്ക് മാറ്റങ്ങൾ' : 'Counter Physical Stock Count Adjustments'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust balance after daily biometric distribution reconciliation
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 text-xs overflow-hidden">
              {activeShop.stock.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{item.nameEn}</div>
                    <div className="text-xs text-slate-500">
                      Threshold Alert: <span className="font-mono">{item.thresholdLow} {item.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <input
                      type="number"
                      min={0}
                      value={stockEdits[item.id] !== undefined ? stockEdits[item.id] : item.quantityAvailable}
                      onChange={(e) =>
                        setStockEdits({ ...stockEdits, [item.id]: Number(e.target.value) })
                      }
                      className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs text-right bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none tabular-nums"
                    />
                    <span className="text-xs text-slate-500 font-mono w-16">{item.unit}</span>
                    <button
                      type="button"
                      onClick={() => handleSaveStockAdjustment(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      <Save className="w-3.5 h-3.5 text-slate-500" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

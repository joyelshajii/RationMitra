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
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-slate-900 text-white" style={{ borderRadius: '3px' }}>
            DEALERSHIP CONSOLE
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t('dealerLoginTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          {t('dealerLoginDesc')}
        </p>
      </div>

      {!isAuthenticated ? (
        /* Dealer PIN Authentication Terminal */
        <div className="max-w-md mx-auto bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-5" style={{ borderRadius: '6px' }}>
          <div className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-700" style={{ borderRadius: '4px' }}>
            <span className="font-bold text-slate-900 block mb-0.5">Quick Testing Credentials:</span>
            <div className="font-mono text-[11px] text-slate-600">
              ARD 104 PIN: <span className="font-bold text-slate-900">1040</span> • ARD 118 PIN:{' '}
              <span className="font-bold text-slate-900">1180</span>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2" style={{ borderRadius: '4px' }}>
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isMl ? 'റേഷൻ കട തിരഞ്ഞെടുക്കുക' : 'Select Authorised Dealership'}
              </label>
              <select
                value={selectedArdId}
                onChange={(e) => {
                  setSelectedArdId(e.target.value);
                  const shp = shops.find((s) => s.id === e.target.value);
                  if (shp) setPin(shp.dealerPin);
                }}
                className="w-full px-3 py-2 border border-slate-300 text-xs bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                style={{ borderRadius: '4px' }}
              >
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.ardNumber} • {s.nameEn} ({s.licensee})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isMl ? '4-അക്ക ഡീലർ സുരക്ഷാ പിൻ' : '4-Digit Dealer Security PIN'}
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 text-base font-mono tracking-widest text-center bg-white focus:border-blue-600 focus:outline-none"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0C1E33] hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
              style={{ borderRadius: '4px' }}
            >
              {isMl ? 'ഡീലർ പോർട്ടലിൽ പ്രവേശിക്കുക' : 'Authenticate Terminal Access'}
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Management Console */
        <div className="space-y-6">
          {/* Active Terminal Info Bar */}
          <div className="bg-white border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderRadius: '6px' }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 font-mono text-xs font-bold bg-[#0C1E33] text-white" style={{ borderRadius: '3px' }}>
                  {activeShop.ardNumber}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {activeShop.nameEn}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Licensee: <span className="font-semibold text-slate-800">{activeShop.licensee}</span> • {activeShop.ward}, {activeShop.taluk}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right text-xs font-mono text-slate-500 hidden sm:block">
                <span className="text-emerald-700 font-bold tabular-nums">{activeSubsForShop.length} households</span> subscribed to arrival alerts
              </div>

              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Master Switchboard: Door & ePOS Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Door Switch */}
            <div className="bg-white border border-slate-200 p-4 shadow-2xs space-y-2" style={{ borderRadius: '6px' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Counter Distribution Gate
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleShopOpenStatus(activeShop.id, true)}
                  className={`flex-1 py-2 text-xs font-bold border transition-all ${
                    activeShop.isOpen
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {isMl ? 'തുറന്നിരിക്കുന്നു' : 'Open for Distribution'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleShopOpenStatus(activeShop.id, false)}
                  className={`flex-1 py-2 text-xs font-bold border transition-all ${
                    !activeShop.isOpen
                      ? 'bg-red-700 text-white border-red-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {isMl ? 'അടച്ചിരിക്കുന്നു' : 'Closed'}
                </button>
              </div>
            </div>

            {/* ePOS Health Switch */}
            <div className="bg-white border border-slate-200 p-4 shadow-2xs space-y-2" style={{ borderRadius: '6px' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Biometric ePOS Connectivity State
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'ONLINE')}
                  className={`py-2 text-[11px] font-bold border transition-all ${
                    activeShop.eposStatus === 'ONLINE'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  Online
                </button>

                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'SLOW')}
                  className={`py-2 text-[11px] font-bold border transition-all ${
                    activeShop.eposStatus === 'SLOW'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  Slow Latency
                </button>

                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'OFFLINE')}
                  className={`py-2 text-[11px] font-bold border transition-all ${
                    activeShop.eposStatus === 'OFFLINE'
                      ? 'bg-red-700 text-white border-red-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  Server Down
                </button>
              </div>
            </div>
          </div>

          {/* Inbound Shipment Logger with Broadcast Trigger */}
          <div className="bg-white border border-slate-200 p-6 shadow-2xs space-y-4" style={{ borderRadius: '6px' }}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Log Inbound Godown Consignment &amp; Trigger Arrival Broadcast
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200" style={{ borderRadius: '3px' }}>
                Instant Alert Trigger
              </span>
            </div>

            {shipmentSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-3" style={{ borderRadius: '4px' }}>
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
                <label className="block font-semibold text-slate-700 mb-1">
                  Commodity Received
                </label>
                <select
                  value={shipmentCommodity}
                  onChange={(e) => setShipmentCommodity(e.target.value as CommodityId)}
                  className="w-full px-3 py-2 border border-slate-300 text-xs bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                >
                  {activeShop.stock.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nameEn} ({item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Available Balance
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={shipmentQty}
                  onChange={(e) => setShipmentQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 text-xs font-mono bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery Challan (DC) No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DC-FCI-2026-98440"
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 text-xs font-mono bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Issuing Godown Depot
                </label>
                <input
                  type="text"
                  value={godownSource}
                  onChange={(e) => setGodownSource(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 text-xs bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  style={{ borderRadius: '4px' }}
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
          <div className="bg-white border border-slate-200 p-6 shadow-2xs space-y-4" style={{ borderRadius: '6px' }}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isMl ? 'കൗണ്ടർ സ്റ്റോക്ക് മാറ്റങ്ങൾ' : 'Counter Physical Stock Count Adjustments'}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Adjust balance after daily biometric distribution reconciliation
              </span>
            </div>

            <div className="border border-slate-200 divide-y divide-slate-100 text-xs" style={{ borderRadius: '4px' }}>
              {activeShop.stock.map((item) => (
                <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{item.nameEn}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Threshold Alert: {item.thresholdLow} {item.unit}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={stockEdits[item.id] !== undefined ? stockEdits[item.id] : item.quantityAvailable}
                      onChange={(e) =>
                        setStockEdits({ ...stockEdits, [item.id]: Number(e.target.value) })
                      }
                      className="w-24 px-2.5 py-1.5 border border-slate-300 font-mono text-xs text-right bg-white focus:border-blue-600 focus:outline-none tabular-nums"
                      style={{ borderRadius: '4px' }}
                    />
                    <span className="text-xs text-slate-500 font-mono w-16">{item.unit}</span>
                    <button
                      type="button"
                      onClick={() => handleSaveStockAdjustment(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                      style={{ borderRadius: '4px' }}
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

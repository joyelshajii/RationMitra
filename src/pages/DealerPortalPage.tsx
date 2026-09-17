import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { CommodityId } from '../types';
import {
  KeyRound,
  Store,
  Truck,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Bell,
  Layers,
  Save,
  LogOut,
  Radio,
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

  // Authentication State
  const [selectedArdId, setSelectedArdId] = useState<string>('ARD-104');
  const [pin, setPin] = useState<string>('1040');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form states
  const [shipmentCommodity, setShipmentCommodity] = useState<CommodityId>('atta');
  const [shipmentQty, setShipmentQty] = useState<number>(200);
  const [challanNo, setChallanNo] = useState<string>('DC-KL-FCI-2026-98440');
  const [godownSource, setGodownSource] = useState<string>('Supplyco Ponkunnam Central Godown');
  const [shipmentSuccess, setShipmentSuccess] = useState<boolean>(false);

  // Quick edit stock values state
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  const activeShop = shops.find((s) => s.id === selectedArdId) || shops[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeShop && pin === activeShop.dealerPin) {
      setIsAuthenticated(true);
      setAuthError(null);
      // Initialize edit values
      const initialEdits: Record<string, number> = {};
      activeShop.stock.forEach((item) => {
        initialEdits[item.id] = item.quantityAvailable;
      });
      setStockEdits(initialEdits);
    } else {
      setAuthError(
        isMl
          ? 'തെറ്റായ സുരക്ഷാ പിൻ. ദയവായി വീണ്ടും ശ്രമിക്കുക (ഡെമോ പിൻ: 1040).'
          : 'Invalid Dealer PIN. Please check credentials (Demo PIN for ARD 104 is 1040).'
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

  // Subscriptions targeting this shop
  const activeSubsForShop = subscriptions.filter(
    (s) => s.shopId === activeShop.id || s.shopId === 'ANY_NEARBY'
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-white border border-slate-300 p-6 shadow-xs" style={{ borderRadius: '6px' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F2942] text-amber-400 flex items-center justify-center border border-slate-700" style={{ borderRadius: '4px' }}>
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {t('dealerLoginTitle')}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {t('dealerLoginDesc')}
            </p>
          </div>
        </div>
      </div>

      {!isAuthenticated ? (
        /* Login Card */
        <div className="max-w-md mx-auto bg-white border border-slate-300 p-6 shadow-xs space-y-5" style={{ borderRadius: '6px' }}>
          <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-900" style={{ borderRadius: '4px' }}>
            <span className="font-bold">Evaluation Testing Credentials:</span>
            <div className="mt-1 font-mono text-[11px] text-blue-800">
              ARD 104 PIN: <span className="font-bold">1040</span> • ARD 118 PIN: <span className="font-bold">1180</span>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2" style={{ borderRadius: '4px' }}>
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMl ? 'റേഷൻ കട തിരഞ്ഞെടുക്കുക' : 'Select Dealership'}
              </label>
              <select
                value={selectedArdId}
                onChange={(e) => {
                  setSelectedArdId(e.target.value);
                  const shp = shops.find((s) => s.id === e.target.value);
                  if (shp) setPin(shp.dealerPin);
                }}
                className="w-full px-3 py-2 border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMl ? '4-അക്ക ഡീലർ സുരക്ഷാ പിൻ' : '4-Digit Dealer Security PIN'}
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 text-sm font-mono tracking-widest bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none text-center"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0F2942] hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
              style={{ borderRadius: '4px' }}
            >
              {isMl ? 'ഡീലർ പോർട്ടലിൽ പ്രവേശിക്കുക' : 'Authenticate & Access ARD Console'}
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Dealer Dashboard */
        <div className="space-y-6">
          {/* Active Shop Profile Bar */}
          <div className="bg-white border border-slate-300 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderRadius: '6px' }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 font-mono text-xs font-bold bg-[#0F2942] text-white" style={{ borderRadius: '3px' }}>
                  {activeShop.ardNumber}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {activeShop.nameEn}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Licensee: <span className="font-semibold">{activeShop.licensee}</span> • {activeShop.ward}, {activeShop.taluk}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs font-mono text-slate-500 hidden sm:block">
                <span>{activeSubsForShop.length} households subscribed to alerts</span>
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

          {/* Operational Controls: Open/Close & ePOS Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Door Status Toggle */}
            <div className="bg-white border border-slate-300 p-4 shadow-xs" style={{ borderRadius: '6px' }}>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                {isMl ? 'റേഷൻ കട വിതരണ നില' : 'Counter Door Status'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleShopOpenStatus(activeShop.id, true)}
                  className={`flex-1 py-2 text-xs font-bold border transition-colors ${
                    activeShop.isOpen
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {isMl ? 'തുറന്നിരിക്കുന്നു' : 'Open for Distribution'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleShopOpenStatus(activeShop.id, false)}
                  className={`flex-1 py-2 text-xs font-bold border transition-colors ${
                    !activeShop.isOpen
                      ? 'bg-red-600 text-white border-red-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {isMl ? 'അടച്ചിരിക്കുന്നു' : 'Closed'}
                </button>
              </div>
            </div>

            {/* ePOS Connectivity Toggle */}
            <div className="bg-white border border-slate-300 p-4 shadow-xs" style={{ borderRadius: '6px' }}>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                {isMl ? 'ഇ-പോസ് സെർവർ നില' : 'ePOS Machine Terminal State'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'ONLINE')}
                  className={`py-2 text-[11px] font-bold border transition-colors ${
                    activeShop.eposStatus === 'ONLINE'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  Online
                </button>

                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'SLOW')}
                  className={`py-2 text-[11px] font-bold border transition-colors ${
                    activeShop.eposStatus === 'SLOW'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  Slow Latency
                </button>

                <button
                  type="button"
                  onClick={() => updateEposHealth(activeShop.id, 'OFFLINE')}
                  className={`py-2 text-[11px] font-bold border transition-colors ${
                    activeShop.eposStatus === 'OFFLINE'
                      ? 'bg-red-600 text-white border-red-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  Server Down
                </button>
              </div>
            </div>
          </div>

          {/* Inbound Shipment & Delivery Challan Logger */}
          <div className="bg-white border border-slate-300 p-6 shadow-xs space-y-4" style={{ borderRadius: '6px' }}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-bold text-slate-900">
                  {isMl ? 'പുതിയ ലോഡ് വരവ് & ചലാൻ രേഖപ്പെടുത്തുക' : 'Log Inbound Godown Delivery & Broadcast Stock Arrival'}
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200" style={{ borderRadius: '2px' }}>
                Instant Alert Trigger
              </span>
            </div>

            {shipmentSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-start gap-3" style={{ borderRadius: '4px' }}>
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Shipment logged and verified!</div>
                  <p className="mt-0.5 text-emerald-800">
                    Stock status updated to "In Stock" with high-trust delivery challan. Automated SMS & Web alerts broadcasted to all registered cardholders.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogShipment} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commodity Received
                </label>
                <select
                  value={shipmentCommodity}
                  onChange={(e) => setShipmentCommodity(e.target.value as CommodityId)}
                  className="w-full px-3 py-2 border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Available Balance
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={shipmentQty}
                  onChange={(e) => setShipmentQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 text-xs font-mono bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Challan (DC) No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DC-FCI-2026-98440"
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 text-xs font-mono bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issuing Godown Depot
                </label>
                <input
                  type="text"
                  value={godownSource}
                  onChange={(e) => setGodownSource(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  style={{ borderRadius: '4px' }}
                >
                  <Radio className="w-4 h-4" />
                  <span>
                    {isMl
                      ? 'ചെല്ലാൻ രേഖപ്പെടുത്തുക & കാർഡുടമകൾക്ക് അറിയിപ്പ് അയക്കുക'
                      : 'Record Delivery Challan & Dispatch Instant Arrival Alerts'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Inventory Live Adjustments */}
          <div className="bg-white border border-slate-300 p-6 shadow-xs space-y-4" style={{ borderRadius: '6px' }}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isMl ? 'കൗണ്ടർ സ്റ്റോക്ക് മാറ്റങ്ങൾ' : 'Counter Physical Stock Count Adjustments'}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Save adjustments to reflect live physical counts
              </span>
            </div>

            <div className="border border-slate-200 divide-y divide-slate-200 text-xs" style={{ borderRadius: '4px' }}>
              {activeShop.stock.map((item) => (
                <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{item.nameEn}</div>
                    <div className="text-[11px] text-slate-500">
                      Unit: {item.unit} • Threshold: {item.thresholdLow} {item.unit}
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
                      className="w-24 px-2.5 py-1.5 border border-slate-300 font-mono text-xs text-right bg-slate-50 focus:bg-white focus:outline-none"
                      style={{ borderRadius: '4px' }}
                    />
                    <span className="text-xs text-slate-500 font-mono w-16">{item.unit}</span>
                    <button
                      type="button"
                      onClick={() => handleSaveStockAdjustment(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100"
                      style={{ borderRadius: '4px' }}
                    >
                      <Save className="w-3.5 h-3.5 text-slate-600" />
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

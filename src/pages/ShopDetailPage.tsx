import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { StockTable } from '../components/StockTable';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Wifi,
  WifiOff,
  FileSpreadsheet,
  Bell,
  Truck,
  ShieldCheck,
  Calendar,
  Layers,
  History,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const ShopDetailPage: React.FC = () => {
  const {
    shops,
    selectedShopId,
    setActiveView,
    setSelectedShopId,
    setSubscribeModalData,
    selectedCardType,
    reports,
    language,
  } = usePds();

  const isMl = language === 'ml';
  const t = (key: any) => getTranslation(language, key);

  const [activeTab, setActiveTab] = useState<'STOCK' | 'CHALLANS' | 'COMMUNITY'>('STOCK');

  const shop = shops.find((s) => s.id === selectedShopId) || shops[0];
  if (!shop) return null;

  const shopReports = reports.filter((r) => r.shopId === shop.id);
  const challanItems = shop.stock.filter((item) => item.lastChallanNo);

  return (
    <div className="space-y-6">
      {/* Back Navigation Button */}
      <button
        type="button"
        onClick={() => {
          setSelectedShopId(null);
          setActiveView('HOME');
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isMl ? 'എല്ലാ റേഷൻ കടകളിലേക്കും മടങ്ങുക' : 'Back to Dealership Directory'}</span>
      </button>

      {/* Official Dealership Profile Sheet */}
      <div className="bg-white border border-slate-200 p-6 shadow-2xs space-y-6" style={{ borderRadius: '6px' }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="px-2.5 py-0.5 font-mono text-xs font-bold bg-[#0C1E33] text-white"
                style={{ borderRadius: '3px' }}
              >
                {shop.ardNumber}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold border ${
                  shop.isOpen
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
                style={{ borderRadius: '3px' }}
              >
                {shop.isOpen ? (isMl ? 'വിതരണം നടക്കുന്നു' : 'Open for Distribution') : (isMl ? 'അടച്ചിരിക്കുന്നു' : 'Closed')}
              </span>
              <span
                className="px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200"
                style={{ borderRadius: '3px' }}
              >
                ePOS {shop.eposStatus}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isMl ? shop.nameMl : shop.nameEn}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {isMl ? 'അംഗീകൃത ലൈസൻസി' : 'Authorized Licensee'}:{' '}
              <span className="font-semibold text-slate-800">{shop.licensee}</span> • {shop.ward}, {shop.taluk} Taluk
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveView('REPORT')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              style={{ borderRadius: '4px' }}
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              <span>{isMl ? 'വിവരം നൽകുക' : 'Report Ground Status'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSubscribeModalData({ shop })}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-xs"
              style={{ borderRadius: '4px' }}
            >
              <Bell className="w-4 h-4" />
              <span>{isMl ? 'അറിയിപ്പ് സജ്ജമാക്കുക' : 'Set Arrival Alert'}</span>
            </button>
          </div>
        </div>

        {/* Operational Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50/60 border border-slate-100" style={{ borderRadius: '4px' }}>
            <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-1">
              {isMl ? 'പ്രവർത്തന സമയം' : 'Operating Schedule'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{shop.openingHours}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              Lunch: 12:30–15:30 • Sundays Closed
            </span>
          </div>

          <div className="p-3 bg-slate-50/60 border border-slate-100" style={{ borderRadius: '4px' }}>
            <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-1">
              {isMl ? 'വിലാസം & വാർഡ്' : 'Location Address'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{shop.ward}, {shop.pincode}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 truncate">
              {isMl ? shop.addressMl : shop.addressEn}
            </span>
          </div>

          <div className="p-3 bg-slate-50/60 border border-slate-100" style={{ borderRadius: '4px' }}>
            <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-1">
              {isMl ? 'ടെലിഫോൺ ബന്ധം' : 'Official Telephone'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-mono font-medium">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{shop.phone}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">
              GPS: {shop.coordinates.lat.toFixed(4)}, {shop.coordinates.lng.toFixed(4)}
            </span>
          </div>

          <div className="p-3 bg-slate-50/60 border border-slate-100" style={{ borderRadius: '4px' }}>
            <span className="text-[11px] uppercase font-semibold text-slate-400 block mb-1">
              {isMl ? 'ഓഡിറ്റ് പരിശോധന' : 'TSO Inspection'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Audited: {new Date(shop.lastAuditDate).toLocaleDateString()}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">
              ePOS Sync: {new Date(shop.eposLastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Segmented View Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('STOCK')}
          className={`pb-2.5 border-b-2 transition-all ${
            activeTab === 'STOCK'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isMl ? 'സ്റ്റോക്ക് നിലവാരം' : 'Current Stock Inventory'} ({shop.stock.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CHALLANS')}
          className={`pb-2.5 border-b-2 transition-all ${
            activeTab === 'CHALLANS'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isMl ? 'സപ്ലൈകോ ചെല്ലാൻ രേഖകൾ' : 'Official Delivery Challans'} ({challanItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('COMMUNITY')}
          className={`pb-2.5 border-b-2 transition-all ${
            activeTab === 'COMMUNITY'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {isMl ? 'പൊതുജന നിരീക്ഷണങ്ങൾ' : 'Community Activity Log'} ({shopReports.length})
        </button>
      </div>

      {/* Tab 1: Current Stock Inventory Table */}
      {activeTab === 'STOCK' && (
        <div className="space-y-4">
          <StockTable shop={shop} cardTypeFilter={selectedCardType} compact={false} />
        </div>
      )}

      {/* Tab 2: Delivery Challans */}
      {activeTab === 'CHALLANS' && (
        <div className="bg-white border border-slate-200 p-6 shadow-2xs space-y-4" style={{ borderRadius: '6px' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Truck className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Supplyco &amp; Food Corporation of India (FCI) Inward Consignment Trail
              </h3>
              <p className="text-xs text-slate-500">
                Physical shipments verified by Taluk Supply Inspector against active quota allocation.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 divide-y divide-slate-100 text-xs" style={{ borderRadius: '4px' }}>
            {challanItems.map((item) => (
              <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 border border-slate-200" style={{ borderRadius: '3px' }}>
                      {item.lastChallanNo}
                    </span>
                    <span className="font-semibold text-slate-900">{item.nameEn}</span>
                    <span className="text-xs text-slate-500 font-mono">({item.quantityAvailable} {item.unit})</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Dispatched from Supplyco Regional Godown • Counter biometric receipt verification active
                  </p>
                </div>
                <div className="font-mono text-[11px] text-slate-500 text-right shrink-0">
                  {item.lastChallanDate ? new Date(item.lastChallanDate).toLocaleDateString() : 'Active consignment'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Community Feedback */}
      {activeTab === 'COMMUNITY' && (
        <div className="bg-white border border-slate-200 p-6 shadow-2xs space-y-4" style={{ borderRadius: '6px' }}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Recent Citizen Observations for {shop.ardNumber}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('REPORT')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              + Submit Observation
            </button>
          </div>

          {shopReports.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              No recent crowdsourced observations logged for this dealership.
            </p>
          ) : (
            <div className="border border-slate-200 divide-y divide-slate-100 text-xs" style={{ borderRadius: '4px' }}>
              {shopReports.map((rep) => (
                <div key={rep.id} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rep.commodityName}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700" style={{ borderRadius: '2px' }}>
                        {rep.statusReported}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {rep.notes && <p className="text-slate-700 text-xs">{rep.notes}</p>}
                  {rep.receiptNumber && (
                    <p className="text-[11px] font-mono text-emerald-700">
                      ePOS Bill Slip: #{rep.receiptNumber} (+20 confidence)
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

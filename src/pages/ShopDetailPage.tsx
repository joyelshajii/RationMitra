import React from 'react';
import { usePds } from '../context/PdsContext';
import { StockTable } from '../components/StockTable';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Wifi,
  FileSpreadsheet,
  Bell,
  Truck,
  ShieldCheck,
  Calendar,
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

  const shop = shops.find((s) => s.id === selectedShopId) || shops[0];

  if (!shop) return null;

  const shopReports = reports.filter((r) => r.shopId === shop.id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => {
          setSelectedShopId(null);
          setActiveView('HOME');
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isMl ? 'എല്ലാ റേഷൻ കടകളിലേക്കും മടങ്ങുക' : 'Back to All Ration Shops'}</span>
      </button>

      {/* Shop Profile Header Banner */}
      <div className="bg-white border border-slate-300 p-6 shadow-xs" style={{ borderRadius: '6px' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 font-mono text-xs font-bold bg-[#0F2942] text-white" style={{ borderRadius: '3px' }}>
                {shop.ardNumber}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold border ${
                  shop.isOpen
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-red-50 text-red-800 border-red-300'
                }`}
                style={{ borderRadius: '3px' }}
              >
                {shop.isOpen ? (isMl ? 'തുറന്നിരിക്കുന്നു' : 'Open for Distribution') : (isMl ? 'അടച്ചിരിക്കുന്നു' : 'Closed')}
              </span>
              <span className="px-2.5 py-0.5 font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200" style={{ borderRadius: '3px' }}>
                ePOS {shop.eposStatus}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isMl ? shop.nameMl : shop.nameEn}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {isMl ? 'ലൈസൻസി' : 'Authorized Licensee'}: <span className="font-semibold text-slate-800">{shop.licensee}</span> • {shop.taluk} Taluk
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveView('REPORT');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
              style={{ borderRadius: '4px' }}
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              <span>{isMl ? 'സ്റ്റോക്ക് അറിയിക്കുക' : 'Report Observation'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSubscribeModalData({ shop })}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors"
              style={{ borderRadius: '4px' }}
            >
              <Bell className="w-4 h-4" />
              <span>{isMl ? 'സ്റ്റോക്ക് അലേർട്ട്' : 'Set Arrival Alerts'}</span>
            </button>
          </div>
        </div>

        {/* Operational Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">
              {isMl ? 'പ്രവർത്തന സമയം' : 'Operating Hours'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-medium mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{shop.openingHours}</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Sunday Holiday • Closed on state PDS off-days
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">
              {isMl ? 'വിലാസം & വാർഡ്' : 'Location / Address'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{shop.ward}, {shop.pincode}</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {isMl ? shop.addressMl : shop.addressEn}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">
              {isMl ? 'ഔദ്യോഗിക ഫോൺ' : 'Phone / Contact'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-mono font-medium mt-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{shop.phone}</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              GPS: {shop.coordinates.lat.toFixed(4)}, {shop.coordinates.lng.toFixed(4)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">
              {isMl ? 'വിശ്വാസ്യത ഓഡിറ്റ്' : 'Inspection & Sync'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-mono text-[11px] mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Last Audit: {new Date(shop.lastAuditDate).toLocaleDateString()}</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Sync: {new Date(shop.eposLastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stock Inventory Table */}
      <section className="bg-white border border-slate-300 p-6 shadow-xs" style={{ borderRadius: '6px' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isMl ? 'നിലവിലുള്ള സ്റ്റോക്ക് ലിസ്റ്റ്' : 'Verified Current Commodity Balances'}
            </h2>
            <p className="text-xs text-slate-500">
              {isMl
                ? 'ഓരോ ഇനത്തിനും അനുയോജ്യമായ കാർഡ് തരങ്ങളും സബ്‌സിഡി നിരക്കുകളും താഴെ കാണാം.'
                : 'Click "Audit" on any item to view verified Godown delivery challans and transaction slips.'}
            </p>
          </div>
        </div>

        <StockTable shop={shop} cardTypeFilter={selectedCardType} compact={false} />
      </section>

      {/* Delivery Challans & Godown Receipts Log */}
      <section className="bg-white border border-slate-300 p-6 shadow-xs" style={{ borderRadius: '6px' }}>
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-blue-700" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isMl ? 'സപ്ലൈകോ / എഫ്.സി.ഐ ഡെലിവറി ചെല്ലാൻ രേഖകൾ' : 'Official Supplyco & FCI Delivery Challan Trail'}
            </h3>
            <p className="text-xs text-slate-500">
              Physical truck consignments dispatched to this dealership under September 2026 quota.
            </p>
          </div>
        </div>

        <div className="border border-slate-200 divide-y divide-slate-200 text-xs" style={{ borderRadius: '4px' }}>
          {shop.stock
            .filter((item) => item.lastChallanNo)
            .map((item) => (
              <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 border border-slate-300" style={{ borderRadius: '2px' }}>
                      {item.lastChallanNo}
                    </span>
                    <span className="font-semibold text-slate-800">{item.nameEn}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Issued by Supplyco Central Godown • Quota Allocation verified by Taluk Supply Inspector
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-500">
                  {item.lastChallanDate ? new Date(item.lastChallanDate).toLocaleDateString() : 'Active'}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Recent Citizen Feedback for this shop */}
      {shopReports.length > 0 && (
        <section className="bg-white border border-slate-300 p-6 shadow-xs" style={{ borderRadius: '6px' }}>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            {isMl ? 'കാർഡുടമകൾ രേഖപ്പെടുത്തിയ വിവരങ്ങൾ' : 'Recent Citizen Observations for this Dealership'}
          </h3>
          <div className="border border-slate-200 divide-y divide-slate-200 text-xs" style={{ borderRadius: '4px' }}>
            {shopReports.map((rep) => (
              <div key={rep.id} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{rep.commodityName}</span>
                    <span className="font-mono text-[10px] text-slate-500">{rep.statusReported}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {rep.notes && <p className="text-slate-700 text-xs mt-1">{rep.notes}</p>}
                {rep.receiptNumber && (
                  <p className="text-[11px] font-mono text-emerald-700 mt-0.5">
                    Verified ePOS Receipt: #{rep.receiptNumber}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

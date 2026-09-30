import React, { useState, useEffect } from 'react';
import { usePds } from '../context/PdsContext';
import { X, Bell, CheckCircle2, MessageSquare, Smartphone } from 'lucide-react';
import { CommodityId } from '../types';

export const SubscribeModal: React.FC = () => {
  const { subscribeModalData, setSubscribeModalData, addSubscription, language } = usePds();
  const [phone, setPhone] = useState('');
  const [commodityId, setCommodityId] = useState<CommodityId>(
    subscribeModalData?.item?.id || 'atta'
  );
  const [channel, setChannel] = useState<'SMS' | 'WHATSAPP' | 'WEB_PUSH'>('WHATSAPP');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSubscribeModalData(null);
      }
    };
    if (subscribeModalData) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subscribeModalData, setSubscribeModalData]);

  if (!subscribeModalData) return null;

  const { shop } = subscribeModalData;
  const isMl = language === 'ml';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert(isMl ? 'ദയവായി സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    addSubscription({
      shopId: shop.id,
      commodityId,
      phone,
      channel,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSubscribeModalData(null);
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sub-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div
        className="bg-white border border-slate-200/90 w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <h2 id="sub-modal-title" className="text-base font-bold text-slate-900">
              {isMl ? 'സ്റ്റോക്ക് എത്തുമ്പോൾ അറിയിപ്പ് നേടൂ' : 'Stock Arrival Alert Subscription'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSubscribeModalData(null)}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isMl ? 'അറിയിപ്പ് സജീവമാക്കി!' : 'Alert Subscription Active!'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {isMl
                ? `റേഷൻ കടയിൽ പുതിയ ലോഡ് എത്തുമ്പോൾ ${channel} വഴി ഉടൻ അറിയിക്കുന്നതാണ്.`
                : `You will receive an automated ${channel} message the moment the dealership logs the delivery challan.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{shop.ardNumber}</span> • {shop.nameEn}
                <div className="text-[11px] text-slate-500 mt-0.5">{shop.ward}, {shop.taluk}</div>
              </div>
              <span className="text-[11px] font-mono text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 font-semibold">
                {shop.distanceKm} km away
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMl ? 'ആവശ്യമുള്ള സാധനം' : 'Select Commodity for Arrival Tracking'}
              </label>
              <select
                value={commodityId}
                onChange={(e) => setCommodityId(e.target.value as CommodityId)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              >
                {shop.stock.map((st) => (
                  <option key={st.id} value={st.id}>
                    {isMl ? st.nameMl : st.nameEn} (Current: {st.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMl ? 'മൊബൈൽ നമ്പർ' : 'Mobile Phone Number'}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-mono rounded-l-xl">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="9847012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-r-xl text-xs font-mono text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isMl
                  ? 'സ്റ്റോക്ക് അറിയിപ്പുകൾക്ക് വേണ്ടി മാത്രം ഉപയോഗിക്കും.'
                  : 'Used strictly for quota arrival alerts. Zero spam, zero commercial sharing.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isMl ? 'അറിയിപ്പ് മാധ്യമം' : 'Alert Dispatch Channel'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('WHATSAPP')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    channel === 'WHATSAPP'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mb-1 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    channel === 'SMS'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mb-1 text-blue-600" />
                  <span>SMS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('WEB_PUSH')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    channel === 'WEB_PUSH'
                      ? 'border-slate-900 bg-slate-100 text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bell className="w-4 h-4 mb-1 text-slate-700" />
                  <span>Browser Push</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSubscribeModalData(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {isMl ? 'റദ്ദാക്കുക' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
              >
                {isMl ? 'അറിയിപ്പ് സജീവമാക്കുക' : 'Activate Alert'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

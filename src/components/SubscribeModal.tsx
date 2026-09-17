import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { X, Bell, CheckCircle2, MessageSquare, PhoneCall, Smartphone } from 'lucide-react';
import { CommodityId } from '../types';

export const SubscribeModal: React.FC = () => {
  const { subscribeModalData, setSubscribeModalData, addSubscription, language } = usePds();
  const [phone, setPhone] = useState('');
  const [commodityId, setCommodityId] = useState<CommodityId>(
    subscribeModalData?.item?.id || 'atta'
  );
  const [channel, setChannel] = useState<'SMS' | 'WHATSAPP' | 'WEB_PUSH'>('WHATSAPP');
  const [isSuccess, setIsSuccess] = useState(false);

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
    }, 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sub-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div
        className="bg-white border border-slate-300 w-full max-w-lg shadow-xl overflow-hidden"
        style={{ borderRadius: '6px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-700" />
            <h2 id="sub-modal-title" className="text-base font-bold text-slate-900">
              {isMl ? 'സ്റ്റോക്ക് എത്തുമ്പോൾ അറിയിപ്പ് നേടൂ' : 'Commodity Arrival Notification'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSubscribeModalData(null)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            style={{ borderRadius: '4px' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center" style={{ borderRadius: '4px' }}>
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isMl ? 'അറിയിപ്പ് വിജയകരമായി സജീവമാക്കി!' : 'Alert Subscription Activated!'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {isMl
                ? `റേഷൻ കടയിൽ പുതിയ ലോഡ് എത്തുമ്പോൾ ${channel} വഴി നിങ്ങളെ ഉടൻ അറിയിക്കുന്നതാണ്.`
                : `You will receive an automated ${channel} notification the moment the dealer logs the arrival delivery challan.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-blue-50/60 border border-blue-200 text-xs text-blue-900" style={{ borderRadius: '4px' }}>
              <span className="font-semibold">{shop.ardNumber}</span> • {shop.nameEn}
              <div className="text-[11px] text-blue-700 mt-0.5">{shop.ward}, {shop.taluk}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMl ? 'ആവശ്യമുള്ള സാധനം തിരഞ്ഞെടുക്കുക' : 'Select Essential Commodity'}
              </label>
              <select
                value={commodityId}
                onChange={(e) => setCommodityId(e.target.value as CommodityId)}
                className="w-full px-3 py-2 border border-slate-300 text-xs bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                style={{ borderRadius: '4px' }}
              >
                {shop.stock.map((st) => (
                  <option key={st.id} value={st.id}>
                    {isMl ? st.nameMl : st.nameEn} ({st.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMl ? 'മൊബൈൽ നമ്പർ (10 അക്കങ്ങൾ)' : 'Mobile Number (10 digits)'}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-mono" style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}>
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
                  className="w-full px-3 py-2 border border-slate-300 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                  style={{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isMl
                  ? 'നിങ്ങളുടെ നമ്പർ സ്റ്റോക്ക് അലേർട്ടിനായി മാത്രം ഉപയോഗിക്കും. മറ്റ് ആവശ്യങ്ങൾക്ക് പങ്കിടില്ല.'
                  : 'Used strictly for PDS quota arrival notification. Zero spam or commercial use.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isMl ? 'അറിയിപ്പ് ലഭിക്കേണ്ട മാധ്യമം' : 'Preferred Notification Channel'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('WHATSAPP')}
                  className={`flex flex-col items-center justify-center p-2.5 border text-xs font-medium transition-colors ${
                    channel === 'WHATSAPP'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  <MessageSquare className="w-4 h-4 mb-1 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`flex flex-col items-center justify-center p-2.5 border text-xs font-medium transition-colors ${
                    channel === 'SMS'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  <Smartphone className="w-4 h-4 mb-1 text-blue-600" />
                  <span>SMS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('WEB_PUSH')}
                  className={`flex flex-col items-center justify-center p-2.5 border text-xs font-medium transition-colors ${
                    channel === 'WEB_PUSH'
                      ? 'border-slate-800 bg-slate-100 text-slate-900 font-semibold'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  <Bell className="w-4 h-4 mb-1 text-slate-700" />
                  <span>Browser Push</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSubscribeModalData(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                {isMl ? 'റദ്ദാക്കുക' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                {isMl ? 'അറിയിപ്പ് സജീവമാക്കുക' : 'Activate Stock Alert'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

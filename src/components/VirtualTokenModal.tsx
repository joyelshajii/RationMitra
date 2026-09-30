import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { RationShop, CardType, VirtualToken } from '../types';
import { CARD_TYPES } from '../data/seedData';
import {
  X,
  Clock,
  Users,
  Ticket,
  CheckCircle2,
  Calendar,
  Building,
  Printer,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Timer,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface VirtualTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: RationShop;
}

const TIME_SLOTS = [
  '08:30 AM - 09:00 AM',
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:30 AM - 11:00 AM',
  '11:30 AM - 12:00 PM',
  '03:30 PM - 04:00 PM',
  '04:30 PM - 05:00 PM',
  '05:30 PM - 06:00 PM',
];

export const VirtualTokenModal: React.FC<VirtualTokenModalProps> = ({
  isOpen,
  onClose,
  shop,
}) => {
  const { language } = usePds();
  const isMl = language === 'ml';
  const t = (k: any) => getTranslation(language, k);

  const [cardholderName, setCardholderName] = useState<string>('Sukumaran Pillai');
  const [cardNumber, setCardNumber] = useState<string>('KL-05-PHH-449102');
  const [cardType, setCardType] = useState<CardType>('PHH_PINK');
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[2]);
  const [reportedQueue, setReportedQueue] = useState<number | null>(null);
  const [generatedToken, setGeneratedToken] = useState<VirtualToken | null>(null);

  // Dynamic wait time estimate
  const currentQueueCount = reportedQueue !== null ? reportedQueue : Math.round(shop.queueEstimateMinutes / 2.5);
  const estimatedWaitMin = currentQueueCount * 2.5;

  const handleBookToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardholderName.trim() || !cardNumber.trim()) return;

    const token: VirtualToken = {
      id: `token-${Date.now()}`,
      tokenNumber: `KL-${shop.ardNumber.replace(/\D/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      shopId: shop.id,
      shopArd: shop.ardNumber,
      shopName: shop.nameEn,
      cardholderName: cardholderName.trim(),
      cardNumber: cardNumber.trim().toUpperCase(),
      cardType: cardType,
      timeSlot: selectedSlot,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    setGeneratedToken(token);
  };

  const handleReportQueue = (count: number) => {
    setReportedQueue(count);
    alert(
      isMl
        ? `നന്ദി! നിങ്ങളുടെ റിപ്പോർട്ട് (${count} പേർ ക്യൂവിൽ) രേഖപ്പെടുത്തി.`
        : `Thank you! Live queue count updated to ${count} people.`
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('queueTitle')}
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                {shop.ardNumber} • {isMl ? shop.nameMl : shop.nameEn}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {!generatedToken ? (
            <>
              {/* Live Crowd Meter */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl p-4 border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-blue-700" />
                    <span>Live Counter Queue Meter</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-800">
                  <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      People in Line
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 font-mono flex items-baseline gap-1 mt-0.5">
                      <span>{currentQueueCount}</span>
                      <span className="text-xs text-slate-500 font-normal">cardholders</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Estimated Wait
                    </span>
                    <div className="text-xl font-extrabold text-blue-700 font-mono flex items-baseline gap-1 mt-0.5">
                      <span>~{estimatedWaitMin}</span>
                      <span className="text-xs text-slate-500 font-normal">minutes</span>
                    </div>
                  </div>
                </div>

                {/* Crowd Feedback Row */}
                <div className="pt-2 border-t border-blue-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600">Standing at this shop right now?</span>
                  <div className="flex items-center gap-1">
                    {[1, 5, 12].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleReportQueue(num)}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-blue-100 border border-blue-200 text-[10px] font-semibold text-blue-800 transition-colors"
                      >
                        {num === 1 ? '0-2 waiting' : num === 5 ? '5-7 waiting' : '10+ waiting'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Virtual Slot Booking Form */}
              <form onSubmit={handleBookToken} className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Book Priority 30-Minute Counter Slot
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Present this token on your phone to skip the general sun-exposed queue.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      10-Digit Ration Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono uppercase bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ration Card Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {Object.values(CARD_TYPES).map((card) => (
                      <button
                        key={card.type}
                        type="button"
                        onClick={() => setCardType(card.type)}
                        className={`py-2 px-2 rounded-xl border font-semibold text-center transition-all ${
                          cardType === card.type
                            ? 'ring-2 ring-emerald-600 shadow-xs'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: card.bgHex,
                          color: card.textHex,
                          borderColor: card.borderHex,
                        }}
                      >
                        {card.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Convenient Time Slot (Today)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-xl border text-[11px] font-mono text-center transition-all ${
                          selectedSlot === slot
                            ? 'bg-emerald-700 text-white border-emerald-800 font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Generate Digital Time-Slot Token</span>
                </button>
              </form>
            </>
          ) : (
            /* Digital Token Slip Display */
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-md relative overflow-hidden space-y-4">
                {/* Official Stamp Watermark */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
                      Civil Supplies Department • Govt of Kerala
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-0.5">
                      PDS PRIORITY COUNTER PASS
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">TOKEN NUMBER</span>
                    <span className="font-mono text-base font-extrabold text-emerald-700">
                      {generatedToken.tokenNumber}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Beneficiary Name</span>
                    <strong className="text-slate-900 text-sm">{generatedToken.cardholderName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Card Number</span>
                    <strong className="text-slate-900 font-mono">{generatedToken.cardNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Authorised Shop</span>
                    <strong className="text-slate-900">{generatedToken.shopArd} ({generatedToken.shopName})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reserved Slot</span>
                    <strong className="text-emerald-700 font-mono">{generatedToken.timeSlot}</strong>
                  </div>
                </div>

                {/* Barcode Graphic */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                  <div className="font-mono text-lg font-bold tracking-[6px] text-slate-800 select-all">
                    |||| ||| ||||| |||| |||||
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Scan on ePOS Counter Scanner for Priority Biometric Verification
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Valid only for selected time slot. Please bring Aadhaar-linked ration card.</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGeneratedToken(null)}
                  className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors"
                >
                  Book Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

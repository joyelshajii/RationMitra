import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { CardType, DoorstepDeliveryRequest } from '../types';
import { CARD_TYPES } from '../data/seedData';
import {
  X,
  HeartHandshake,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Truck,
  Building,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface DoorstepDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoorstepDeliveryModal: React.FC<DoorstepDeliveryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { shops, language } = usePds();
  const isMl = language === 'ml';
  const t = (k: any) => getTranslation(language, k);

  const [beneficiaryName, setBeneficiaryName] = useState<string>('Kalyani Amma');
  const [cardNumber, setCardNumber] = useState<string>('KL-05-AAY-883921');
  const [cardType, setCardType] = useState<CardType>('AAY_YELLOW');
  const [phone, setPhone] = useState<string>('9447120394');
  const [ward, setWard] = useState<string>('Ward 04 (Ponkunnam)');
  const [address, setAddress] = useState<string>('Thekkekuttu House, Near Govt High School, Ponkunnam');
  const [reason, setReason] = useState<'BEDRIDDEN' | 'SENIOR_CITIZEN' | 'DIFFERENTLY_ABLED'>('SENIOR_CITIZEN');
  const [selectedShopId, setSelectedShopId] = useState<string>('ARD-104');
  const [confirmedRequest, setConfirmedRequest] = useState<DoorstepDeliveryRequest | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiaryName.trim() || !cardNumber.trim() || !phone.trim()) return;

    const shop = shops.find((s) => s.id === selectedShopId) || shops[0];

    const req: DoorstepDeliveryRequest = {
      id: `oppam-${Date.now()}`,
      shopId: shop.id,
      ardNumber: shop.ardNumber,
      beneficiaryName: beneficiaryName.trim(),
      rationCardNumber: cardNumber.trim().toUpperCase(),
      cardType,
      phone: phone.trim(),
      wardNumber: ward,
      address: address.trim(),
      reason,
      assignedVolunteerName: 'Smt. Shailaja Kumari (Kudumbashree CDS Ward 04 Convener)',
      volunteerContact: '+91 94472 88410',
      status: 'VOLUNTEER_ASSIGNED',
      requestedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setConfirmedRequest(req);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-emerald-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('doorstepTitle')}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                  Govt. Oppam Scheme
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {t('doorstepDesc')}
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
          {!confirmedRequest ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 leading-relaxed text-[11px]">
                Under Kerala's <strong>Oppam (ഒപ്പം)</strong> social safety mission, Kudumbashree ADS and local Asha workers deliver monthly foodgrains directly to the homes of senior citizens (75+), bedridden individuals, and persons with disabilities at zero extra service charge.
              </div>

              {/* Assistance Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Category of Assistance (അർഹതാ വിഭാഗം)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReason('SENIOR_CITIZEN')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      reason === 'SENIOR_CITIZEN'
                        ? 'bg-emerald-700 text-white border-emerald-800 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    👵 Senior (75+)
                  </button>

                  <button
                    type="button"
                    onClick={() => setReason('BEDRIDDEN')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      reason === 'BEDRIDDEN'
                        ? 'bg-emerald-700 text-white border-emerald-800 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🛌 Bedridden
                  </button>

                  <button
                    type="button"
                    onClick={() => setReason('DIFFERENTLY_ABLED')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      reason === 'DIFFERENTLY_ABLED'
                        ? 'bg-emerald-700 text-white border-emerald-800 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ♿ Differently-Abled
                  </button>
                </div>
              </div>

              {/* Beneficiary Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Beneficiary Name (ഗുണഭോക്താവിന്റെ പേര്)
                  </label>
                  <input
                    type="text"
                    required
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone Number (ഫോൺ നമ്പർ)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Authorised Ration Shop
                  </label>
                  <select
                    value={selectedShopId}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {shops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.ardNumber} • {s.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery Address &amp; Ward Landmark
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Register for Volunteer Doorstep Delivery</span>
              </button>
            </form>
          ) : (
            /* Confirmation Receipt */
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-emerald-50/80 border-2 border-emerald-600 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-emerald-200 pb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      Request Confirmed &amp; Dispatched
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Oppam Doorstep Delivery Registered
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between border-b border-emerald-100 py-1">
                    <span className="text-slate-600">Request Tracking ID:</span>
                    <strong className="font-mono text-slate-900">{confirmedRequest.id}</strong>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 py-1">
                    <span className="text-slate-600">Beneficiary:</span>
                    <strong className="text-slate-900">{confirmedRequest.beneficiaryName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 py-1">
                    <span className="text-slate-600">Ration Card:</span>
                    <strong className="font-mono text-slate-900">{confirmedRequest.rationCardNumber}</strong>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 py-1">
                    <span className="text-slate-600">Linked Shop:</span>
                    <strong className="text-slate-900">{confirmedRequest.ardNumber}</strong>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 py-1">
                    <span className="text-slate-600">Assigned Volunteer:</span>
                    <strong className="text-emerald-800">{confirmedRequest.assignedVolunteerName}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Volunteer Phone:</span>
                    <strong className="font-mono text-blue-700">{confirmedRequest.volunteerContact}</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Your ward Kudumbashree volunteer will collect foodgrains from the ARD shop with proxy verification and deliver to your doorstep within 48 hours.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmedRequest(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

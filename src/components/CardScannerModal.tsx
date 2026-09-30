import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { CardType } from '../types';
import { CARD_TYPES } from '../data/seedData';
import {
  X,
  Camera,
  QrCode,
  ScanLine,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  User,
  Building,
  RefreshCw,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface CardScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardDetected: (cardType: CardType, shopId?: string) => void;
}

interface DemoRationCard {
  id: string;
  cardNumber: string;
  holderNameEn: string;
  holderNameMl: string;
  cardType: CardType;
  membersCount: number;
  assignedArdId: string;
  assignedArdNumber: string;
  assignedArdName: string;
  lpgCount: number;
  monthlyQuota: {
    rice: string;
    wheat: string;
    atta: string;
    sugar: string;
    kerosene: string;
    estimatedCost: string;
  };
}

const SAMPLE_CARDS: DemoRationCard[] = [
  {
    id: 'sample-1',
    cardNumber: 'KL-05-AAY-883921',
    holderNameEn: 'Bhavani Amma',
    holderNameMl: 'ഭവാനി അമ്മ',
    cardType: 'AAY_YELLOW',
    membersCount: 4,
    assignedArdId: 'ARD-104',
    assignedArdNumber: 'ARD 104',
    assignedArdName: 'Kanjirappally Town (K.R. Narayanan)',
    lpgCount: 0,
    monthlyQuota: {
      rice: '30 kg (Free of Cost)',
      wheat: '5 kg (Free of Cost)',
      atta: '2 packets @ ₹6/pkt',
      sugar: '1 kg @ ₹21.60/kg',
      kerosene: '1 Litre @ ₹59/L',
      estimatedCost: '₹33.60',
    },
  },
  {
    id: 'sample-2',
    cardNumber: 'KL-05-PHH-449102',
    holderNameEn: 'Mariamma Joseph',
    holderNameMl: 'മറിയാമ്മ ജോസഫ്',
    cardType: 'PHH_PINK',
    membersCount: 5,
    assignedArdId: 'ARD-118',
    assignedArdNumber: 'ARD 118',
    assignedArdName: 'Ponkunnam Central (M.T. Thomas)',
    lpgCount: 1,
    monthlyQuota: {
      rice: '20 kg (4 kg/head, Free)',
      wheat: '5 kg (1 kg/head, Free)',
      atta: '2 packets @ ₹17/pkt',
      sugar: 'Festival special allocation',
      kerosene: '0.5 Litre @ ₹59/L',
      estimatedCost: '₹63.50',
    },
  },
  {
    id: 'sample-3',
    cardNumber: 'KL-05-NPS-771240',
    holderNameEn: 'Sukumaran Pillai',
    holderNameMl: 'സുകുമാരൻ പിള്ള',
    cardType: 'NPS_BLUE',
    membersCount: 3,
    assignedArdId: 'ARD-142',
    assignedArdNumber: 'ARD 142',
    assignedArdName: 'Elikulam Panchayat (S. Radhakrishnan)',
    lpgCount: 2,
    monthlyQuota: {
      rice: '6 kg (2 kg/head @ ₹4/kg)',
      wheat: 'Subject to godown stock @ ₹6.70/kg',
      atta: '2 packets @ ₹17/pkt',
      sugar: 'Not subsidized',
      kerosene: '0.5 Litre (as available)',
      estimatedCost: '₹58.00',
    },
  },
  {
    id: 'sample-4',
    cardNumber: 'KL-05-NPNS-102948',
    holderNameEn: 'George Varghese',
    holderNameMl: 'ജോർജ് വർഗ്ഗീസ്',
    cardType: 'NPNS_WHITE',
    membersCount: 2,
    assignedArdId: 'ARD-104',
    assignedArdNumber: 'ARD 104',
    assignedArdName: 'Kanjirappally Town (K.R. Narayanan)',
    lpgCount: 2,
    monthlyQuota: {
      rice: 'Market intervention @ ₹10.90/kg',
      wheat: 'Not subsidized',
      atta: 'Up to 2 packets @ ₹17/pkt',
      sugar: 'Not subsidized',
      kerosene: 'Not subsidized',
      estimatedCost: 'Pay per market allocation',
    },
  },
];

export const CardScannerModal: React.FC<CardScannerModalProps> = ({
  isOpen,
  onClose,
  onCardDetected,
}) => {
  const { language } = usePds();
  const isMl = language === 'ml';
  const t = (k: any) => getTranslation(language, k);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedCard, setScannedCard] = useState<DemoRationCard | null>(null);

  const handleSimulateScan = (card: DemoRationCard) => {
    setIsScanning(true);
    setScannedCard(null);

    setTimeout(() => {
      setIsScanning(false);
      setScannedCard(card);
    }, 1200);
  };

  const handleApplyCard = () => {
    if (scannedCard) {
      onCardDetected(scannedCard.cardType, scannedCard.assignedArdId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('scanCardTitle')}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  QR / Barcode
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t('scanCardDesc')}
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

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Scanner Simulation Viewport */}
          <div className="relative bg-slate-950 rounded-2xl p-6 sm:p-8 text-center text-white overflow-hidden shadow-inner border border-slate-800">
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-white/20 rounded-xl pointer-events-none" />
            
            {/* Animated Laser Scanning Line */}
            {isScanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
            )}

            <div className="relative z-10 max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-emerald-400">
                {isScanning ? (
                  <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
                ) : (
                  <QrCode className="w-7 h-7" />
                )}
              </div>

              <div className="text-sm font-semibold text-slate-200">
                {isScanning
                  ? (isMl ? 'ബാർകോഡ് സ്കാൻ ചെയ്യുന്നു... ഒത്തുനോക്കുന്നു' : 'Scanning optical barcode... Verifying with Civil Supplies DB')
                  : (isMl ? 'റേഷൻ കാർഡിലെ ബാർകോഡ് ക്യാമറക്ക് നേരെ പിടിക്കുക' : 'Align Ration Card Barcode or QR Code within the frame')}
              </div>

              <p className="text-xs text-slate-400">
                Supports all Kerala PDS card editions (NFSA AAY, PHH, NPS, and NPNS)
              </p>
            </div>
          </div>

          {/* Quick Demo Card Picker */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Or Select a Demo Card to Test:
              </span>
              <span className="text-[11px] text-slate-400">Tap any to auto-fill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLE_CARDS.map((card) => {
                const info = CARD_TYPES[card.cardType];
                const isSelected = scannedCard?.id === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleSimulateScan(card)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'ring-2 ring-blue-600 shadow-sm'
                        : 'hover:bg-slate-50 border-slate-200'
                    }`}
                    style={{ backgroundColor: isSelected ? info.bgHex : '#ffffff' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: info.colorHex, color: '#ffffff' }}
                      >
                        {info.code}
                      </span>
                      <span className="font-mono text-xs text-slate-500 font-semibold">
                        {card.cardNumber}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-xs">
                      {isMl ? card.holderNameMl : card.holderNameEn}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                      <span>{card.membersCount} Members</span>
                      <span className="text-blue-700 font-medium">{card.assignedArdNumber}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scanned Card Results Sheet */}
          {scannedCard && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {isMl ? scannedCard.holderNameMl : scannedCard.holderNameEn}
                      </span>
                      <span className="font-mono text-xs text-slate-500 font-semibold">
                        ({scannedCard.cardNumber})
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900">
                      Verified NFSA Cardholder • Assigned: <strong className="text-slate-900">{scannedCard.assignedArdName}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Monthly Entitlements Grid */}
              <div className="bg-white rounded-xl p-3 border border-emerald-100 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100 pb-1 flex justify-between">
                  <span>Authorized Monthly Quota</span>
                  <span className="text-emerald-700 font-mono">Est: {scannedCard.monthlyQuota.estimatedCost}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-500">Rice:</span> <strong className="text-slate-900">{scannedCard.monthlyQuota.rice}</strong></div>
                  <div><span className="text-slate-500">Wheat:</span> <strong className="text-slate-900">{scannedCard.monthlyQuota.wheat}</strong></div>
                  <div><span className="text-slate-500">Atta:</span> <strong className="text-slate-900">{scannedCard.monthlyQuota.atta}</strong></div>
                  <div><span className="text-slate-500">Kerosene:</span> <strong className="text-slate-900">{scannedCard.monthlyQuota.kerosene}</strong></div>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={handleApplyCard}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>{isMl ? 'ഈ കാർഡ് വിവരങ്ങൾ ഉപയോഗിച്ച് പോർട്ടൽ കാണുക' : 'Filter Portal & Check Assigned Shop Stock'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

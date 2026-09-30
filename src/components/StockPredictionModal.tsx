import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { RationShop } from '../types';
import {
  X,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Truck,
  ShieldAlert,
  Send,
  Sparkles,
  BarChart3,
  Cpu,
  Layers,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface StockPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: RationShop;
}

interface CommodityPrediction {
  commodityName: string;
  currentStock: number;
  unit: string;
  dailyVelocity: number; // Quintals/day
  daysRemaining: number;
  stockoutDate: string;
  riskLevel: 'CRITICAL' | 'MODERATE' | 'HEALTHY';
  inwardChallanTotal: number;
  eposSalesTotal: number;
  discrepancyPercent: number;
}

export const StockPredictionModal: React.FC<StockPredictionModalProps> = ({
  isOpen,
  onClose,
  shop,
}) => {
  const { language } = usePds();
  const isMl = language === 'ml';
  const t = (k: any) => getTranslation(language, k);

  const [indentSent, setIndentSent] = useState<boolean>(false);

  // Compute AI depletion forecasts based on current stock
  const predictions: CommodityPrediction[] = shop.stock.map((item) => {
    // Dynamic simulated velocities for demonstration
    const dailyVelocity =
      item.id === 'matta_rice'
        ? 5.8
        : item.id === 'raw_rice'
        ? 3.2
        : item.id === 'atta'
        ? 1.8
        : item.id === 'sugar'
        ? 1.2
        : 2.0;

    const daysRemaining = Math.max(0, Math.round((item.quantityAvailable / dailyVelocity) * 10) / 10);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.ceil(daysRemaining));
    const stockoutDate = futureDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const riskLevel: 'CRITICAL' | 'MODERATE' | 'HEALTHY' =
      daysRemaining <= 1.5
        ? 'CRITICAL'
        : daysRemaining <= 4.0
        ? 'MODERATE'
        : 'HEALTHY';

    // Discrepancy math between delivery challan and ePOS biometric transactions
    const inwardChallanTotal = Math.round(item.quantityAvailable * 1.35 * 10) / 10;
    const ePOSRate = item.id === 'atta' ? 1.04 : 0.99; // slight discrepancy demo
    const eposSalesTotal = Math.round(inwardChallanTotal - item.quantityAvailable * ePOSRate * 10) / 10;
    const theoreticalBalance = inwardChallanTotal - eposSalesTotal;
    const discrepancy = Math.abs(theoreticalBalance - item.quantityAvailable);
    const discrepancyPercent = Math.round((discrepancy / (item.quantityAvailable || 1)) * 100 * 10) / 10;

    return {
      commodityName: item.nameEn,
      currentStock: item.quantityAvailable,
      unit: item.unit,
      dailyVelocity,
      daysRemaining,
      stockoutDate,
      riskLevel,
      inwardChallanTotal,
      eposSalesTotal,
      discrepancyPercent,
    };
  });

  const handleDispatchIndent = () => {
    setIndentSent(true);
    setTimeout(() => {
      setIndentSent(false);
      alert(
        isMl
          ? 'സപ്ലൈകോ ഡിപ്പോയിലേക്ക് ഓട്ടോമേറ്റഡ് റീസ്റ്റോക്കിംഗ് ഓർഡർ വിജയകരമായി അയച്ചു.'
          : 'Automated godown replenishment indent dispatched to Supplyco Ponkunnam Depot.'
      );
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('forecastTitle')}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  TSO Analytics Suite
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {shop.ardNumber} • {shop.nameEn} (Taluk: {shop.taluk})
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* AI Banner Explainer */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-indigo-950 block text-xs">
                Predictive Consumption Analytics &amp; Anti-Diversion Sentry
              </span>
              <p className="text-indigo-900 leading-relaxed text-[11px]">
                Analyzes 90-day biometric ePOS velocity against inward Supplyco godown Delivery Challans (DC) to forecast exact stockout dates and highlight reconciliation variances.
              </p>
            </div>
          </div>

          {/* Predictions Table / Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Commodity Depletion Forecast
              </span>
              <span className="text-[11px] text-slate-400">Calculated per 10-hour business day</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predictions.map((p) => (
                <div
                  key={p.commodityName}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{p.commodityName}</h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        Current: {p.currentStock} {p.unit}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.riskLevel === 'CRITICAL'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : p.riskLevel === 'MODERATE'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {p.riskLevel === 'CRITICAL'
                        ? 'CRITICAL (<2 Days)'
                        : p.riskLevel === 'MODERATE'
                        ? 'MODERATE BUFFER'
                        : 'HEALTHY'}
                    </span>
                  </div>

                  {/* Depletion Countdown Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Velocity: ~{p.dailyVelocity} {p.unit}/day</span>
                      <strong className="text-slate-800">
                        {p.daysRemaining === 0 ? 'Exhausted' : `${p.daysRemaining} days left`}
                      </strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          p.riskLevel === 'CRITICAL'
                            ? 'bg-red-500'
                            : p.riskLevel === 'MODERATE'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(10, (p.daysRemaining / 7) * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Projected stockout:</span>
                      <span className="font-semibold text-slate-700">{p.stockoutDate}</span>
                    </div>
                  </div>

                  {/* Discrepancy Auditor Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                      <span>ePOS Variance:</span>
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        p.discrepancyPercent > 2.5 ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {p.discrepancyPercent}% ({p.discrepancyPercent > 2.5 ? 'Audited' : 'Verified OK'})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Taluk Officer Action Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-lg">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-700" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Automated Supplyco Godown Indent Dispatch
                </h4>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Automatically generate and transmit an electronic lorry replenishment indent to Ponkunnam Godown Depot for critical items.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDispatchIndent}
              disabled={indentSent}
              className="py-2.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{indentSent ? 'Transmitting...' : 'Dispatch Restock Indent'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

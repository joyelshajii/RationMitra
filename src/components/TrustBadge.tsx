import React from 'react';
import { TrustLevel } from '../types';
import { ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { usePds } from '../context/PdsContext';

interface TrustBadgeProps {
  level: TrustLevel;
  score: number;
  onClickAudit?: () => void;
  compact?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  level,
  score,
  onClickAudit,
  compact = false,
}) => {
  const { language } = usePds();
  const isMl = language === 'ml';

  let badgeClasses = '';
  let dotClass = '';
  let Icon = ShieldCheck;
  let labelEn = '';
  let labelMl = '';

  switch (level) {
    case 'HIGH':
      badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/80';
      dotClass = 'bg-emerald-500';
      Icon = ShieldCheck;
      labelEn = `Verified • ${score}%`;
      labelMl = `സ്ഥിരീകരിച്ചു • ${score}%`;
      break;
    case 'MEDIUM':
      badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/80';
      dotClass = 'bg-amber-500';
      Icon = AlertTriangle;
      labelEn = `Dealer Log • ${score}%`;
      labelMl = `ഡീലർ ലോഗ് • ${score}%`;
      break;
    case 'LOW':
      badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70';
      dotClass = 'bg-slate-400';
      Icon = AlertCircle;
      labelEn = `Unverified • ${score}%`;
      labelMl = `പഴയ വിവരം • ${score}%`;
      break;
    case 'DISPUTED':
      badgeClasses = 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 animate-pulse';
      dotClass = 'bg-rose-500';
      Icon = AlertCircle;
      labelEn = `Disputed • ${score}%`;
      labelMl = `തർക്കമുള്ളത് • ${score}%`;
      break;
  }

  const text = isMl ? labelMl : labelEn;

  return (
    <button
      type="button"
      onClick={onClickAudit}
      title={isMl ? 'പരിശോധനാ രേഖകൾ കാണാൻ ക്ലിക്ക് ചെയ്യുക' : 'Click to inspect verification audit trail'}
      className={`inline-flex items-center gap-1.5 border font-sans font-medium transition-all cursor-pointer rounded-full shadow-xs ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${badgeClasses}`}
    >
      <Icon className="w-3 h-3 shrink-0 opacity-80" />
      <span className="tabular-nums font-semibold">{text}</span>
    </button>
  );
};


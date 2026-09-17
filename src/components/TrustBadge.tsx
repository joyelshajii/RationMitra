import React from 'react';
import { TrustLevel } from '../types';
import { ShieldCheck, Clock, AlertTriangle, Shield } from 'lucide-react';
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
  let labelEn = '';
  let labelMl = '';

  switch (level) {
    case 'HIGH':
      badgeClasses = 'bg-emerald-50/90 text-emerald-950 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300';
      dotClass = 'bg-emerald-600';
      labelEn = `Verified • ${score}%`;
      labelMl = `സ്ഥിരീകരിച്ചു • ${score}%`;
      break;
    case 'MEDIUM':
      badgeClasses = 'bg-amber-50/90 text-amber-950 border-amber-200 hover:bg-amber-100 hover:border-amber-300';
      dotClass = 'bg-amber-500';
      labelEn = `Dealer Log • ${score}%`;
      labelMl = `ഡീലർ ലോഗ് • ${score}%`;
      break;
    case 'LOW':
      badgeClasses = 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 hover:border-slate-300';
      dotClass = 'bg-slate-400';
      labelEn = `Stale • ${score}%`;
      labelMl = `പഴയ വിവരം • ${score}%`;
      break;
    case 'DISPUTED':
      badgeClasses = 'bg-red-50 text-red-950 border-red-300 hover:bg-red-100 animate-pulse';
      dotClass = 'bg-red-600';
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
      className={`inline-flex items-center gap-1.5 border font-mono font-medium transition-all cursor-pointer shadow-2xs ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${badgeClasses}`}
      style={{ borderRadius: '4px' }}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
      <span className="tabular-nums">{text}</span>
    </button>
  );
};

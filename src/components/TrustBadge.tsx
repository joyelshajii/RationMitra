import React from 'react';
import { TrustLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock } from 'lucide-react';
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

  let badgeStyle = '';
  let Icon = ShieldCheck;
  let textEn = '';
  let textMl = '';

  switch (level) {
    case 'HIGH':
      badgeStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100';
      Icon = ShieldCheck;
      textEn = `Verified (${score}%)`;
      textMl = `സ്ഥിരീകരിച്ചു (${score}%)`;
      break;
    case 'MEDIUM':
      badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100';
      Icon = Clock;
      textEn = `Dealer Log (${score}%)`;
      textMl = `ഡീലർ ലോഗ് (${score}%)`;
      break;
    case 'LOW':
      badgeStyle = 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200';
      Icon = Clock;
      textEn = `Stale (${score}%)`;
      textMl = `പഴയ വിവരം (${score}%)`;
      break;
    case 'DISPUTED':
      badgeStyle = 'bg-red-50 text-red-900 border-red-300 hover:bg-red-100 animate-pulse';
      Icon = AlertTriangle;
      textEn = `Disputed (${score}%)`;
      textMl = `തർക്കമുള്ളത് (${score}%)`;
      break;
  }

  const label = language === 'ml' ? textMl : textEn;

  return (
    <button
      type="button"
      onClick={onClickAudit}
      title={language === 'ml' ? 'പരിശോധനാ ചരിത്രം കാണുക' : 'Click to inspect verification audit trail'}
      className={`inline-flex items-center gap-1.5 border font-mono font-medium transition-colors ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${badgeStyle}`}
      style={{ borderRadius: '4px' }}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
};

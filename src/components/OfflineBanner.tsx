import React, { useState, useEffect } from 'react';
import { usePds } from '../context/PdsContext';
import { WifiOff, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const OfflineBanner: React.FC = () => {
  const { language } = usePds();
  const t = (k: any) => getTranslation(language, k);

  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <WifiOff className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">Offline Cache Enabled</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {t('offlineNotice')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Dismiss offline banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

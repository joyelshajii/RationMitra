import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import {
  Shield,
  Bell,
  Store,
  FileSpreadsheet,
  KeyRound,
  Presentation,
  X,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    activeView,
    setActiveView,
    notifications,
    unreadCount,
    markNotificationRead,
    clearNotifications,
  } = usePds();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);

  const t = (key: any) => getTranslation(language, key);
  const isMl = language === 'ml';

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 transition-colors">
      {/* Slim Institutional Civic Banner */}
      <div className="bg-[#0C1E33] text-slate-200 text-[11px] py-1 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="font-medium tracking-normal text-slate-300">
              {isMl
                ? 'കേരള സർക്കാർ • ഭക്ഷ്യ പൊതുവിതരണ ഉപഭോക്തൃകാര്യ വകുപ്പ്'
                : 'Government of Kerala • Department of Food, Civil Supplies & Consumer Affairs'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
            <span>Toll-Free Helpline: 1967</span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="hidden md:inline">Kottayam District PDS Live Grid</span>
          </div>
        </div>
      </div>

      {/* Emergency Administrative Advisory (Dismissible) */}
      {showNoticeBanner && (
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 sm:px-6 py-1.5 text-xs text-amber-950 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            <span
              className="px-1.5 py-0.5 bg-amber-200/80 text-amber-900 font-mono text-[10px] font-bold tracking-wide"
              style={{ borderRadius: '3px' }}
            >
              CIRCULAR
            </span>
            <span className="truncate text-slate-800 font-medium">{t('emergencyNotice')}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowNoticeBanner(false)}
            className="text-amber-800/70 hover:text-amber-950 p-1 hover:bg-amber-100/50 transition-colors ml-2"
            style={{ borderRadius: '3px' }}
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => setActiveView('HOME')}
            className="flex items-center gap-3 text-left group transition-opacity hover:opacity-95"
          >
            <div
              className="w-9 h-9 bg-[#0C1E33] text-amber-400 flex items-center justify-center border border-slate-700 shadow-xs shrink-0"
              style={{ borderRadius: '4px' }}
            >
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  {t('portalTitle')}
                </span>
                <span
                  className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 border border-slate-200"
                  style={{ borderRadius: '3px' }}
                >
                  PDS LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-tight">
                {t('portalTagline')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView('HOME')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition-all ${
                activeView === 'HOME' || activeView === 'SHOP_DETAIL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t('navShops')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('REPORT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition-all ${
                activeView === 'REPORT'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{t('navReport')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('DEALER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition-all ${
                activeView === 'DEALER'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{t('navDealer')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('DECK')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition-all ${
                activeView === 'DECK'
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'border-blue-200/80 text-blue-800 bg-blue-50/50 hover:bg-blue-100/60'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{t('navDeck')}</span>
            </button>
          </nav>

          {/* Right Controls: Notifications & Language */}
          <div className="flex items-center gap-2.5">
            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`relative p-2 border transition-colors ${
                  showNotifDropdown
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={{ borderRadius: '4px' }}
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-red-600 text-white font-mono text-[10px] font-bold"
                    style={{ borderRadius: '3px' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifDropdown && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 shadow-xl z-50 overflow-hidden"
                  style={{ borderRadius: '4px' }}
                >
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {isMl ? 'സ്റ്റോക്ക് അറിയിപ്പുകൾ' : 'PDS Stock Arrival Alerts'}
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 font-semibold" style={{ borderRadius: '2px' }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={clearNotifications}
                        className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        {isMl ? 'മായ്ക്കുക' : 'Clear all'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-slate-400 hover:text-slate-700 p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 px-4 text-center space-y-1 text-slate-500">
                        <CheckCircle2 className="w-6 h-6 text-slate-300 mx-auto" />
                        <p className="text-xs">{isMl ? 'പുതിയ അറിയിപ്പുകൾ ഇല്ല.' : 'No stock notifications at this moment.'}</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3.5 text-xs cursor-pointer transition-colors ${
                            n.read ? 'bg-white opacity-80' : 'bg-blue-50/30'
                          } hover:bg-slate-50`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Segmented Language Selector */}
            <div
              className="flex items-center border border-slate-200 bg-slate-100/80 p-0.5"
              style={{ borderRadius: '4px' }}
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 border-transparent'
                }`}
                style={{ borderRadius: '3px' }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ml')}
                className={`px-2 py-1 text-xs font-semibold transition-all ${
                  language === 'ml'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 border-transparent'
                }`}
                style={{ borderRadius: '3px' }}
              >
                മലയാളം
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveView('HOME')}
            className={`py-1 px-2 border-b-2 transition-colors ${
              activeView === 'HOME' || activeView === 'SHOP_DETAIL'
                ? 'text-slate-900 border-slate-900 font-bold'
                : 'text-slate-500 border-transparent'
            }`}
          >
            {t('navShops')}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('REPORT')}
            className={`py-1 px-2 border-b-2 transition-colors ${
              activeView === 'REPORT'
                ? 'text-slate-900 border-slate-900 font-bold'
                : 'text-slate-500 border-transparent'
            }`}
          >
            {t('navReport')}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('DEALER')}
            className={`py-1 px-2 border-b-2 transition-colors ${
              activeView === 'DEALER'
                ? 'text-slate-900 border-slate-900 font-bold'
                : 'text-slate-500 border-transparent'
            }`}
          >
            {t('navDealer')}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('DECK')}
            className={`py-1 px-2 border-b-2 transition-colors ${
              activeView === 'DECK'
                ? 'text-blue-700 border-blue-700 font-bold'
                : 'text-blue-800 border-transparent'
            }`}
          >
            {t('navDeck')}
          </button>
        </div>
      </div>
    </header>
  );
};

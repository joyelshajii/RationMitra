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
  PhoneCall,
  CheckCircle2,
  Sparkles,
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
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all shadow-xs">
      {/* Sleek Institutional Civic Banner */}
      <div className="bg-[#0C1E33] text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
            <span className="font-medium tracking-wide text-slate-200 truncate">
              {isMl
                ? 'കേരള സർക്കാർ • ഭക്ഷ്യ പൊതുവിതരണ വകുപ്പ്'
                : 'Government of Kerala • Civil Supplies Department'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-slate-300 text-[11px]">
            <a
              href="tel:1967"
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-medium transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>1967 (Toll-Free)</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">PDS Live Grid</span>
          </div>
        </div>
      </div>

      {/* Emergency Advisory Banner (Dismissible, soft styling) */}
      {showNoticeBanner && (
        <div className="bg-amber-50 border-b border-amber-200/70 px-4 sm:px-6 py-2 text-xs text-amber-950 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-bold text-[10px] rounded-md tracking-wider shrink-0">
                NOTICE
              </span>
              <span className="truncate text-slate-800 font-medium">{t('emergencyNotice')}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowNoticeBanner(false)}
              className="text-amber-800/70 hover:text-amber-950 p-1 hover:bg-amber-200/50 rounded-md transition-colors shrink-0"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => setActiveView('HOME')}
            className="flex items-center gap-3 text-left group transition-all"
          >
            <div className="w-10 h-10 bg-[#0C1E33] text-amber-400 flex items-center justify-center rounded-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  {t('portalTitle')}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block leading-tight">
                {t('portalTagline')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveView('HOME')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeView === 'HOME' || activeView === 'SHOP_DETAIL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('navShops')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('REPORT')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeView === 'REPORT'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('navReport')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('DEALER')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeView === 'DEALER'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('navDealer')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('DECK')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeView === 'DECK'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{t('navDeck')}</span>
            </button>
          </nav>

          {/* Right Controls: Notifications & Language */}
          <div className="flex items-center gap-2">
            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`relative p-2.5 rounded-xl border transition-all ${
                  showNotifDropdown
                    ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-inner'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold rounded-full shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {isMl ? 'സ്റ്റോക്ക് അറിയിപ്പുകൾ' : 'Stock Arrival Alerts'}
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={clearNotifications}
                        className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        {isMl ? 'മായ്ക്കുക' : 'Clear all'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 px-4 text-center space-y-2 text-slate-500">
                        <CheckCircle2 className="w-7 h-7 text-slate-300 mx-auto" />
                        <p className="text-xs">{isMl ? 'പുതിയ അറിയിപ്പുകൾ ഇല്ല.' : 'No stock notifications at this moment.'}</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3.5 text-xs cursor-pointer transition-colors ${
                            n.read ? 'bg-white opacity-85' : 'bg-blue-50/40 font-medium'
                          } hover:bg-slate-50`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Segmented Language Selector */}
            <div className="flex items-center border border-slate-200 bg-slate-100/90 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ml')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'ml'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                മലയാളം
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden grid grid-cols-4 gap-1 py-2 border-t border-slate-200/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveView('HOME')}
            className={`py-1.5 px-2 text-center rounded-lg transition-all flex flex-col items-center gap-0.5 ${
              activeView === 'HOME' || activeView === 'SHOP_DETAIL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t('navShops')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('REPORT')}
            className={`py-1.5 px-2 text-center rounded-lg transition-all flex flex-col items-center gap-0.5 ${
              activeView === 'REPORT'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t('navReport')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('DEALER')}
            className={`py-1.5 px-2 text-center rounded-lg transition-all flex flex-col items-center gap-0.5 ${
              activeView === 'DEALER'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t('navDealer')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('DECK')}
            className={`py-1.5 px-2 text-center rounded-lg transition-all flex flex-col items-center gap-0.5 ${
              activeView === 'DECK'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 bg-blue-50/60'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t('navDeck')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};


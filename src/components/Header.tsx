import React, { useState } from 'react';
import { usePds } from '../context/PdsContext';
import { Shield, Bell, Globe, Store, FileSpreadsheet, KeyRound, Presentation, CheckCircle, ExternalLink, X } from 'lucide-react';
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
    <header className="border-b border-slate-300 bg-white sticky top-0 z-40">
      {/* Top Official Government Banner */}
      <div className="bg-[#0F2942] text-slate-100 text-[11px] py-1 px-4 border-b border-[#1E3A8A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-emerald-400" style={{ borderRadius: '1px' }} />
            <span className="font-medium tracking-wide">
              {isMl
                ? 'കേരള സർക്കാർ • ഭക്ഷ്യ, പൊതുവിതരണ, ഉപഭോക്തൃകാര്യ വകുപ്പ്'
                : 'Government of Kerala • Department of Food, Civil Supplies & Consumer Affairs'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
            <span>NFSA PDS Portal • Toll Free: 1967</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Kottayam District ARD Grid</span>
          </div>
        </div>
      </div>

      {/* Emergency Administrative Notice */}
      {showNoticeBanner && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-950 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 font-mono text-[10px] font-bold" style={{ borderRadius: '2px' }}>
              PDS NOTICE
            </span>
            <span className="truncate">{t('emergencyNotice')}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowNoticeBanner(false)}
            className="text-amber-700 hover:text-amber-950 p-0.5 ml-2"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Identity */}
          <button
            type="button"
            onClick={() => setActiveView('HOME')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 bg-[#0F2942] text-amber-400 flex items-center justify-center border border-slate-700 shadow-xs" style={{ borderRadius: '4px' }}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {t('portalTitle')}
                </span>
                <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 border border-slate-300" style={{ borderRadius: '2px' }}>
                  SC-09 PROTOTYPE
                </span>
              </div>
              <p className="text-xs text-slate-600 hidden sm:block">
                {t('portalTagline')}
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveView('HOME')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border transition-colors ${
                activeView === 'HOME' || activeView === 'SHOP_DETAIL'
                  ? 'bg-slate-100 text-[#0F2942] border-slate-300 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <Store className="w-4 h-4" />
              <span>{t('navShops')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('REPORT')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border transition-colors ${
                activeView === 'REPORT'
                  ? 'bg-slate-100 text-[#0F2942] border-slate-300 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('navReport')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('DEALER')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border transition-colors ${
                activeView === 'DEALER'
                  ? 'bg-slate-100 text-[#0F2942] border-slate-300 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <KeyRound className="w-4 h-4" />
              <span>{t('navDealer')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('DECK')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border transition-colors ${
                activeView === 'DECK'
                  ? 'bg-blue-50 text-blue-950 border-blue-300 shadow-xs'
                  : 'border-transparent text-blue-800 hover:bg-blue-50/50'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <Presentation className="w-4 h-4 text-blue-700" />
              <span>{t('navDeck')}</span>
            </button>
          </nav>

          {/* Right Controls: Notifications & Language Toggle */}
          <div className="flex items-center gap-2">
            {/* Notifications Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                style={{ borderRadius: '4px' }}
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-red-600 text-white font-mono text-[10px] font-bold" style={{ borderRadius: '2px' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifDropdown && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-300 shadow-xl z-50 overflow-hidden"
                  style={{ borderRadius: '4px' }}
                >
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {isMl ? 'സ്റ്റോക്ക് അറിയിപ്പുകൾ' : 'Live PDS Stock Alerts'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={clearNotifications}
                        className="text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        {isMl ? 'മായ്ക്കുക' : 'Clear'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">
                        {isMl ? 'പുതിയ അറിയിപ്പുകൾ ഇല്ല.' : 'No stock notifications yet.'}
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs cursor-pointer transition-colors ${
                            n.read ? 'bg-white opacity-80' : 'bg-blue-50/40 font-medium'
                          } hover:bg-slate-50`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

            {/* Language Switcher */}
            <div className="flex items-center border border-slate-300 bg-slate-50 p-0.5" style={{ borderRadius: '4px' }}>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                style={{ borderRadius: '2px' }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ml')}
                className={`px-2 py-1 text-xs font-semibold transition-colors ${
                  language === 'ml'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                style={{ borderRadius: '2px' }}
              >
                മലയാളം
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveView('HOME')}
            className={`py-1 px-2 font-semibold ${
              activeView === 'HOME' || activeView === 'SHOP_DETAIL'
                ? 'text-blue-700 border-b-2 border-blue-700'
                : 'text-slate-600'
            }`}
          >
            {t('navShops')}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('REPORT')}
            className={`py-1 px-2 font-semibold ${
              activeView === 'REPORT' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-600'
            }`}
          >
            {t('navReport')}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('DEALER')}
            className={`py-1 px-2 font-semibold ${
              activeView === 'DEALER' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-600'
            }`}
          >
            {t('navDealer')}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('DECK')}
            className={`py-1 px-2 font-semibold ${
              activeView === 'DECK' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-600'
            }`}
          >
            {t('navDeck')}
          </button>
        </div>
      </div>
    </header>
  );
};

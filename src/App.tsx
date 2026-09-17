import React from 'react';
import { PdsProvider, usePds } from './context/PdsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuditModal } from './components/AuditModal';
import { SubscribeModal } from './components/SubscribeModal';
import { HomePage } from './pages/HomePage';
import { ShopDetailPage } from './pages/ShopDetailPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { DealerPortalPage } from './pages/DealerPortalPage';
import { DeckPage } from './pages/DeckPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

const AppContent: React.FC = () => {
  const { activeView } = usePds();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'HOME' && <HomePage />}
        {activeView === 'SHOP_DETAIL' && <ShopDetailPage />}
        {activeView === 'REPORT' && <CitizenReportPage />}
        {activeView === 'DEALER' && <DealerPortalPage />}
        {activeView === 'DECK' && <DeckPage />}
        {activeView === 'PRIVACY' && <PrivacyPolicyPage />}
        {activeView === 'TERMS' && <TermsPage />}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuditModal />
      <SubscribeModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PdsProvider>
      <AppContent />
    </PdsProvider>
  );
};

export default App;

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeBrowseView } from './components/HomeBrowseView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { FoodScannerModal } from './components/FoodScannerModal';
import { FoodDetailModal } from './components/FoodDetailModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeTab === 'browse' && <HomeBrowseView />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'checkout' && <CheckoutView />}
        {activeTab === 'confirmation' && <OrderConfirmationView />}
        {activeTab === 'tracking' && <OrderTrackingView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals & Overlays */}
      <FoodScannerModal />
      <FoodDetailModal />

      {/* Floating Scroll To Top */}
      <ScrollToTop />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

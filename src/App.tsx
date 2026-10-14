import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastRegion } from './components/ToastRegion';
import { LocationModal } from './components/LocationModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomeView } from './views/HomeView';
import { MerchantsView } from './views/MerchantsView';
import { CatalogView } from './views/CatalogView';
import { CartView } from './views/CartView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { MerchantPortalView } from './views/MerchantPortalView';
import { CompanyPortalView } from './views/CompanyPortalView';

const MainAppContent: React.FC = () => {
  const { route } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-[#272124]">
      <Header />
      <main className="flex-1">
        {route === 'home' && <HomeView />}
        {route === 'merchants' && <MerchantsView />}
        {route === 'catalog' && <CatalogView />}
        {route === 'cart' && <CartView />}
        {route === 'order' && <OrderTrackingView />}
        {route === 'merchant-portal' && <MerchantPortalView />}
        {route === 'company-portal' && <CompanyPortalView />}
      </main>
      <Footer />

      {/* Global Overlays */}
      <LocationModal />
      <ProductDetailModal />
      <ToastRegion />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

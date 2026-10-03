import React from 'react';
import { 
  Home, 
  QrCode, 
  ShoppingBag, 
  Bike, 
  Store 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsScannerOpen, 
    cartItemCount, 
    orders 
  } = useApp();

  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('browse')}
        className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          activeTab === 'browse' ? 'text-amber-600' : 'text-stone-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Menu</span>
      </button>

      <button
        onClick={() => setActiveTab('tracking')}
        className={`relative flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          activeTab === 'tracking' ? 'text-amber-600' : 'text-stone-500'
        }`}
      >
        <Bike className="w-5 h-5" />
        <span>Tracking</span>
        {activeOrdersCount > 0 && (
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-amber-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
            {activeOrdersCount}
          </span>
        )}
      </button>

      {/* Center Scan Hero Button */}
      <div className="-mt-6">
        <button
          onClick={() => setIsScannerOpen(true)}
          className="w-13 h-13 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 flex flex-col items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-white cursor-pointer transition-all"
          title="Scan Food Code"
        >
          <QrCode className="w-6 h-6 stroke-[2.2]" />
        </button>
        <span className="text-[10px] font-bold text-stone-700 block text-center mt-1">Scan</span>
      </div>

      <button
        onClick={() => setActiveTab('cart')}
        className={`relative flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          activeTab === 'cart' || activeTab === 'checkout' ? 'text-amber-600' : 'text-stone-500'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Cart</span>
        {cartItemCount > 0 && (
          <span className="absolute -top-1 right-1 w-4 h-4 bg-amber-500 text-stone-950 text-[10px] font-extrabold rounded-full flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('admin')}
        className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          activeTab === 'admin' ? 'text-amber-600' : 'text-stone-500'
        }`}
      >
        <Store className="w-5 h-5" />
        <span>Admin</span>
      </button>
    </div>
  );
};

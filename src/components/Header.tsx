import React from 'react';
import { 
  ShoppingBag, 
  QrCode, 
  Bike, 
  Store, 
  Sparkles, 
  Search,
  Layers,
  UtensilsCrossed
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsScannerOpen, 
    cartItemCount, 
    orders 
  } = useApp();

  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('browse')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-stone-950 block leading-tight">
              Quick<span className="text-amber-500">Bite</span>
            </span>
            <span className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase block">
              Food & Code Scanner
            </span>
          </div>
        </div>

        {/* Center Nav Links - Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-white text-stone-950 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Food Menu
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracking'
                ? 'bg-white text-stone-950 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-amber-500" />
            <span>Track Orders</span>
            {activeOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-white text-stone-950 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-stone-500" />
            <span>Restaurant Admin</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Prominent Scan Food Button in Header */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Scan Food Barcode or QR"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Scan Food</span>
          </button>

          {/* Cart Icon with Counter */}
          <button
            onClick={() => setActiveTab('cart')}
            className="relative p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors cursor-pointer"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-5 h-5 text-stone-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-950 font-extrabold text-[11px] rounded-full flex items-center justify-center ring-2 ring-white shadow-sm animate-in zoom-in-75">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

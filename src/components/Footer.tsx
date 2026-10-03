import React from 'react';
import { UtensilsCrossed, ShieldCheck, Banknote, QrCode, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsScannerOpen } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 pt-12 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Info Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-base font-extrabold text-white">
                Quick<span className="text-amber-500">Bite</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Order hot meals from top-rated restaurants. Scan food barcodes to re-order instantly, with guaranteed Cash on Delivery.
            </p>
            <div className="flex items-center gap-2 text-stone-300 font-medium">
              <Banknote className="w-4 h-4 text-amber-400" />
              <span>Cash on Delivery (COD) Supported</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => setActiveTab('browse')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Browse Food Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsScannerOpen(true)} 
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <QrCode className="w-3 h-3 text-amber-500" />
                  Camera Barcode Scanner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tracking')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Track Active Orders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('admin')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Restaurant & Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Top Cuisines */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Popular Cuisines</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Dum Biryani & Kebabs</li>
              <li>Hand-tossed Artisan Pizzas</li>
              <li>Crispy Fried Chicken Burgers</li>
              <li>Sichuan Wok Noodles & Dimsums</li>
              <li>Chaat, Nachos & Street Bites</li>
            </ul>
          </div>

          {/* Support & COD Policy */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Support</h4>
            <p className="text-stone-400 leading-relaxed">
              Available 24/7 for order status queries, delivery updates, and cash payment support.
            </p>
            <div className="pt-1 text-stone-300">
              <span className="block font-semibold">Toll-free Hotline:</span>
              <span className="text-amber-400 font-mono text-sm font-bold">1800-419-BITE</span>
            </div>
          </div>
        </div>

        {/* Center Aligned Attribution Required by User Prompt */}
        <div className="text-center pt-2">
          <p className="text-sm font-medium text-stone-400">
            Developed by{' '}
            <a 
              href="https://iwebnext.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
            >
              iWebNext
            </a>
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            © {new Date().getFullYear()} QuickBite Technologies Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer, Copy, Check, QrCode as QrIcon, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';

interface QRCodeModalProps {
  foodItem: FoodItem | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ foodItem, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (foodItem && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        foodItem.code,
        {
          width: 260,
          margin: 2,
          color: {
            dark: '#1c1917', // stone-900
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [foodItem]);

  if (!foodItem) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(foodItem.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QR_${foodItem.code}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <QrIcon className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold">Food QR & Barcode Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable/Display Area */}
        <div className="p-6 text-center space-y-4 printable-qr-card">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className={`inline-flex items-center justify-center w-3 h-3 rounded border ${
                foodItem.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${foodItem.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
              </span>
              <span className="text-xs font-semibold text-stone-600">{foodItem.restaurantName}</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900">{foodItem.name}</h2>
            <p className="text-sm font-extrabold text-amber-600">₹{foodItem.price}</p>
          </div>

          {/* QR Canvas */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 inline-block shadow-inner">
            <canvas ref={canvasRef} className="mx-auto rounded-lg shadow-sm" />
          </div>

          {/* Code text badge */}
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-medium">
              Encoded Unique Item Code
            </span>
            <div className="inline-flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
              <span className="font-mono text-xs font-bold text-stone-900">{foodItem.code}</span>
              <button
                onClick={handleCopyCode}
                className="text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
            Customers can point their camera at this QR code in the QuickBite app to scan & add this dish directly to their cart.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download PNG
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Card
          </button>
        </div>
      </div>
    </div>
  );
};

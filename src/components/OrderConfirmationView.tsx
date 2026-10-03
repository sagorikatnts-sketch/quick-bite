import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  MapPin, 
  Clock, 
  Phone, 
  Banknote, 
  ArrowRight, 
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Bike
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderConfirmationView: React.FC = () => {
  const { activeOrder, setActiveTab } = useApp();

  useEffect(() => {
    // Confetti effect on order placement
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  if (!activeOrder) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <p className="text-stone-500">No active order found.</p>
        <button
          onClick={() => setActiveTab('browse')}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      {/* Success banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <CheckCircle className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-sm font-semibold text-amber-600 mt-1">
          Order #{activeOrder.id} confirmed. Please pay ₹{activeOrder.grandTotal} in cash when your order is delivered.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden mb-6">
        {/* Estimated Time Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-stone-400">Estimated Delivery Time</span>
              <h3 className="text-lg font-bold text-white">{activeOrder.estimatedDeliveryTime}</h3>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full">
            {activeOrder.status}
          </span>
        </div>

        {/* COD Payment Highlight */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Banknote className="w-5 h-5 text-amber-600" />
            <div>
              <span className="text-xs font-bold text-amber-950 block">Payment: Cash on Delivery (COD)</span>
              <span className="text-[11px] text-amber-800">Status: {activeOrder.paymentStatus}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-500 block">Total Due in Cash</span>
            <span className="text-lg font-extrabold text-stone-950">₹{activeOrder.grandTotal}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Ordered Items */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Ordered Food Items ({activeOrder.items.length})
            </h4>
            <div className="divide-y divide-stone-100">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`inline-flex items-center justify-center w-3 h-3 rounded border shrink-0 ${
                      item.foodItem.isVeg ? 'border-emerald-600' : 'border-rose-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.foodItem.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </span>
                    <span className="font-semibold text-stone-900 truncate">
                      {item.quantity}x {item.foodItem.name}
                    </span>
                    {item.selectedOptions.length > 0 && (
                      <span className="text-stone-400 truncate hidden sm:inline">
                        ({item.selectedOptions.map(o => o.name).join(', ')})
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block font-medium mb-1">Delivering To</span>
              <p className="font-bold text-stone-900">{activeOrder.customer.name}</p>
              <p className="text-stone-600 mt-0.5">{activeOrder.customer.address}</p>
              {activeOrder.customer.landmark && (
                <p className="text-stone-500 text-[11px] mt-0.5">Landmark: {activeOrder.customer.landmark}</p>
              )}
            </div>
            <div>
              <span className="text-stone-400 block font-medium mb-1">Contact Phone</span>
              <p className="font-bold text-stone-900 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                +91 {activeOrder.customer.phone}
              </p>
              {activeOrder.customer.instructions && (
                <p className="text-stone-500 text-[11px] mt-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <strong>Instructions:</strong> {activeOrder.customer.instructions}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setActiveTab('tracking')}
            className="flex-1 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Bike className="w-4 h-4" />
            Track Live Order Status
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className="py-3 px-5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            Order More Food
          </button>
        </div>
      </div>
    </div>
  );
};

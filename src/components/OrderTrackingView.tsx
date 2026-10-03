import React from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  Home, 
  Phone, 
  MapPin, 
  Clock, 
  Banknote, 
  RotateCw, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { activeOrder, orders, setActiveOrderById, updateOrderStatus, updatePaymentStatus, setActiveTab } = useApp();

  const statuses: { key: OrderStatus; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'Order Placed', label: 'Order Placed', desc: 'Received by the restaurant', icon: ClipboardCheck },
    { key: 'Order Confirmed', label: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle2 },
    { key: 'Food Being Prepared', label: 'Food Being Prepared', desc: 'Chef is cooking your fresh meal', icon: ChefHat },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Delivery partner is on the way', icon: Bike },
    { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your food! Payment completed', icon: Home }
  ];

  if (!activeOrder) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-lg font-bold text-stone-900 mb-2">No Active Order</h2>
        <p className="text-stone-500 text-xs mb-4">You do not have any ongoing order to track right now.</p>
        <button
          onClick={() => setActiveTab('browse')}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Explore Food Menu
        </button>
      </div>
    );
  }

  const currentIdx = statuses.findIndex(s => s.key === activeOrder.status);

  // Helper to advance simulation
  const handleAdvanceStatus = () => {
    if (currentIdx < statuses.length - 1) {
      const nextStatus = statuses[currentIdx + 1].key;
      updateOrderStatus(activeOrder.id, nextStatus);
      if (nextStatus === 'Delivered') {
        updatePaymentStatus(activeOrder.id, 'Cash Received');
      }
    }
  };

  const handleResetStatus = () => {
    updateOrderStatus(activeOrder.id, 'Order Placed');
    updatePaymentStatus(activeOrder.id, 'Pending Cash Collection');
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Bar with back to browse */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('browse')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Food Menu
        </button>

        {/* Switch order selector if multiple */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Track other order:</span>
            <select
              value={activeOrder.id}
              onChange={(e) => setActiveOrderById(e.target.value)}
              className="text-xs font-mono font-semibold bg-white border border-stone-200 rounded-lg px-2 py-1 text-stone-800"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  #{o.id} ({o.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Hero Tracking Card */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-bold">Order #{activeOrder.id}</span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-stone-300">
                {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {activeOrder.status === 'Delivered' ? 'Order Delivered!' : 'Arriving in ~25-35 mins'}
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              {statuses[currentIdx]?.desc || activeOrder.status}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-800/90 border border-stone-700 px-3.5 py-2 rounded-xl shrink-0">
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="block text-[10px] text-stone-400 uppercase tracking-wider">Estimated Delivery</span>
              <span className="text-xs font-bold text-white">{activeOrder.estimatedDeliveryTime}</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Milestones Bar */}
        <div className="p-6 sm:p-8 bg-stone-50/50 border-b border-stone-100">
          <div className="relative">
            {/* Desktop / Tablet Horizontal Bar */}
            <div className="hidden sm:block">
              {/* Connecting line */}
              <div className="absolute top-5 left-6 right-6 h-1 bg-stone-200 -z-0">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }}
                />
              </div>

              <div className="relative z-10 flex justify-between">
                {statuses.map((step, idx) => {
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center max-w-[100px]">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-500/20 shadow-md scale-110'
                          : isDone
                          ? 'bg-amber-500 text-white'
                          : 'bg-white border-2 border-stone-300 text-stone-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-bold mt-2.5 leading-tight ${
                        isCurrent ? 'text-amber-600' : isDone ? 'text-stone-900' : 'text-stone-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Vertical Bar */}
            <div className="sm:hidden space-y-4">
              {statuses.map((step, idx) => {
                const isDone = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-500/20'
                          : isDone
                          ? 'bg-amber-500 text-white'
                          : 'bg-white border-2 border-stone-300 text-stone-400'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {idx < statuses.length - 1 && (
                        <div className={`w-0.5 h-6 my-1 ${idx < currentIdx ? 'bg-amber-500' : 'bg-stone-200'}`} />
                      )}
                    </div>

                    <div className="pt-1">
                      <p className={`text-xs font-bold ${
                        isCurrent ? 'text-amber-600' : isDone ? 'text-stone-900' : 'text-stone-400'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-stone-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Simulation Control Box (Allows customer or tester to step through states) */}
        <div className="p-4 bg-amber-50/60 border-b border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-950">Status Simulator:</span>
            <span className="text-amber-800">Test live driver & kitchen progression</span>
          </div>

          <div className="flex items-center gap-2">
            {currentIdx < statuses.length - 1 ? (
              <button
                onClick={handleAdvanceStatus}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Advance to next: <strong>{statuses[currentIdx + 1].label}</strong></span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleResetStatus}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                Reset Tracking Flow
              </button>
            )}
          </div>
        </div>

        {/* Rider & Cash on Delivery Callout */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver Card */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Assigned Delivery Hero
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                Active on route
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-bold text-base shrink-0">
                <Bike className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-stone-900 truncate">
                  {activeOrder.deliveryPartner?.name || 'Vikram Singh'}
                </h4>
                <p className="text-xs text-stone-500">
                  {activeOrder.deliveryPartner?.vehicle || 'Hero Splendor (KA-03-HA-8821)'}
                </p>
                <p className="text-xs text-amber-600 font-medium mt-0.5">
                  ⭐ 4.9 Rating (1,280+ deliveries)
                </p>
              </div>

              <a
                href={`tel:${activeOrder.deliveryPartner?.phone || '9845122910'}`}
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm shrink-0 transition-colors"
                title="Call delivery rider"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cash Payment Card */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Payment to Collect
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeOrder.paymentStatus === 'Cash Received'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {activeOrder.paymentStatus}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-stone-950">₹{activeOrder.grandTotal}</span>
                <span className="text-xs text-stone-500">Cash on Delivery</span>
              </div>

              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {activeOrder.paymentStatus === 'Cash Received'
                  ? '✓ Cash has been paid to the delivery rider. Thank you!'
                  : 'Please keep exact cash ready to hand over to the delivery rider upon delivery.'}
              </p>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official COD receipt delivered with order package</span>
            </div>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="p-5 sm:p-6 border-t border-stone-100 bg-stone-50/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Package Contents ({activeOrder.items.reduce((s, i) => s + i.quantity, 0)} items)
          </h4>
          <div className="space-y-2">
            {activeOrder.items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800">{it.quantity}x</span>
                  <span className="text-stone-700">{it.foodItem.name}</span>
                  {it.selectedOptions.length > 0 && (
                    <span className="text-stone-400 text-[11px]">
                      (+{it.selectedOptions.map(o => o.name).join(', ')})
                    </span>
                  )}
                </div>
                <span className="font-semibold text-stone-900">₹{it.lineTotal}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between items-center text-xs">
            <span className="text-stone-500">Destination: {activeOrder.customer.address}</span>
            <span className="font-bold text-stone-900">Grand Total: ₹{activeOrder.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

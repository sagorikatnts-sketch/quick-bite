import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartTotal, 
    createOrder, 
    setActiveTab, 
    getPromoDiscount,
    showToast 
  } = useApp();

  const [name, setName] = useState('Rohan Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('Flat 402, Sunshine Apartments, 5th Cross Road, Indiranagar');
  const [landmark, setLandmark] = useState('Near Metro Station Pillar 84');
  const [instructions, setInstructions] = useState('Please call before ringing the doorbell.');
  const [selectedInstructionChip, setSelectedInstructionChip] = useState('Please call before ringing');

  const [paymentMethod] = useState<'COD'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = cartTotal > 350 ? 0 : 35;
  const promoResult = getPromoDiscount('QUICK20', cartTotal);
  const discountAmount = promoResult.valid ? promoResult.discount : 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee - discountAmount);

  const quickInstructions = [
    'Leave at door',
    'Do not ring bell (Baby sleeping)',
    'Call upon arrival',
    'Hand over to security guard'
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!address.trim()) errs.address = 'Delivery address is required';
    if (address.trim().length < 10) errs.address = 'Please enter a complete address with street/building';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the delivery details');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty');
      setActiveTab('browse');
      return;
    }

    setIsSubmitting(true);

    // Simulate small network delay for realistic experience
    setTimeout(() => {
      createOrder({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        landmark: landmark.trim() || undefined,
        instructions: instructions.trim() || undefined
      }, 'QUICK20');

      setIsSubmitting(false);
      setActiveTab('confirmation');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={() => setActiveTab('cart')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Food Basket
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-950 tracking-tight">Checkout & Delivery Details</h1>
          <p className="text-xs text-stone-500 mt-0.5">Please confirm your delivery address and Cash on Delivery order</p>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Estimated 30-40 min</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        {/* Customer & Address Form */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            1. Delivery Address & Recipient
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-stone-50 border rounded-xl text-xs text-stone-900 focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 focus:border-amber-500'
                  }`}
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className={`w-full pl-9 pr-3 py-2.5 bg-stone-50 border rounded-xl text-xs text-stone-900 focus:outline-none transition-colors ${
                    errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 focus:border-amber-500'
                  }`}
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Complete Delivery Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <textarea
                rows={2}
                placeholder="House / Flat No., Apartment Name, Street, Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 bg-stone-50 border rounded-xl text-xs text-stone-900 focus:outline-none transition-colors resize-none ${
                  errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 focus:border-amber-500'
                }`}
              />
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            </div>
            {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Opposite City Mall, Near Metro Pillar #84"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Delivery Instructions for Rider
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickInstructions.map((qi) => (
                <button
                  type="button"
                  key={qi}
                  onClick={() => {
                    setSelectedInstructionChip(qi);
                    setInstructions(qi);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    instructions.includes(qi)
                      ? 'bg-amber-500 text-white border-amber-500 font-semibold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {qi}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Custom instructions (e.g. ring twice, gate code)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Payment Method - Cash on Delivery Primary */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
            <Banknote className="w-4 h-4 text-amber-500" />
            2. Payment Method
          </h2>

          <div className="space-y-3">
            {/* Cash on Delivery Selection */}
            <div className="border-2 border-amber-500 bg-amber-50/50 rounded-xl p-4 flex items-start justify-between cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-500 text-white flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-950 text-sm">Cash on Delivery (COD)</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                      Selected Method
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Pay <strong className="text-stone-950 font-bold">₹{grandTotal}</strong> in cash to the delivery partner when your food arrives at your door.
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1 font-medium">
                    ✓ No online transaction fees · No card details needed · Keep exact change ready
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base font-extrabold text-stone-950">₹{grandTotal}</span>
                <span className="block text-[10px] text-stone-500">In Cash</span>
              </div>
            </div>

            {/* Modular payment placeholder - Online payments */}
            <div className="border border-stone-200 bg-stone-50/60 rounded-xl p-3.5 flex items-center justify-between opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border border-stone-300 bg-white" />
                <div>
                  <span className="font-medium text-stone-700 text-xs">Online Payment (UPI, Cards, NetBanking)</span>
                  <p className="text-[11px] text-stone-400">Integration ready · Available soon</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Disabled
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary & Submit Button */}
        <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <span className="text-xs text-stone-400 block">Total Amount to Pay on Delivery</span>
              <span className="text-2xl font-extrabold text-white">₹{grandTotal}</span>
            </div>
            <div className="text-right text-xs text-stone-400">
              <span>{cart.length} items from {cart[0]?.foodItem.restaurantName || 'Restaurants'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-stone-800/80 px-3 py-2 rounded-xl border border-stone-700">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              By placing this order, you agree to pay ₹{grandTotal} in cash upon food arrival.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 text-stone-950 font-extrabold text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                Confirming Order...
              </span>
            ) : (
              <span>Confirm Order (Pay ₹{grandTotal} via Cash on Delivery)</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

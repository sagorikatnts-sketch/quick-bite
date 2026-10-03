import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Bike,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROMO_CODES } from '../data/mockData';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartTotal, 
    setActiveTab,
    setIsScannerOpen,
    getPromoDiscount 
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('QUICK20');
  const [promoError, setPromoError] = useState<string | null>(null);

  const deliveryFee = cartTotal > 350 || cart.length === 0 ? 0 : 35;
  const promoResult = appliedPromo ? getPromoDiscount(appliedPromo, cartTotal) : { discount: 0, valid: false, message: '' };
  const discountAmount = promoResult.valid ? promoResult.discount : 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee - discountAmount);

  const handleApplyPromo = (code: string) => {
    setPromoError(null);
    const res = getPromoDiscount(code, cartTotal);
    if (res.valid) {
      setAppliedPromo(code.toUpperCase());
    } else {
      setPromoError(res.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <ShoppingBag className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
        <p className="text-stone-500 text-sm max-w-sm mx-auto mb-6">
          Explore delicious dishes from our top restaurants, or scan a food barcode to add items instantly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('browse')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Browse Food Menu
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            Scan Food Barcode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-950 tracking-tight">Your Food Basket</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} ready for order
          </p>
        </div>
        <button
          onClick={() => setIsScannerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-600" />
          Scan Another Dish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-3">
          {cart.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs flex gap-3.5 items-start"
            >
              <img
                src={item.foodItem.imageUrl}
                alt={item.foodItem.name}
                className="w-20 h-20 rounded-lg object-cover shrink-0 border border-stone-100"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`inline-flex items-center justify-center w-3 h-3 rounded border ${
                        item.foodItem.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.foodItem.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">{item.foodItem.restaurantName}</span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 leading-snug">{item.foodItem.name}</h3>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Selected Customizations */}
                {item.selectedOptions.length > 0 && (
                  <div className="text-[11px] text-stone-500 mt-1 space-y-0.5">
                    {item.selectedOptions.map((opt, i) => (
                      <span key={i} className="inline-block mr-2">
                        + {opt.name} {opt.price > 0 && `(₹${opt.price})`}
                      </span>
                    ))}
                  </div>
                )}

                {item.specialInstructions && (
                  <p className="text-[11px] text-stone-400 italic mt-0.5">
                    Note: "{item.specialInstructions}"
                  </p>
                )}

                {/* Price and Quantity Controller */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                  <div className="font-extrabold text-stone-950 text-sm">
                    ₹{item.lineTotal}
                    <span className="text-xs font-normal text-stone-400 ml-1.5">
                      (₹{item.unitPrice} each)
                    </span>
                  </div>

                  <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Free Delivery Callout */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-900">
            <Bike className="w-4 h-4 text-amber-600 shrink-0" />
            {cartTotal > 350 ? (
              <span className="font-semibold text-emerald-800">
                🎉 Congratulations! You have unlocked FREE Delivery!
              </span>
            ) : (
              <span>
                Add dishes worth <strong>₹{350 - cartTotal}</strong> more to get <strong>FREE delivery</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right: Bill Details & Promo */}
        <div className="lg:col-span-5 space-y-4">
          {/* Promo Code Box */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 uppercase tracking-wide">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              Apply Coupons & Offers
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError(null);
                }}
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => handleApplyPromo(promoInput)}
                className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            {promoError && (
              <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>
            )}

            {appliedPromo && promoResult.valid && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <span className="flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Code '{appliedPromo}' applied ({promoResult.message})
                </span>
                <button
                  onClick={() => setAppliedPromo(null)}
                  className="text-stone-400 hover:text-stone-700 text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Quick Promo Chips */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[11px] text-stone-400 block mb-1.5">Available Offers:</span>
              <div className="flex flex-wrap gap-1.5">
                {PROMO_CODES.map((promo) => (
                  <button
                    key={promo.code}
                    type="button"
                    onClick={() => handleApplyPromo(promo.code)}
                    className={`text-[11px] px-2 py-1 rounded border font-mono transition-colors cursor-pointer ${
                      appliedPromo === promo.code
                        ? 'bg-amber-500 text-white border-amber-500 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {promo.code} ({promo.discountPercent}%)
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Bill Summary
            </h3>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-stone-900">₹{cartTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-semibold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-stone-900">₹{deliveryFee}</span>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">- ₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-stone-950">To Pay (Cash on Delivery)</span>
                <span className="font-extrabold text-lg text-stone-950">₹{grandTotal}</span>
              </div>
            </div>

            {/* Cash on Delivery Notice */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Payment method: <strong>Cash on Delivery (COD)</strong>. Pay upon food arrival.
              </span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-between transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <span className="flex items-center gap-1">
                ₹{grandTotal} <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

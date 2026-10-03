import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Clock, Star, Flame, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem, SelectedOption } from '../types';

export const FoodDetailModal: React.FC = () => {
  const { selectedFoodForModal, setSelectedFoodForModal, addToCart } = useApp();
  const food = selectedFoodForModal;

  const [quantity, setQuantity] = useState(1);
  const [selectedRadioOptions, setSelectedRadioOptions] = useState<Record<string, { name: string; price: number }>>({});
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<SelectedOption[]>([]);
  const [specialNote, setSpecialNote] = useState('');

  // Initialize radio defaults when food item changes
  useEffect(() => {
    if (food) {
      setQuantity(1);
      setSpecialNote('');
      const initialRadios: Record<string, { name: string; price: number }> = {};
      if (food.customizations) {
        food.customizations.forEach(group => {
          if (group.type === 'radio' && group.options.length > 0) {
            initialRadios[group.title] = {
              name: group.options[0].name,
              price: group.options[0].price
            };
          }
        });
      }
      setSelectedRadioOptions(initialRadios);
      setSelectedCheckboxOptions([]);
    }
  }, [food]);

  if (!food) return null;

  // Calculate dynamic price
  const radioCost = Object.values(selectedRadioOptions).reduce((sum, opt) => sum + opt.price, 0);
  const checkboxCost = selectedCheckboxOptions.reduce((sum, opt) => sum + opt.price, 0);
  const unitPrice = food.price + radioCost + checkboxCost;
  const totalPrice = unitPrice * quantity;

  const handleCheckboxToggle = (groupTitle: string, optionName: string, optionPrice: number) => {
    setSelectedCheckboxOptions(prev => {
      const exists = prev.some(o => o.groupTitle === groupTitle && o.name === optionName);
      if (exists) {
        return prev.filter(o => !(o.groupTitle === groupTitle && o.name === optionName));
      } else {
        return [...prev, { groupTitle, name: optionName, price: optionPrice }];
      }
    });
  };

  const handleAddToCart = () => {
    // Collect all selected options
    const allOptions: SelectedOption[] = [
      ...Object.entries(selectedRadioOptions).map(([groupTitle, val]) => ({
        groupTitle,
        name: val.name,
        price: val.price
      })),
      ...selectedCheckboxOptions
    ];

    addToCart(food, quantity, allOptions, specialNote);
    setSelectedFoodForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setSelectedFoodForModal(null)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-100 overflow-hidden shrink-0">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/20" />
          
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded border ${
                food.isVeg ? 'border-emerald-500 bg-emerald-950/80' : 'border-rose-500 bg-rose-950/80'
              }`}>
                <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              </span>
              <span className="text-xs font-semibold text-stone-200">
                {food.isVeg ? 'Pure Veg' : 'Non-Veg'}
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-amber-400 font-mono">Code: {food.code}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">{food.name}</h2>
            <div className="flex items-center gap-3 text-xs text-stone-300 mt-0.5">
              <span>{food.restaurantName}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {food.rating} ({food.reviewCount})
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {food.preparationTime}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-sm">
          {/* Description */}
          <div>
            <p className="text-stone-600 leading-relaxed text-xs sm:text-sm">
              {food.description}
            </p>
          </div>

          {/* Customization Options */}
          {food.customizations && food.customizations.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-stone-100">
              {food.customizations.map((group) => (
                <div key={group.title} className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/70">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                      {group.title}
                    </span>
                    {group.required && (
                      <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isRadio = group.type === 'radio';
                      const isSelected = isRadio
                        ? selectedRadioOptions[group.title]?.name === option.name
                        : selectedCheckboxOptions.some(o => o.groupTitle === group.title && o.name === option.name);

                      return (
                        <label
                          key={option.name}
                          onClick={() => {
                            if (isRadio) {
                              setSelectedRadioOptions(prev => ({
                                ...prev,
                                [group.title]: { name: option.name, price: option.price }
                              }));
                            } else {
                              handleCheckboxToggle(group.title, option.name, option.price);
                            }
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-500/5 border-amber-500 text-stone-900 font-medium'
                              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-${isRadio ? 'full' : 'md'} border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-stone-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{option.name}</span>
                          </div>
                          <span className="font-semibold text-stone-900">
                            {option.price > 0 ? `+₹${option.price}` : 'Free'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cooking Instructions / Special Requests */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less spicy, keep extra cutlery, etc."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!food.isAvailable}
            className="flex-1 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              {food.isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </span>
            <span>₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

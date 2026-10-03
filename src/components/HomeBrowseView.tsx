import React, { useState } from 'react';
import { 
  Search, 
  QrCode, 
  Star, 
  Clock, 
  MapPin, 
  Plus, 
  Sliders, 
  Percent, 
  Sparkles, 
  ChevronRight, 
  Filter,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, FoodItem } from '../types';

export const HomeBrowseView: React.FC = () => {
  const { 
    foodItems, 
    restaurants, 
    addToCart, 
    setSelectedFoodForModal, 
    setIsScannerOpen,
    setActiveTab 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const categories: { name: Category; emoji: string }[] = [
    { name: 'All', emoji: '🍽️' },
    { name: 'Biryani', emoji: '🍗' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Chinese', emoji: '🥢' },
    { name: 'Snacks', emoji: '🍟' },
    { name: 'Desserts', emoji: '🍰' },
    { name: 'Beverages', emoji: '🥤' }
  ];

  // Filtering logic
  const filteredFoods = foodItems.filter(item => {
    // Search query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      item.restaurantName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    // Category filter
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;

    // Dietary filter
    const matchesDiet = 
      dietaryFilter === 'all' ||
      (dietaryFilter === 'veg' && item.isVeg) ||
      (dietaryFilter === 'non-veg' && !item.isVeg);

    // Restaurant filter
    const matchesRest = !selectedRestaurant || item.restaurantId === selectedRestaurant || item.restaurantName === selectedRestaurant;

    return matchesSearch && matchesCat && matchesDiet && matchesRest;
  });

  const popularItems = foodItems.slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl border border-stone-800">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-rose-500 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 sm:py-14 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            {/* Top kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Superfast Delivery · Cash on Delivery Accepted</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Craving Delicious Food? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
                Scan, Order & Pay on Delivery.
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Order piping hot biryani, cheesy pizzas, gourmet burgers, and wok dishes from local top kitchens. Pay easily in cash at your doorstep!
            </p>

            {/* Hero Search & Prominent Scan Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for food, restaurants, or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-stone-800/90 border border-stone-700 rounded-2xl text-sm text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all shadow-inner"
                />
              </div>

              {/* Prominent Scan Food Button */}
              <button
                onClick={() => setIsScannerOpen(true)}
                className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer shrink-0"
              >
                <QrCode className="w-5 h-5" />
                <span>Scan Food</span>
              </button>
            </div>

            {/* Quick value badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-400 font-medium">
              <span className="flex items-center gap-1.5 text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Camera Scanner
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                100% Cash on Delivery
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Avg 30 Mins Delivery
              </span>
            </div>
          </div>

          {/* Right Hero Graphic Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-700">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious Chicken Biryani"
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
                
                {/* Floating Scan Quick-Action Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Have a food barcode?</span>
                      <p className="text-xs font-semibold text-white">Scan barcode or QR to re-order instantly</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS & DISCOUNTS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Coupon: QUICK20
              </span>
              <h4 className="text-sm font-bold text-stone-900">20% Flat Discount</h4>
              <p className="text-xs text-stone-500">On all orders above ₹200</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
              %
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Free Delivery
              </span>
              <h4 className="text-sm font-bold text-stone-900">₹0 Delivery Fee</h4>
              <p className="text-xs text-stone-500">Auto-applied above ₹350</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ⚡
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-900/10 to-stone-900/5 border border-stone-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-800 bg-stone-200 px-2 py-0.5 rounded">
                Payment Method
              </span>
              <h4 className="text-sm font-bold text-stone-900">Cash on Delivery</h4>
              <p className="text-xs text-stone-500">Pay cash when food arrives</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm">
              💵
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES HORIZONTAL NAVIGATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Explore Categories</h2>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
            >
              Reset to All
            </button>
          )}
        </div>

        {/* Categories segmented buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">Featured Restaurants</h2>
            <p className="text-xs text-stone-500">Top-rated kitchens delivering to your neighborhood</p>
          </div>
          {selectedRestaurant && (
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="text-xs text-amber-600 font-semibold cursor-pointer"
            >
              Clear restaurant filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((rest) => {
            const isSelected = selectedRestaurant === rest.id || selectedRestaurant === rest.name;
            return (
              <div
                key={rest.id}
                onClick={() => setSelectedRestaurant(isSelected ? null : rest.name)}
                className={`group bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer shadow-2xs hover:shadow-md ${
                  isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={rest.imageUrl}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                  
                  {rest.offerBadge && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-sm">
                      {rest.offerBadge}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">{rest.deliveryTime}</span>
                    <span className="flex items-center gap-1 bg-stone-900/80 px-2 py-0.5 rounded-md font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {rest.rating} ({rest.reviewsCount})
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-600 transition-colors">
                      {rest.name}
                    </h3>
                    <span className="text-[11px] text-stone-400">{rest.distance}</span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {rest.cuisine.join(' · ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FILTER CONTROLS BAR: VEG / NON-VEG & SEARCH STATUS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Dietary:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  dietaryFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Non-Veg
              </button>
            </div>
          </div>

          <div className="text-xs text-stone-500">
            Showing <strong className="text-stone-900">{filteredFoods.length}</strong> delicious dishes
          </div>
        </div>
      </section>

      {/* FOOD MENU GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            {selectedCategory === 'All' ? 'Popular Food Items' : `${selectedCategory} Dishes`}
          </h2>
          <span className="text-xs text-stone-500">
            Scan barcode or click to order
          </span>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/80">
            <p className="text-sm font-semibold text-stone-700">No food items found matching your filters</p>
            <p className="text-xs text-stone-400 mt-1">Try clearing filters or search for another dish</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setDietaryFilter('all');
                setSelectedRestaurant(null);
              }}
              className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Food Card Image */}
                  <div 
                    onClick={() => setSelectedFoodForModal(food)}
                    className="relative h-44 overflow-hidden bg-stone-100 cursor-pointer"
                  >
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-80" />

                    {/* Barcode/Code Overlay Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-md border border-stone-700 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <QrCode className="w-3 h-3" />
                      {food.code}
                    </div>

                    {/* Dietary badge */}
                    <div className="absolute top-2.5 left-2.5 bg-white/95 p-1 rounded-md shadow-sm">
                      <span className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded border ${
                        food.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>
                    </div>

                    {/* Preparation Time & Rating on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1 bg-stone-900/70 px-2 py-0.5 rounded text-[11px]">
                        <Clock className="w-3 h-3" />
                        {food.preparationTime}
                      </span>
                      <span className="flex items-center gap-1 bg-stone-900/70 px-2 py-0.5 rounded text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {food.rating}
                      </span>
                    </div>
                  </div>

                  {/* Food Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-medium text-stone-500">
                        {food.restaurantName}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-400">
                        {food.category}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedFoodForModal(food)}
                      className="font-bold text-stone-900 text-sm leading-snug cursor-pointer group-hover:text-amber-600 transition-colors line-clamp-1"
                    >
                      {food.name}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {food.description}
                    </p>
                  </div>
                </div>

                {/* Card Action & Price Footer */}
                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-stone-950">₹{food.price}</span>
                    {food.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">₹{food.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {food.customizations && food.customizations.length > 0 && (
                      <button
                        onClick={() => setSelectedFoodForModal(food)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors cursor-pointer"
                        title="Customize options"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => addToCart(food)}
                      disabled={!food.isAvailable}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-amber-500/20 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* QUICK SCAN CTA BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-stone-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-amber-500/15">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider bg-stone-950 text-amber-400 px-3 py-1 rounded-full inline-block">
              Camera-Based Ordering
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
              Have a QuickBite code on your table or food box?
            </h3>
            <p className="text-stone-900 text-xs sm:text-sm font-medium max-w-lg">
              Open the scanner, hold the barcode or QR code in front of your camera, and it instantly loads the dish with 1-tap Cash on Delivery ordering.
            </p>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-6 py-3.5 bg-stone-950 hover:bg-stone-900 text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center gap-2.5 transition-all cursor-pointer shrink-0"
          >
            <QrCode className="w-5 h-5 text-amber-400" />
            <span>Launch Camera Scanner</span>
          </button>
        </div>
      </section>
    </div>
  );
};

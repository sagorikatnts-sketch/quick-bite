import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  QrCode, 
  CheckCircle, 
  Clock, 
  Banknote, 
  TrendingUp, 
  Package, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Search, 
  Filter,
  Check,
  AlertCircle,
  Eye,
  Store,
  RefreshCw,
  LogOut,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem, Order, OrderStatus, PaymentStatus } from '../types';
import { QRCodeModal } from './QRCodeModal';

export const AdminDashboard: React.FC = () => {
  const { 
    foodItems, 
    orders, 
    addFoodItem, 
    updateFoodItem, 
    deleteFoodItem, 
    toggleFoodAvailability,
    updateOrderStatus,
    updatePaymentStatus,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    showToast,
    setActiveTab
  } = useApp();

  const [currentTab, setCurrentTab] = useState<'orders' | 'menu'>('orders');
  const [selectedFoodForQR, setSelectedFoodForQR] = useState<FoodItem | null>(null);

  // Filter & Search states
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState('All');

  // Add / Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formPrice, setFormPrice] = useState(199);
  const [formOriginalPrice, setFormOriginalPrice] = useState(249);
  const [formCategory, setFormCategory] = useState('Pizza');
  const [formRestaurant, setFormRestaurant] = useState('Pizza Corner');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formPrepTime, setFormPrepTime] = useState('20 min');

  // Admin PIN Auth
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Preset food images for quick creation
  const presetImages = [
    { label: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
    { label: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Noodles', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80' },
    { label: 'Dessert', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Beverage', url: 'https://images.unsplash.com/photo-1570701564993-e00652af8aa7?auto=format&fit=crop&w=800&q=80' }
  ];

  // Auth check
  if (!isAdminLoggedIn) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (pinInput === '1234' || pinInput.trim().toLowerCase() === 'admin') {
        setIsAdminLoggedIn(true);
        setPinError(false);
      } else {
        setPinError(true);
      }
    };

    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-md p-6 sm:p-8 text-center">
          <div className="w-14 h-14 bg-stone-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-800 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Restaurant & Admin Portal</h2>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Authorized management for live orders, food catalog & QR barcode generation
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Admin Passcode (Default: <strong className="font-mono text-stone-900">1234</strong>)
              </label>
              <input
                type="password"
                placeholder="Enter passcode"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-center text-sm tracking-widest font-mono focus:outline-none focus:border-amber-500"
              />
              {pinError && (
                <p className="text-[11px] text-rose-500 mt-1 text-center font-medium">
                  Incorrect passcode. Use default: 1234
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Sign In to Dashboard
            </button>

            <button
              type="button"
              onClick={() => setIsAdminLoggedIn(true)}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              ⚡ Quick Demo 1-Click Access
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <button
              onClick={() => setActiveTab('browse')}
              className="text-xs text-stone-500 hover:text-stone-900 underline"
            >
              Return to Customer Food Delivery View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Analytics calculation
  const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalCashCollected = orders
    .filter(o => o.paymentStatus === 'Cash Received')
    .reduce((sum, o) => sum + o.grandTotal, 0);
  const totalPendingCash = orders
    .filter(o => o.paymentStatus !== 'Cash Received')
    .reduce((sum, o) => sum + o.grandTotal, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'All') return true;
    if (orderFilter === 'Pending Cash') return o.paymentStatus === 'Pending Cash Collection';
    if (orderFilter === 'Cash Received') return o.paymentStatus === 'Cash Received';
    return o.status === orderFilter;
  });

  // Filtered foods
  const filteredFoods = foodItems.filter(f => {
    const matchesCat = menuCatFilter === 'All' || f.category === menuCatFilter;
    const matchesSearch = f.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          f.code.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          f.restaurantName.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    const randomCodeSuffix = Math.floor(100 + Math.random() * 900);
    setFormCode(`FOOD-NEW-${randomCodeSuffix}`);
    setFormPrice(220);
    setFormOriginalPrice(260);
    setFormCategory('Pizza');
    setFormRestaurant('Pizza Corner');
    setFormDescription('Delicious chef-crafted recipe prepared with the finest fresh ingredients.');
    setFormImageUrl(presetImages[0].url);
    setFormIsVeg(true);
    setFormPrepTime('20 min');
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormPrice(item.price);
    setFormOriginalPrice(item.originalPrice || item.price + 40);
    setFormCategory(item.category);
    setFormRestaurant(item.restaurantName);
    setFormDescription(item.description);
    setFormImageUrl(item.imageUrl);
    setFormIsVeg(item.isVeg);
    setFormPrepTime(item.preparationTime);
    setIsEditModalOpen(true);
  };

  const handleSaveFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      showToast('Name and unique code are required');
      return;
    }

    if (editingItem) {
      updateFoodItem(editingItem.id, {
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        category: formCategory,
        restaurantName: formRestaurant,
        description: formDescription,
        imageUrl: formImageUrl || presetImages[0].url,
        isVeg: formIsVeg,
        preparationTime: formPrepTime
      });
    } else {
      addFoodItem({
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        category: formCategory,
        restaurantId: 'rest-custom',
        restaurantName: formRestaurant,
        description: formDescription,
        imageUrl: formImageUrl || presetImages[0].url,
        isVeg: formIsVeg,
        isAvailable: true,
        rating: 4.8,
        reviewCount: 1,
        preparationTime: formPrepTime
      });
    }

    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner with sign out & switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 text-white p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Restaurant & Partner Management Console</h1>
            <p className="text-xs text-stone-400">Manage live incoming orders, food menu catalog & scannable barcodes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Switch to Customer View
          </button>
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="p-2 bg-stone-800 hover:bg-rose-950/80 hover:text-rose-400 text-stone-400 rounded-lg transition-colors cursor-pointer"
            title="Log out from Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Total Sales Volume</span>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-950 mt-1">₹{totalSales}</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">{orders.length} total placed orders</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Cash Collected (COD)</span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">₹{totalCashCollected}</div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">Handed over by delivery riders</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Pending Cash to Collect</span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">₹{totalPendingCash}</div>
          <span className="text-[11px] text-amber-800 mt-0.5 block">Awaiting customer cash at door</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Active In-Flight Orders</span>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">{activeOrdersCount}</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Kitchen or out for delivery</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setCurrentTab('orders')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            currentTab === 'orders'
              ? 'border-amber-500 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Incoming Live Orders ({orders.length})
        </button>

        <button
          onClick={() => setCurrentTab('menu')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            currentTab === 'menu'
              ? 'border-amber-500 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Food Menu & QR Code Generator ({foodItems.length})
        </button>
      </div>

      {/* TAB 1: INCOMING ORDERS */}
      {currentTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-stone-400 font-semibold px-2">Filter:</span>
              {['All', 'Order Placed', 'Food Being Prepared', 'Out for Delivery', 'Delivered', 'Pending Cash', 'Cash Received'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setOrderFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === filter
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <span className="text-xs text-stone-400">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-stone-200/80">
              <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">No orders matching this filter</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-xl border border-stone-200/80 shadow-2xs overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="bg-stone-50/80 p-4 border-b border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-stone-900">
                        #{order.id}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs font-semibold text-stone-800">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* COD Payment Status Badge */}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        order.paymentStatus === 'Cash Received'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        💵 {order.paymentStatus}
                      </span>

                      {/* Order Lifecycle Status */}
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-900 text-white">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Items List */}
                    <div className="md:col-span-6 space-y-2">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Ordered Dishes
                      </h4>
                      <div className="space-y-1.5">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                            <div>
                              <span className="font-bold text-stone-900">{it.quantity}x</span> {it.foodItem.name}
                              {it.selectedOptions.length > 0 && (
                                <p className="text-[10px] text-stone-400 pl-4">
                                  {it.selectedOptions.map(o => o.name).join(', ')}
                                </p>
                              )}
                            </div>
                            <span className="font-semibold text-stone-800">₹{it.lineTotal}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-between text-xs font-bold text-stone-950 border-t border-stone-200">
                        <span>Grand Total (COD):</span>
                        <span className="text-sm">₹{order.grandTotal}</span>
                      </div>
                    </div>

                    {/* Customer & Delivery Destination */}
                    <div className="md:col-span-6 space-y-2 text-xs border-t md:border-t-0 md:border-l md:border-stone-100 md:pl-5 pt-3 md:pt-0">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Customer & Delivery Destination
                      </h4>
                      <div>
                        <p className="font-bold text-stone-900 text-sm">{order.customer.name}</p>
                        <a 
                          href={`tel:${order.customer.phone}`}
                          className="inline-flex items-center gap-1 text-amber-600 font-semibold hover:underline mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          +91 {order.customer.phone}
                        </a>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 inline mr-1" />
                        {order.customer.address}
                      </p>
                      {order.customer.landmark && (
                        <p className="text-stone-500 text-[11px]">
                          Landmark: {order.customer.landmark}
                        </p>
                      )}
                      {order.customer.instructions && (
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 text-stone-700 text-[11px]">
                          <strong>Instructions:</strong> {order.customer.instructions}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Management Actions Footer */}
                  <div className="bg-stone-50/50 p-3 sm:px-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-700">Update Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 font-semibold text-stone-800 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="Order Placed">1. Order Placed</option>
                        <option value="Order Confirmed">2. Order Confirmed</option>
                        <option value="Food Being Prepared">3. Food Being Prepared</option>
                        <option value="Out for Delivery">4. Out for Delivery</option>
                        <option value="Delivered">5. Delivered</option>
                      </select>
                    </div>

                    {/* Cash on Delivery Toggle Button */}
                    <div className="flex items-center gap-2">
                      {order.paymentStatus === 'Pending Cash Collection' ? (
                        <button
                          onClick={() => updatePaymentStatus(order.id, 'Cash Received')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark Cash Received (₹{order.grandTotal})
                        </button>
                      ) : (
                        <button
                          onClick={() => updatePaymentStatus(order.id, 'Pending Cash Collection')}
                          className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                          Revert to Pending Cash
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MENU & QR CODE CATALOG */}
      {currentTab === 'menu' && (
        <div className="space-y-4">
          {/* Controls: Search, Category Filter, and Add Food Item CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200/80">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dish or barcode code..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={menuCatFilter}
                onChange={(e) => setMenuCatFilter(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-stone-700 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Pizza">Pizza</option>
                <option value="Burgers">Burgers</option>
                <option value="Biryani">Biryani</option>
                <option value="Chinese">Chinese</option>
                <option value="Snacks">Snacks</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Food Item
            </button>
          </div>

          {/* Table of Food Items */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Unique Barcode / QR Code</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFoods.map(item => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`inline-flex items-center justify-center w-3 h-3 rounded border ${
                              item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            </span>
                            <span className="font-bold text-stone-900 text-xs">{item.name}</span>
                          </div>
                          <p className="text-[11px] text-stone-400">{item.restaurantName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-stone-700">
                      {item.category}
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-900">
                      ₹{item.price}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-stone-100 px-2 py-1 rounded text-[11px] font-semibold text-stone-800 border border-stone-200">
                          {item.code}
                        </span>
                        <button
                          onClick={() => setSelectedFoodForQR(item)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Generate & print scannable QR code"
                        >
                          <QrCode className="w-3 h-3" />
                          View QR
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFoodAvailability(item.id)}
                        className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                          item.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {item.isAvailable ? '✓ In Stock' : '✕ Out of Stock'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                          title="Edit food item"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.name}" from menu?`)) {
                              deleteFoodItem(item.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 rounded text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete food item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Modal when clicking View QR */}
      <QRCodeModal
        foodItem={selectedFoodForQR}
        onClose={() => setSelectedFoodForQR(null)}
      />

      {/* Add / Edit Food Item Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-900 text-white">
              <h3 className="text-sm font-bold">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFoodItem} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Food Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Paneer Butter Masala"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unique Barcode / QR Code *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FOOD-PANEER-015"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min={formPrice}
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    placeholder="e.g. 20 min"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    value={formRestaurant}
                    onChange={(e) => setFormRestaurant(e.target.value)}
                    placeholder="e.g. Spice Kitchen"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Dietary Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="diet"
                      checked={formIsVeg}
                      onChange={() => setFormIsVeg(true)}
                    />
                    <span className="text-emerald-700 font-semibold">Pure Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="diet"
                      checked={!formIsVeg}
                      onChange={() => setFormIsVeg(false)}
                    />
                    <span className="text-rose-700 font-semibold">Non-Vegetarian</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
                <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto">
                  <span className="text-[10px] text-stone-400">Presets:</span>
                  {presetImages.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormImageUrl(p.url)}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-600"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md shadow-amber-500/20"
                >
                  {editingItem ? 'Save Changes' : 'Create Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

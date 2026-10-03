import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, Restaurant, CartItem, Order, OrderStatus, PaymentStatus, SelectedOption } from '../types';
import { INITIAL_FOOD_ITEMS, INITIAL_RESTAURANTS, INITIAL_ORDERS, PROMO_CODES } from '../data/mockData';

interface AppContextType {
  foodItems: FoodItem[];
  restaurants: Restaurant[];
  cart: CartItem[];
  orders: Order[];
  activeOrder: Order | null;
  activeTab: 'browse' | 'scanner' | 'cart' | 'checkout' | 'confirmation' | 'tracking' | 'admin' | 'orders';
  setActiveTab: (tab: 'browse' | 'scanner' | 'cart' | 'checkout' | 'confirmation' | 'tracking' | 'admin' | 'orders') => void;
  selectedFoodForModal: FoodItem | null;
  setSelectedFoodForModal: (food: FoodItem | null) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  
  // Cart Actions
  addToCart: (food: FoodItem, quantity?: number, selectedOptions?: SelectedOption[], notes?: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Food Management (Admin)
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleFoodAvailability: (id: string) => void;

  // Order Actions
  createOrder: (customerData: Order['customer'], discountCode?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  setActiveOrderById: (orderId: string) => void;

  // Lookup helpers
  getFoodByCode: (code: string) => FoodItem | undefined;
  getPromoDiscount: (code: string, subtotal: number) => { discount: number; valid: boolean; message: string };
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage or defaults
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem('qb_food_items_v2');
      return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
    } catch {
      return INITIAL_FOOD_ITEMS;
    }
  });

  const [restaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('qb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('qb_orders_v2');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return orders.length > 0 ? orders[0].id : null;
  });

  const [activeTab, setActiveTab] = useState<'browse' | 'scanner' | 'cart' | 'checkout' | 'confirmation' | 'tracking' | 'admin' | 'orders'>('browse');
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('qb_food_items_v2', JSON.stringify(foodItems));
    } catch (e) {
      console.error(e);
    }
  }, [foodItems]);

  useEffect(() => {
    try {
      localStorage.setItem('qb_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('qb_orders_v2', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart operations
  const addToCart = (food: FoodItem, quantity = 1, selectedOptions: SelectedOption[] = [], notes = '') => {
    if (!food.isAvailable) {
      showToast(`${food.name} is currently out of stock`);
      return;
    }

    const optionsCost = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
    const unitPrice = food.price + optionsCost;
    const lineTotal = unitPrice * quantity;

    // Check if duplicate item with same options exists
    const optionsKey = selectedOptions.map(o => `${o.groupTitle}:${o.name}`).sort().join('|');

    setCart(prev => {
      const existingIdx = prev.findIndex(item => {
        if (item.foodItem.id !== food.id) return false;
        const currentOptionsKey = item.selectedOptions.map(o => `${o.groupTitle}:${o.name}`).sort().join('|');
        return currentOptionsKey === optionsKey;
      });

      if (existingIdx > -1) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        const newQty = existing.quantity + quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          lineTotal: existing.unitPrice * newQty,
          specialInstructions: notes || existing.specialInstructions
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          foodItem: food,
          quantity,
          selectedOptions,
          unitPrice,
          lineTotal,
          specialInstructions: notes
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity}x ${food.name} to cart`);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === cartItemId
          ? { ...item, quantity, lineTotal: item.unitPrice * quantity }
          : item
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Admin Food Items
  const addFoodItem = (newItemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...newItemData,
      id: `food-${Date.now()}`
    };
    setFoodItems(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to menu`);
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Food item updated');
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
    showToast('Food item deleted');
  };

  const toggleFoodAvailability = (id: string) => {
    setFoodItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Orders
  const getPromoDiscount = (code: string, subtotal: number) => {
    if (!code) return { discount: 0, valid: false, message: '' };
    const promo = PROMO_CODES.find(p => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!promo) {
      return { discount: 0, valid: false, message: 'Invalid promo code' };
    }
    if (subtotal < promo.minOrder) {
      return {
        discount: 0,
        valid: false,
        message: `Min order ₹${promo.minOrder} required for ${promo.code}`
      };
    }
    const discountAmount = Math.round((subtotal * promo.discountPercent) / 100);
    return {
      discount: discountAmount,
      valid: true,
      message: `${promo.discountPercent}% OFF applied!`
    };
  };

  const createOrder = (customerData: Order['customer'], discountCode?: string) => {
    const subtotal = cartTotal;
    const deliveryFee = subtotal > 350 ? 0 : 35;
    const promoCheck = discountCode ? getPromoDiscount(discountCode, subtotal) : { discount: 0, valid: false };
    const discount = promoCheck.valid ? promoCheck.discount : 0;
    const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

    // Random order number between FD10200 and FD99999
    const orderNumber = `FD${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderNumber,
      createdAt: new Date().toISOString(),
      customer: customerData,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount,
      discountCode: promoCheck.valid ? discountCode?.toUpperCase() : undefined,
      grandTotal,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending Cash Collection',
      status: 'Order Placed',
      estimatedDeliveryTime: '30-40 min',
      deliveryPartner: {
        name: 'Arjun Das',
        phone: '+91 97412 88451',
        vehicle: 'Honda Activa (KA-05-EX-4491)'
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order #${orderId} status: ${status}`);
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, paymentStatus } : ord))
    );
    showToast(`Order #${orderId} marked as ${paymentStatus}`);
  };

  const setActiveOrderById = (orderId: string) => {
    setActiveOrderId(orderId);
  };

  const getFoodByCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    return foodItems.find(
      item => item.code.toUpperCase() === clean || item.id.toUpperCase() === clean
    );
  };

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0] || null;

  return (
    <AppContext.Provider
      value={{
        foodItems,
        restaurants,
        cart,
        orders,
        activeOrder,
        activeTab,
        setActiveTab,
        selectedFoodForModal,
        setSelectedFoodForModal,
        isScannerOpen,
        setIsScannerOpen,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        toggleFoodAvailability,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        setActiveOrderById,
        getFoodByCode,
        getPromoDiscount,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

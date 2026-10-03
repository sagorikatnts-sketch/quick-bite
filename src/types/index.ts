export type Category = 
  | 'All'
  | 'Pizza'
  | 'Burgers'
  | 'Biryani'
  | 'Chinese'
  | 'Snacks'
  | 'Desserts'
  | 'Beverages';

export interface CustomizationOption {
  name: string;
  price: number;
}

export interface CustomizationGroup {
  title: string;
  type: 'radio' | 'checkbox';
  required?: boolean;
  options: CustomizationOption[];
}

export interface FoodItem {
  id: string;
  code: string; // e.g. "FOOD-BIRYANI-001"
  name: string;
  restaurantId: string;
  restaurantName: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  preparationTime: string;
  tags?: string[];
  customizations?: CustomizationGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  distance: string;
  imageUrl: string;
  featured?: boolean;
  offerBadge?: string;
}

export interface SelectedOption {
  groupTitle: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart line item id
  foodItem: FoodItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  unitPrice: number;
  lineTotal: number;
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Food Being Prepared'
  | 'Out for Delivery'
  | 'Delivered';

export type PaymentStatus = 
  | 'Pending Cash Collection'
  | 'Cash Received';

export interface Order {
  id: string; // e.g. "FD10245"
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    instructions?: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  discountCode?: string;
  grandTotal: number;
  paymentMethod: 'Cash on Delivery';
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  estimatedDeliveryTime: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicle: string;
  };
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minOrder: number;
  description: string;
}

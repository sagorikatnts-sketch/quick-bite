import { FoodItem, Restaurant, PromoCode } from '../types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Spice Kitchen',
    cuisine: ['Biryani', 'Mughlai', 'North Indian'],
    rating: 4.8,
    reviewsCount: 1240,
    deliveryTime: '25-35 min',
    distance: '2.4 km',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    featured: true,
    offerBadge: 'Flat 20% OFF'
  },
  {
    id: 'rest-2',
    name: 'Pizza Corner',
    cuisine: ['Italian', 'Wood-fired Pizza', 'Pastas'],
    rating: 4.6,
    reviewsCount: 890,
    deliveryTime: '30-40 min',
    distance: '3.1 km',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    featured: true,
    offerBadge: 'Free Delivery'
  },
  {
    id: 'rest-3',
    name: 'Burger House',
    cuisine: ['American', 'Gourmet Burgers', 'Shakes'],
    rating: 4.7,
    reviewsCount: 1560,
    deliveryTime: '20-30 min',
    distance: '1.8 km',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    featured: true,
    offerBadge: 'Buy 1 Get 1 on Sides'
  },
  {
    id: 'rest-4',
    name: 'Golden Dragon Wok',
    cuisine: ['Chinese', 'Pan-Asian', 'Dim Sum'],
    rating: 4.5,
    reviewsCount: 670,
    deliveryTime: '35-45 min',
    distance: '4.2 km',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
    featured: false,
    offerBadge: '₹50 OFF above ₹299'
  },
  {
    id: 'rest-5',
    name: 'Chaat & Bites',
    cuisine: ['Street Food', 'Snacks', 'Beverages'],
    rating: 4.4,
    reviewsCount: 940,
    deliveryTime: '15-25 min',
    distance: '1.2 km',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    featured: false,
    offerBadge: 'Express 20-min Delivery'
  },
  {
    id: 'rest-6',
    name: 'The Sweet Spot',
    cuisine: ['Desserts', 'Bakery', 'Ice Cream'],
    rating: 4.9,
    reviewsCount: 1120,
    deliveryTime: '20-30 min',
    distance: '2.0 km',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    featured: true,
    offerBadge: 'Free Sweet on ₹399'
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  // Required sample items from user prompt:
  {
    id: 'food-1',
    code: 'FOOD-BIRYANI-001',
    name: 'Chicken Biryani',
    restaurantId: 'rest-1',
    restaurantName: 'Spice Kitchen',
    category: 'Biryani',
    price: 220,
    originalPrice: 260,
    description: 'Aromatic basmati rice cooked with tender chicken pieces, saffron, whole spices, served with fresh raita and spicy salan.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 420,
    preparationTime: '25 min',
    tags: ['Bestseller', 'Chef Special'],
    customizations: [
      {
        title: 'Portion Size',
        type: 'radio',
        required: true,
        options: [
          { name: 'Regular (1 Person)', price: 0 },
          { name: 'Large (2 Persons)', price: 140 },
          { name: 'Handi Feast (3-4 Persons)', price: 320 }
        ]
      },
      {
        title: 'Add-ons & Extras',
        type: 'checkbox',
        options: [
          { name: 'Extra Boiled Egg', price: 20 },
          { name: 'Double Chicken Pieces', price: 80 },
          { name: 'Extra Mint Raita', price: 25 },
          { name: 'Gulab Jamun (2 pcs)', price: 40 }
        ]
      }
    ]
  },
  {
    id: 'food-2',
    code: 'FOOD-PIZZA-002',
    name: 'Veg Pizza',
    restaurantId: 'rest-2',
    restaurantName: 'Pizza Corner',
    category: 'Pizza',
    price: 299,
    originalPrice: 349,
    description: 'Crisp hand-tossed artisan crust topped with vine tomato sauce, mozzarella, bell peppers, sweet corn, black olives, and herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 310,
    preparationTime: '20 min',
    tags: ['Vegetarian', 'Popular'],
    customizations: [
      {
        title: 'Crust Selection',
        type: 'radio',
        required: true,
        options: [
          { name: 'Classic Hand-Tossed', price: 0 },
          { name: 'Cheese Burst Crust', price: 79 },
          { name: 'Thin & Crispy Wheat Base', price: 40 }
        ]
      },
      {
        title: 'Extra Toppings',
        type: 'checkbox',
        options: [
          { name: 'Extra Mozzarella Cheese', price: 50 },
          { name: 'Grilled Paneer Cubes', price: 45 },
          { name: 'Jalapeño Peppers', price: 30 }
        ]
      }
    ]
  },
  {
    id: 'food-3',
    code: 'FOOD-BURGER-003',
    name: 'Chicken Burger',
    restaurantId: 'rest-3',
    restaurantName: 'Burger House',
    category: 'Burgers',
    price: 180,
    originalPrice: 210,
    description: 'Crispy fried chicken fillet stacked with cheddar cheese, crunchy iceberg lettuce, pickled gherkins, and house smoked secret sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 512,
    preparationTime: '15 min',
    tags: ['Must Try', 'Bestseller'],
    customizations: [
      {
        title: 'Spice Level',
        type: 'radio',
        required: true,
        options: [
          { name: 'Mild & Creamy', price: 0 },
          { name: 'Spicy Peri-Peri', price: 15 },
          { name: 'Ghost Pepper Inferno', price: 25 }
        ]
      },
      {
        title: 'Combo Additions',
        type: 'checkbox',
        options: [
          { name: 'Add French Fries', price: 60 },
          { name: 'Extra Melted Cheddar Slice', price: 30 },
          { name: 'Add Chilled Cola (330ml)', price: 45 }
        ]
      }
    ]
  },
  // Additional varied items
  {
    id: 'food-4',
    code: 'FOOD-PIZZA-004',
    name: 'Pepperoni & Smoked Chicken Pizza',
    restaurantId: 'rest-2',
    restaurantName: 'Pizza Corner',
    category: 'Pizza',
    price: 360,
    originalPrice: 420,
    description: 'Signature sourdough pizza loaded with spicy pepperoni slices, herb grilled chicken, smoked mozzarella, and crushed chili flakes.',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 280,
    preparationTime: '25 min',
    tags: ['Top Rated'],
    customizations: [
      {
        title: 'Crust',
        type: 'radio',
        required: true,
        options: [
          { name: 'Pan Thick Crust', price: 0 },
          { name: 'Cheese Burst', price: 79 }
        ]
      }
    ]
  },
  {
    id: 'food-5',
    code: 'FOOD-BURGER-005',
    name: 'Crispy Veggie Deluxe Burger',
    restaurantId: 'rest-3',
    restaurantName: 'Burger House',
    category: 'Burgers',
    price: 140,
    originalPrice: 170,
    description: 'Crispy vegetable patty infused with herbs and potato, layered with mint mayo, tomato slices, crunchy lettuce, and cheddar in a brioche bun.',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.6,
    reviewCount: 195,
    preparationTime: '15 min',
    tags: ['Vegetarian'],
    customizations: [
      {
        title: 'Cheese',
        type: 'checkbox',
        options: [
          { name: 'Extra Cheese Slice', price: 25 },
          { name: 'Add Peri-Peri Dip', price: 30 }
        ]
      }
    ]
  },
  {
    id: 'food-6',
    code: 'FOOD-CHINESE-006',
    name: 'Hakka Noodles with Manchurian',
    restaurantId: 'rest-4',
    restaurantName: 'Golden Dragon Wok',
    category: 'Chinese',
    price: 210,
    originalPrice: 250,
    description: 'Wok-tossed thin noodles with crispy seasonal veggies and garlic soy sauce, served with 4 vegetable Manchurian balls in rich gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 340,
    preparationTime: '20 min',
    tags: ['Chef Special', 'Combo'],
    customizations: [
      {
        title: 'Gravy Preference',
        type: 'radio',
        required: true,
        options: [
          { name: 'Veg Manchurian Gravy', price: 0 },
          { name: 'Chilli Paneer Gravy', price: 40 }
        ]
      }
    ]
  },
  {
    id: 'food-7',
    code: 'FOOD-CHINESE-007',
    name: 'Kung Pao Chicken Bowls',
    restaurantId: 'rest-4',
    restaurantName: 'Golden Dragon Wok',
    category: 'Chinese',
    price: 260,
    originalPrice: 299,
    description: 'Sichuan wok-fried tender chicken tossed with dry red chilies, roasted peanuts, scallions, and steamed jasmine rice.',
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 210,
    preparationTime: '22 min',
    tags: ['Spicy']
  },
  {
    id: 'food-8',
    code: 'FOOD-SNACK-008',
    name: 'Crispy Samosa Chaat Platter',
    restaurantId: 'rest-5',
    restaurantName: 'Chaat & Bites',
    category: 'Snacks',
    price: 99,
    originalPrice: 120,
    description: 'Crushed flaky potato samosas topped with warm chickpea curry, sweetened yogurt, tangy tamarind chutney, mint sauce, and crispy sev.',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 640,
    preparationTime: '10 min',
    tags: ['Street Classic', 'Bestseller']
  },
  {
    id: 'food-9',
    code: 'FOOD-SNACK-009',
    name: 'Cheesy Loaded Nachos',
    restaurantId: 'rest-5',
    restaurantName: 'Chaat & Bites',
    category: 'Snacks',
    price: 150,
    originalPrice: 180,
    description: 'Crisp tortilla corn chips smothered in warm cheddar cheese sauce, refried beans, pico de gallo salsa, sour cream, and sliced jalapeños.',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.6,
    reviewCount: 180,
    preparationTime: '12 min'
  },
  {
    id: 'food-10',
    code: 'FOOD-DESSERT-010',
    name: 'Molten Chocolate Lava Cake',
    restaurantId: 'rest-6',
    restaurantName: 'The Sweet Spot',
    category: 'Desserts',
    price: 135,
    originalPrice: 160,
    description: 'Rich Belgian dark chocolate cake with a luscious warm gooey chocolate center, dusted with powdered sugar.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 780,
    preparationTime: '15 min',
    tags: ['Must Try', 'Bestseller'],
    customizations: [
      {
        title: 'Add Ice Cream Scoop',
        type: 'checkbox',
        options: [
          { name: 'Vanilla Bean Ice Cream Scoop', price: 40 },
          { name: 'Extra Warm Chocolate Fudge Dip', price: 30 }
        ]
      }
    ]
  },
  {
    id: 'food-11',
    code: 'FOOD-DESSERT-011',
    name: 'Gulab Jamun with Rabdi',
    restaurantId: 'rest-6',
    restaurantName: 'The Sweet Spot',
    category: 'Desserts',
    price: 110,
    originalPrice: 130,
    description: 'Two warm, melt-in-the-mouth fried milk dumplings steeped in cardamom saffron syrup, served on a bed of thick chilled rabdi.',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 390,
    preparationTime: '10 min',
    tags: ['Traditional']
  },
  {
    id: 'food-12',
    code: 'FOOD-DRINK-012',
    name: 'Fresh Mango Mint Lassi',
    restaurantId: 'rest-1',
    restaurantName: 'Spice Kitchen',
    category: 'Beverages',
    price: 85,
    originalPrice: 100,
    description: 'Thick, creamy churned sweet yogurt blended with real Alphonso mango pulp and garnished with crushed pistachios.',
    imageUrl: 'https://images.unsplash.com/photo-1570701564993-e00652af8aa7?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 410,
    preparationTime: '8 min',
    tags: ['Refreshing']
  },
  {
    id: 'food-13',
    code: 'FOOD-DRINK-013',
    name: 'Iced Caramel Cold Brew',
    restaurantId: 'rest-3',
    restaurantName: 'Burger House',
    category: 'Beverages',
    price: 120,
    originalPrice: 140,
    description: '18-hour steeped Arabica cold brew coffee layered with salted caramel drizzle and chilled frothed milk over ice.',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 230,
    preparationTime: '5 min'
  }
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'QUICK20',
    discountPercent: 20,
    minOrder: 200,
    description: '20% discount on all orders above ₹200'
  },
  {
    code: 'FREEDEL',
    discountPercent: 10,
    minOrder: 150,
    description: 'Free delivery & 10% discount on orders above ₹150'
  },
  {
    code: 'WELCOME50',
    discountPercent: 15,
    minOrder: 100,
    description: '15% instant off on your welcome order'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'FD10245',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    customer: {
      name: 'Rohan Sharma',
      phone: '9876543210',
      address: 'Flat 402, Sunshine Apartments, 5th Cross Road, Indiranagar',
      landmark: 'Near Metro Station Pillar 84',
      instructions: 'Please call before ringing the doorbell.'
    },
    items: [
      {
        id: 'cart-init-1',
        foodItem: INITIAL_FOOD_ITEMS[0], // Chicken Biryani
        quantity: 2,
        selectedOptions: [{ groupTitle: 'Portion Size', name: 'Regular (1 Person)', price: 0 }],
        unitPrice: 220,
        lineTotal: 440
      }
    ],
    subtotal: 440,
    deliveryFee: 40,
    discount: 30,
    discountCode: 'WELCOME50',
    grandTotal: 450,
    paymentMethod: 'Cash on Delivery' as const,
    paymentStatus: 'Pending Cash Collection' as const,
    status: 'Out for Delivery' as const,
    estimatedDeliveryTime: '15 mins',
    deliveryPartner: {
      name: 'Vikram Singh',
      phone: '+91 98451 22910',
      vehicle: 'Hero Splendor (KA-03-HA-8821)'
    }
  }
];

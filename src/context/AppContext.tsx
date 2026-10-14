import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Product, 
  Merchant, 
  CartItem, 
  Order, 
  RestockRequest, 
  ManualPaymentRecord, 
  TeamMember, 
  AppRoute 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_MERCHANTS, 
  INITIAL_PAYMENT_RECORDS, 
  INITIAL_TEAM, 
  AREAS_BY_GOV 
} from '../data/initialData';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  governorate: string;
  area: string;
  setLocation: (gov: string, area: string) => void;
  selectedMerchantId: string;
  setSelectedMerchantId: (id: string) => void;
  selectedMerchant: Merchant;
  merchants: Merchant[];
  addMerchant: (merchant: Partial<Merchant>) => void;
  products: Product[];
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
  currentOrder: Order | null;
  allOrders: Order[];
  placeOrder: (details: { 
    customerName: string; 
    phone: string; 
    address: string; 
    paymentMethod: 'cod' | 'transfer'; 
    proofFileName?: string; 
  }) => Order | null;
  advanceOrderStatus: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  updateVendorOrderStatus: (orderId: string, statusText: string) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeBrand: string;
  setActiveBrand: (brand: string) => void;
  dealsOnly: boolean;
  setDealsOnly: (dealsOnly: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  getProductStockAtMerchant: (productId: string, merchantId?: string) => number;
  getMainStock: (productId: string) => number;
  updateMerchantStock: (merchantId: string, productId: string, stock: number) => void;
  updateMainStock: (productId: string, stock: number) => void;
  getMerchantMinimum: (merchantId?: string) => number;
  updateMerchantMinimum: (merchantId: string, minAmount: number) => void;
  restockRequests: RestockRequest[];
  createRestockRequest: (productId: string, quantity: number) => void;
  updateRestockStatus: (requestId: string, status: RestockRequest['status']) => void;
  paymentRecords: ManualPaymentRecord[];
  updatePaymentStatus: (id: string, status: 'معتمد' | 'مرفوض') => void;
  teamMembers: TeamMember[];
  addTeamMember: (name: string, role: string) => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Location
  const [route, setRouteState] = useState<AppRoute>('home');
  const [governorate, setGovernorate] = useState<string>('القاهرة');
  const [area, setArea] = useState<string>('مدينة نصر');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('m1');
  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);

  // Products & Filtering
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [activeBrand, setActiveBrand] = useState<string>('الكل');
  const [dealsOnly, setDealsOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Overrides & Stocks (isolated per merchant vs main warehouse)
  const [merchantStockOverrides, setMerchantStockOverrides] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('topone_merchant_stocks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [mainStockOverrides, setMainStockOverrides] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('topone_main_stocks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [merchantMinimumOverrides, setMerchantMinimumOverrides] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('topone_merchant_mins');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('topone_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('topone_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed initial mock order for immediate demonstration
    return [
      {
        id: '104829',
        customerName: 'منة محمد',
        phone: '0101 234 5678',
        address: '15 شارع الطيران، الدور الرابع، شقة 8، مدينة نصر',
        governorate: 'القاهرة',
        area: 'مدينة نصر',
        merchantId: 'm1',
        merchantName: 'مركز الجمال',
        items: [
          { product: INITIAL_PRODUCTS[0], quantity: 1, unitPrice: 285 },
          { product: INITIAL_PRODUCTS[1], quantity: 1, unitPrice: 165 },
          { product: INITIAL_PRODUCTS[2], quantity: 1, unitPrice: 220 }
        ],
        subtotal: 670,
        deliveryFee: 25,
        total: 695,
        paymentMethod: 'cod',
        statusIndex: 3,
        createdAt: 'اليوم، 14:30',
        isCancelled: false
      }
    ];
  });

  const [currentOrderId, setCurrentOrderId] = useState<string | null>(() => {
    return '104829';
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Restock & B2B requests
  const [restockRequests, setRestockRequests] = useState<RestockRequest[]>([
    {
      id: 'PO-882104',
      merchantId: 'm1',
      merchantName: 'مركز الجمال',
      productId: 'p1',
      productName: 'سيروم لومينيا لتوحيد وإشراقة البشرة مع فيتامين سي',
      quantity: 20,
      date: 'اليوم، 11:20',
      status: 'بانتظار مراجعة الشركة'
    }
  ]);

  // Payment review entries
  const [paymentRecords, setPaymentRecords] = useState<ManualPaymentRecord[]>(INITIAL_PAYMENT_RECORDS);

  // Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);

  // Modals & Toasts
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Persistence side effects
  useEffect(() => {
    try {
      localStorage.setItem('topone_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('topone_orders', JSON.stringify(allOrders));
    } catch {}
  }, [allOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('topone_merchant_stocks', JSON.stringify(merchantStockOverrides));
    } catch {}
  }, [merchantStockOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem('topone_main_stocks', JSON.stringify(mainStockOverrides));
    } catch {}
  }, [mainStockOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem('topone_merchant_mins', JSON.stringify(merchantMinimumOverrides));
    } catch {}
  }, [merchantMinimumOverrides]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const setRoute = (newRoute: AppRoute) => {
    setRouteState(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedMerchant = useMemo(() => {
    return merchants.find(m => m.id === selectedMerchantId) || merchants[0];
  }, [merchants, selectedMerchantId]);

  const setLocation = (gov: string, newArea: string) => {
    setGovernorate(gov);
    setArea(newArea);

    // Auto-select best rated merchant in that governorate if available
    const availableInGov = merchants.filter(m => m.governorate === gov);
    if (availableInGov.length > 0) {
      const match = availableInGov.find(m => m.id === selectedMerchantId);
      if (!match) {
        setSelectedMerchantId(availableInGov[0].id);
      }
    }
  };

  const getProductStockAtMerchant = (productId: string, merchantId: string = selectedMerchantId): number => {
    const key = `${merchantId}:${productId}`;
    if (Object.prototype.hasOwnProperty.call(merchantStockOverrides, key)) {
      return Number(merchantStockOverrides[key]);
    }
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    let base = product.stock;
    // Specific branch stock realism
    if (merchantId === 'm2') {
      base = Math.max(0, base - (['p6', 'p9'].includes(productId) ? base : 2));
    } else if (merchantId === 'm3') {
      base = Math.max(0, base - (['p3'].includes(productId) ? 4 : 1));
    } else if (['m4', 'm5', 'm6', 'm7'].includes(merchantId)) {
      base = Math.max(0, base - (['p1', 'p2', 'p6', 'p9'].includes(productId) ? Math.min(base, 6) : 3));
    }
    return base;
  };

  const getMainStock = (productId: string): number => {
    if (Object.prototype.hasOwnProperty.call(mainStockOverrides, productId)) {
      return Number(mainStockOverrides[productId]);
    }
    const product = products.find(p => p.id === productId);
    return product ? product.stock + 65 : 100;
  };

  const updateMerchantStock = (merchantId: string, productId: string, stock: number) => {
    setMerchantStockOverrides(prev => ({
      ...prev,
      [`${merchantId}:${productId}`]: Math.max(0, stock)
    }));
  };

  const updateMainStock = (productId: string, stock: number) => {
    setMainStockOverrides(prev => ({
      ...prev,
      [productId]: Math.max(0, stock)
    }));
  };

  const getMerchantMinimum = (merchantId: string = selectedMerchantId): number => {
    if (Object.prototype.hasOwnProperty.call(merchantMinimumOverrides, merchantId)) {
      return Number(merchantMinimumOverrides[merchantId]);
    }
    const m = merchants.find(item => item.id === merchantId);
    return m ? m.minimumOrder : 400;
  };

  const updateMerchantMinimum = (merchantId: string, minAmount: number) => {
    setMerchantMinimumOverrides(prev => ({
      ...prev,
      [merchantId]: Math.max(0, minAmount)
    }));
  };

  const addToCart = (productId: string, quantity = 1): boolean => {
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    const availableStock = getProductStockAtMerchant(productId, selectedMerchantId);
    const existing = cart.find(item => item.product.id === productId);
    const currentQty = existing ? existing.quantity : 0;

    if (availableStock <= 0) {
      showToast(`عفواً، ${product.name} غير متوفر حالياً لدى ${selectedMerchant.shortName}.`, 'error');
      return false;
    }

    if (currentQty + quantity > availableStock) {
      showToast(`الكمية المتاحة لدى التاجر هي ${availableStock} فقط.`, 'error');
      return false;
    }

    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === productId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        return copy;
      }
      return [...prev, { product, quantity }];
    });

    showToast(`تمت إضافة ${product.name} إلى السلة.`);
    return true;
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const availableStock = getProductStockAtMerchant(productId, selectedMerchantId);
    if (quantity > availableStock) {
      showToast(`أقصى كمية متوفرة لدى ${selectedMerchant.shortName} هي ${availableStock}.`, 'error');
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('تم حذف المنتج من السلة.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    showToast('تم تفريغ سلة التسوق.', 'info');
  };

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const shippingFee = useMemo(() => {
    return cartCount > 0 ? selectedMerchant.fee : 0;
  }, [cartCount, selectedMerchant]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + shippingFee;
  }, [cartSubtotal, shippingFee]);

  const placeOrder = ({ 
    customerName, 
    phone, 
    address, 
    paymentMethod, 
    proofFileName 
  }: { 
    customerName: string; 
    phone: string; 
    address: string; 
    paymentMethod: 'cod' | 'transfer'; 
    proofFileName?: string; 
  }): Order | null => {
    if (cart.length === 0) {
      showToast('سلة المشتريات فارغة.', 'error');
      return null;
    }

    const min = getMerchantMinimum(selectedMerchantId);
    if (cartSubtotal < min) {
      showToast(`قيمة الطلب أقل من الحد الأدنى للتاجر (${min} ج.م).`, 'error');
      return null;
    }

    // Verify stock availability
    for (const item of cart) {
      const stock = getProductStockAtMerchant(item.product.id, selectedMerchantId);
      if (item.quantity > stock) {
        showToast(`عفواً، الكمية المطلوبة من ${item.product.name} غير متوفرة بالكامل الآن.`, 'error');
        return null;
      }
    }

    const newOrderId = String(Math.floor(100000 + Math.random() * 900000));
    const now = new Date();
    const timeFormatted = `اليوم، ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: newOrderId,
      customerName,
      phone,
      address,
      governorate,
      area,
      merchantId: selectedMerchantId,
      merchantName: selectedMerchant.name,
      items: cart.map(i => ({
        product: i.product,
        quantity: i.quantity,
        unitPrice: i.product.price
      })),
      subtotal: cartSubtotal,
      deliveryFee: shippingFee,
      total: cartTotal,
      paymentMethod,
      proofFileName,
      statusIndex: paymentMethod === 'transfer' ? 1 : 2, // 1 = بانتظار المراجعة, 2 = مدفوع/تم تأكيد الطلب
      createdAt: timeFormatted,
      isCancelled: false
    };

    // Deduct stock for merchant
    cart.forEach(item => {
      const currentStock = getProductStockAtMerchant(item.product.id, selectedMerchantId);
      updateMerchantStock(selectedMerchantId, item.product.id, currentStock - item.quantity);
    });

    // If manual payment, add to payment records
    if (paymentMethod === 'transfer') {
      const paymentRecord: ManualPaymentRecord = {
        id: `TR-${newOrderId.substring(0, 4)}`,
        customerName,
        merchantName: selectedMerchant.shortName,
        amount: cartTotal,
        method: 'InstaPay / تحويل يدوي',
        status: 'قيد المراجعة',
        date: timeFormatted,
        receiptName: proofFileName || 'receipt_attached.jpg'
      };
      setPaymentRecords(prev => [paymentRecord, ...prev]);
    }

    setAllOrders(prev => [newOrder, ...prev]);
    setCurrentOrderId(newOrderId);
    setCart([]);
    showToast(`تم تأكيد طلبك بنجاح! رقم الطلب #${newOrderId}`);
    setRoute('order');
    return newOrder;
  };

  const currentOrder = useMemo(() => {
    if (!currentOrderId) return allOrders[0] || null;
    return allOrders.find(o => o.id === currentOrderId) || allOrders[0] || null;
  }, [allOrders, currentOrderId]);

  const advanceOrderStatus = (orderId: string) => {
    setAllOrders(prev => prev.map(o => {
      if (o.id === orderId && o.statusIndex < 5 && !o.isCancelled) {
        return { ...o, statusIndex: o.statusIndex + 1 };
      }
      return o;
    }));
    showToast('تم تحديث حالة الطلب في نظام التتبع المباشر.');
  };

  const cancelOrder = (orderId: string) => {
    setAllOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, isCancelled: true };
      }
      return o;
    }));
    showToast('تم إلغاء الطلب.', 'info');
  };

  const updateVendorOrderStatus = (orderId: string, statusText: string) => {
    showToast(`تم تحديث حالة الطلب #${orderId} إلى: ${statusText}`);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة إلى المفضلة');
      return updated;
    });
  };

  const createRestockRequest = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newReq: RestockRequest = {
      id: `PO-${String(Date.now()).slice(-6)}`,
      merchantId: selectedMerchantId,
      merchantName: selectedMerchant.shortName,
      productId,
      productName: product.name,
      quantity,
      date: 'اليوم',
      status: 'بانتظار مراجعة الشركة'
    };
    setRestockRequests(prev => [newReq, ...prev]);
    showToast(`تم إرسال طلب توريد ${quantity} قطعة من المستودع الرئيسي.`);
  };

  const updateRestockStatus = (requestId: string, status: RestockRequest['status']) => {
    setRestockRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    showToast(`تم تحديث طلب التوريد #${requestId} إلى: ${status}`);
  };

  const updatePaymentStatus = (id: string, status: 'معتمد' | 'مرفوض') => {
    setPaymentRecords(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    showToast(status === 'معتمد' ? `تم اعتماد التحويل #${id} وتحديث رصيد التاجر.` : `تم رفض التحويل #${id}.`, status === 'معتمد' ? 'success' : 'error');
  };

  const addTeamMember = (name: string, role: string) => {
    const initials = name.trim().split(' ').slice(0, 2).map(w => w[0]).join('');
    const newMember: TeamMember = {
      id: `t-${Date.now()}`,
      name,
      role,
      initials: initials || 'ع'
    };
    setTeamMembers(prev => [...prev, newMember]);
    showToast(`تمت إضافة ${name} إلى فريق العمل.`);
  };

  const addMerchant = (newM: Partial<Merchant>) => {
    const id = `m${merchants.length + 1}`;
    const merchant: Merchant = {
      id,
      name: newM.name || 'فرع جديد معتمد',
      shortName: newM.shortName || (newM.name ? newM.name.slice(0, 15) : 'فرع جديد'),
      area: newM.area || area,
      governorate: newM.governorate || governorate,
      distance: 'محلي',
      eta: '30–45 دقيقة',
      fee: newM.fee || 30,
      rating: 5.0,
      reviewsCount: 1,
      minimumOrder: newM.minimumOrder || 400,
      stockNote: 'تم تسجيل الفرع حديثاً',
      phone: newM.phone || '0100 000 0000',
      address: newM.address || '',
      isVerified: true
    };
    setMerchants(prev => [...prev, merchant]);
    showToast(`تمت إضافة التاجر ${merchant.name} إلى شبكة TOP ONE.`);
  };

  return (
    <AppContext.Provider
      value={{
        route,
        setRoute,
        governorate,
        area,
        setLocation,
        selectedMerchantId,
        setSelectedMerchantId,
        selectedMerchant,
        merchants,
        addMerchant,
        products,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        currentOrder,
        allOrders,
        placeOrder,
        advanceOrderStatus,
        cancelOrder,
        updateVendorOrderStatus,
        favorites,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        activeBrand,
        setActiveBrand,
        dealsOnly,
        setDealsOnly,
        sortBy,
        setSortBy,
        getProductStockAtMerchant,
        getMainStock,
        updateMerchantStock,
        updateMainStock,
        getMerchantMinimum,
        updateMerchantMinimum,
        restockRequests,
        createRestockRequest,
        updateRestockStatus,
        paymentRecords,
        updatePaymentStatus,
        teamMembers,
        addTeamMember,
        toasts,
        showToast,
        activeProductModal,
        setActiveProductModal,
        isLocationModalOpen,
        setIsLocationModalOpen
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

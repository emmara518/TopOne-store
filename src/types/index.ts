export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'العناية بالبشرة' | 'المكياج' | 'العناية بالشعر' | 'العطور' | 'العناية بالجسم';
  price: number;
  oldPrice?: number | null;
  image: string;
  badge?: string;
  isDeal?: boolean;
  stock: number;
  sku: string;
  description?: string;
  volume?: string;
}

export interface Merchant {
  id: string;
  name: string;
  shortName: string;
  area: string;
  governorate: string;
  distance: string;
  eta: string;
  fee: number;
  rating: number;
  reviewsCount: number;
  minimumOrder: number;
  stockNote: string;
  phone?: string;
  address?: string;
  isVerified?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export type OrderStatusStep = 
  | 'بانتظار الدفع'
  | 'بانتظار المراجعة'
  | 'تم تأكيد الدفع'
  | 'جاهز للشحن والتجهيز'
  | 'خرج مع مندوب التوصيل'
  | 'تم التسليم بنجاح';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  governorate: string;
  area: string;
  merchantId: string;
  merchantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'transfer';
  proofFileName?: string;
  statusIndex: number;
  createdAt: string;
  isCancelled?: boolean;
}

export interface RestockRequest {
  id: string;
  merchantId: string;
  merchantName: string;
  productId: string;
  productName: string;
  quantity: number;
  date: string;
  status: 'بانتظار مراجعة الشركة' | 'معتمد ومجدول' | 'مرفوض';
}

export interface ManualPaymentRecord {
  id: string;
  customerName: string;
  merchantName: string;
  amount: number;
  method: string;
  status: 'قيد المراجعة' | 'معتمد' | 'مرفوض';
  date: string;
  receiptName?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export type AppRoute = 
  | 'home'
  | 'merchants'
  | 'catalog'
  | 'cart'
  | 'order'
  | 'merchant-portal'
  | 'company-portal';

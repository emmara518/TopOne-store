import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Store, 
  MapPin, 
  Phone, 
  CreditCard, 
  Calendar, 
  ArrowLeft, 
  XCircle,
  Play
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { 
    currentOrder, 
    allOrders, 
    advanceOrderStatus, 
    cancelOrder, 
    setRoute 
  } = useApp();

  const steps = [
    { title: 'بانتظار الدفع', desc: 'تم استلام بيانات الطلب وتحديد المبلغ الإجمالي.' },
    { title: 'بانتظار مراجعة التحويل', desc: 'مراجعة صورة الإيصال أو تحويل إنستاباي/المحفظة.' },
    { title: 'تم تأكيد الدفع والطلب', desc: 'تم اعتماد المعاملة وبدء إجراءات التنفيذ لدى الفرع.' },
    { title: 'تجهيز وتغليف الطلب', desc: 'يقوم التاجر بفحص المنتجات وتغليفها بعناية.' },
    { title: 'خرج مع مندوب التوصيل', desc: 'الطلب في طريقه إليك الآن مع مندوب الشحن المحلي.' },
    { title: 'تم التسليم بنجاح', desc: 'تم تسليم الشحنة للعميل بنجاح.' }
  ];

  if (!currentOrder) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="bg-white border border-[#E9E1DD] rounded-3xl p-12 max-w-md mx-auto space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#9A8E90] mx-auto" />
          <h2 className="text-lg font-bold text-[#272124]">لا يوجد طلب نشط حالياً</h2>
          <p className="text-xs text-[#766A6C]">
            يمكنك تصفح المنتجات وإجراء طلب لتتبع حالته خطوة بخطوة في الوقت الفعلي.
          </p>
          <button
            onClick={() => setRoute('catalog')}
            className="px-6 py-3 bg-[#6B3C45] text-white rounded-xl text-xs font-bold"
          >
            تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  const currentStep = currentOrder.statusIndex;
  const isCancelled = currentOrder.isCancelled;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#766A6C]">
        <button onClick={() => setRoute('home')} className="hover:text-[#6B3C45]">الرئيسية</button>
        <span>‹</span>
        <span className="text-[#6B3C45] font-bold">تتبّع الطلب</span>
      </div>

      {/* Main Order Card */}
      <div className="bg-white border border-[#E9E1DD] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Head */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1DD]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-latin text-xs font-bold text-[#6B3C45] bg-[#F0E2DF] px-2.5 py-1 rounded-lg">
                طلب #{currentOrder.id}
              </span>
              <span className="text-xs text-[#766A6C]">{currentOrder.createdAt}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#272124] mt-2">
              {isCancelled ? 'تم إلغاء هذا الطلب' : 'طلبك قيد المتابعة والتنفيذ'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
              isCancelled 
                ? 'bg-[#FBE9EB] text-[#B84E58]' 
                : currentStep === 5 
                ? 'bg-[#E9F2ED] text-[#42695A]' 
                : 'bg-[#F0E2DF] text-[#6B3C45]'
            }`}>
              {isCancelled ? 'ملغي' : steps[currentStep]?.title || 'قيد المتابعة'}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="py-2">
          <div className="space-y-6 relative">
            {steps.map((step, index) => {
              const isPast = index < currentStep;
              const isCurrent = index === currentStep && !isCancelled;
              const isFuture = index > currentStep;

              return (
                <div key={index} className="flex items-start gap-4 relative">
                  {/* Vertical connector line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`absolute top-7 right-3.5 w-0.5 h-10 -bottom-2 ${
                        isPast ? 'bg-[#597B6D]' : 'bg-[#E9E1DD]'
                      }`}
                    />
                  )}

                  {/* Dot */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                    isPast 
                      ? 'bg-[#E9F2ED] text-[#597B6D]' 
                      : isCurrent 
                      ? 'bg-[#6B3C45] text-white shadow-xs ring-4 ring-[#F0E2DF]' 
                      : 'bg-[#F8F2EE] text-[#9A8E90]'
                  }`}>
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <strong className={`block text-xs sm:text-sm font-bold ${
                      isCurrent ? 'text-[#6B3C45]' : isPast ? 'text-[#272124]' : 'text-[#9A8E90]'
                    }`}>
                      {step.title}
                    </strong>
                    <p className="text-[11px] text-[#766A6C] mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* State badge */}
                  <div className="text-[11px] font-latin font-semibold text-[#766A6C] shrink-0">
                    {isPast ? 'مكتمل' : isCurrent ? 'الآن' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="bg-[#FAF5F1] rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-[#766A6C] flex items-center gap-1 mb-1">
              <Store className="w-3 h-3 text-[#6B3C45]" />
              التاجر المعتمد
            </span>
            <strong className="text-[#272124] block">{currentOrder.merchantName}</strong>
          </div>

          <div>
            <span className="text-[11px] text-[#766A6C] flex items-center gap-1 mb-1">
              <CreditCard className="w-3 h-3 text-[#6B3C45]" />
              طريقة الدفع
            </span>
            <strong className="text-[#272124] block">
              {currentOrder.paymentMethod === 'cod' ? 'عند الاستلام (COD)' : 'تحويل يدوي'}
            </strong>
          </div>

          <div>
            <span className="text-[11px] text-[#766A6C] flex items-center gap-1 mb-1">
              <Phone className="w-3 h-3 text-[#6B3C45]" />
              رقم العميل
            </span>
            <strong className="font-latin text-[#272124] block">{currentOrder.phone}</strong>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <span className="text-[11px] text-[#766A6C] flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-[#6B3C45]" />
              عنوان التوصيل
            </span>
            <strong className="text-[#272124] block">{currentOrder.address}</strong>
          </div>

          <div>
            <span className="text-[11px] text-[#766A6C] flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-[#6B3C45]" />
              الإجمالي النهائي
            </span>
            <strong className="font-latin text-sm font-bold text-[#6B3C45] block">
              {currentOrder.total} ج.م
            </strong>
          </div>
        </div>

        {/* Itemized Products */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-[#492832] mb-3">المنتجات المطلوبة ({currentOrder.items.length})</h3>
          <div className="divide-y divide-[#E9E1DD] border border-[#E9E1DD] rounded-2xl overflow-hidden">
            {currentOrder.items.map((item, i) => (
              <div key={i} className="p-3.5 bg-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF5F1] overflow-hidden shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <strong className="block text-[#272124]">{item.product.name}</strong>
                    <span className="text-[10px] text-[#766A6C] font-latin">
                      الكمية: {item.quantity} × {item.unitPrice} ج.م
                    </span>
                  </div>
                </div>
                <strong className="font-latin text-[#492832] font-bold">
                  {item.quantity * item.unitPrice} ج.م
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Controls for Demo */}
        <div className="pt-4 border-t border-[#E9E1DD] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isCancelled && currentStep < 5 && (
              <button
                onClick={() => advanceOrderStatus(currentOrder.id)}
                className="px-4 py-2 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>محاكاة تقدم الحالة ↗</span>
              </button>
            )}

            {!isCancelled && (
              <button
                onClick={() => cancelOrder(currentOrder.id)}
                className="px-4 py-2 bg-[#FBE9EB] hover:bg-[#B84E58] text-[#B84E58] hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>إلغاء الطلب</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setRoute('catalog')}
            className="px-4 py-2 bg-[#FAF5F1] hover:bg-[#F0E2DF] text-[#492832] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>متابعة التسوق</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

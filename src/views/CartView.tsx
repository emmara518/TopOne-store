import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Store, 
  ArrowLeft, 
  Copy, 
  Check, 
  Upload, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export const CartView: React.FC = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    shippingFee, 
    cartTotal, 
    selectedMerchant, 
    getMerchantMinimum, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    setRoute, 
    placeOrder, 
    showToast 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [customerName, setCustomerName] = useState('منة محمد أحمد');
  const [phone, setPhone] = useState('0101 234 5678');
  const [address, setAddress] = useState('15 شارع الطيران، الدور الرابع، شقة 8، علامة مميزة بجوار مسجد نور');
  const [proofFileName, setProofFileName] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const minOrder = getMerchantMinimum();
  const isBelowMinimum = cartSubtotal < minOrder;
  const remainingForMin = Math.max(0, minOrder - cartSubtotal);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    showToast(`تم نسخ ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      showToast(`تم اختيار ملف الإيصال: ${file.name}`);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('سلة المشتريات فارغة.', 'error');
      return;
    }

    if (isBelowMinimum) {
      showToast(`عفواً، الحد الأدنى للطلب لدى ${selectedMerchant.shortName} هو ${minOrder} ج.م. أضيفي منتجات بقيمة ${remainingForMin} ج.م للمتابعة.`, 'error');
      return;
    }

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      showToast('يرجى ملء الاسم ورقم الهاتف والعنوان بالتفصيل.', 'error');
      return;
    }

    if (paymentMethod === 'transfer' && !proofFileName) {
      showToast('يرجى إرفاق صورة إيصال التحويل للمراجعة.', 'error');
      return;
    }

    placeOrder({
      customerName,
      phone,
      address,
      paymentMethod,
      proofFileName
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-16">
      {/* Intro Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#766A6C]">
        <button onClick={() => setRoute('home')} className="hover:text-[#6B3C45]">الرئيسية</button>
        <span>‹</span>
        <button onClick={() => setRoute('catalog')} className="hover:text-[#6B3C45]">المنتجات</button>
        <span>‹</span>
        <span className="text-[#6B3C45] font-bold">السلة وإتمام الطلب</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#272124]">
            سلة المشتريات وتفاصيل التوصيل
          </h1>
          <p className="text-xs text-[#766A6C] mt-1">
            راجعي الكميات وطريقة الدفع المفضلة قبل اعتماد طلبك النهائي.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-[#9A8E90] hover:text-[#B84E58] transition-colors"
          >
            تفريغ السلة
          </button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {/* Merchant Context Card */}
            <div className="bg-[#FAF5F1] border border-[#E9E1DD] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0E2DF] text-[#6B3C45] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#766A6C]">التنفيذ بواسطة:</span>
                    <strong className="text-xs font-bold text-[#492832]">{selectedMerchant.name}</strong>
                  </div>
                  <span className="text-[11px] text-[#766A6C]">
                    {selectedMerchant.area}، {selectedMerchant.governorate} · رسوم التوصيل: {selectedMerchant.fee} ج.م
                  </span>
                </div>
              </div>

              <button
                onClick={() => setRoute('merchants')}
                className="text-xs font-bold text-[#6B3C45] hover:underline shrink-0"
              >
                تغيير التاجر
              </button>
            </div>

            {/* Items Card */}
            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-4 sm:p-6 divide-y divide-[#F1E9E6]">
              {cart.map(({ product, quantity }) => (
                <article key={product.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-[#F8F2EE] overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#766A6C] font-semibold block">{product.brand}</span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#272124] truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-latin text-xs font-bold text-[#6B3C45] tabular-nums">
                        {product.price} ج.م
                      </span>
                      <span className="text-[10px] text-[#766A6C]">للقطعة</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-[#E9E1DD] bg-white rounded-lg overflow-hidden h-7">
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="w-7 h-full flex items-center justify-center text-[#766A6C] hover:bg-[#F8F2EE]"
                          aria-label="تقليل الكمية"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-latin font-bold text-xs text-[#272124]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          className="w-7 h-full flex items-center justify-center text-[#766A6C] hover:bg-[#F8F2EE]"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[11px] text-[#9A8E90] hover:text-[#B84E58] flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-left shrink-0">
                    <span className="font-latin text-sm sm:text-base font-bold text-[#272124] tabular-nums block">
                      {product.price * quantity}
                    </span>
                    <span className="text-[10px] text-[#766A6C]">ج.م</span>
                  </div>
                </article>
              ))}
            </div>

            {/* Minimum Order Warning if applicable */}
            {isBelowMinimum && (
              <div className="p-4 rounded-2xl bg-[#FBE9EB] border border-[#B84E58]/30 text-[#B84E58] text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <strong className="block font-bold">قيمة السلة أقل من الحد الأدنى للتاجر</strong>
                  <span>
                    الحد الأدنى للطلب لدى {selectedMerchant.shortName} هو {minOrder} ج.م. يرجى إضافة منتجات بقيمة {remainingForMin} ج.م لتفعيل زر تأكيد الطلب.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Checkout & Delivery Form Side */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmitOrder} className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-5 sticky top-28 shadow-xs">
              <h2 className="text-base font-bold text-[#492832] pb-3 border-b border-[#E9E1DD]">
                ملخص الحساب والدفع
              </h2>

              {/* Price Calculations */}
              <div className="space-y-2.5 text-xs text-[#766A6C]">
                <div className="flex justify-between items-center">
                  <span>قيمة المنتجات ({cartCount} قطعة)</span>
                  <strong className="font-latin text-[#272124] tabular-nums">{cartSubtotal} ج.م</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span>رسوم التوصيل ({selectedMerchant.shortName})</span>
                  <strong className="font-latin text-[#272124] tabular-nums">{shippingFee} ج.م</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span>الحد الأدنى للفرع</span>
                  <span className="font-latin text-[#766A6C] tabular-nums">{minOrder} ج.م</span>
                </div>

                <div className="pt-3 border-t border-[#E9E1DD] flex justify-between items-baseline text-sm font-bold text-[#272124]">
                  <span>الإجمالي الكلي النهائي</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-latin text-2xl font-black text-[#6B3C45] tabular-nums">
                      {cartTotal}
                    </span>
                    <span className="text-xs text-[#766A6C]">ج.م</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-3 border-t border-[#E9E1DD] space-y-2.5">
                <label className="block text-xs font-bold text-[#492832]">
                  طريقة الدفع
                </label>

                <div className="space-y-2">
                  <label className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod' 
                      ? 'bg-[#FAF5F1] border-[#6B3C45] shadow-xs' 
                      : 'border-[#E9E1DD] hover:bg-[#FAF5F1]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#6B3C45]"
                      />
                      <div>
                        <strong className="block text-xs font-bold text-[#272124]">الدفع نقداً عند الاستلام (COD)</strong>
                        <span className="text-[11px] text-[#766A6C]">ادفعي للمندوب عند استلام وفحص الطلب</span>
                      </div>
                    </div>
                  </label>

                  <label className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'transfer' 
                      ? 'bg-[#FAF5F1] border-[#6B3C45] shadow-xs' 
                      : 'border-[#E9E1DD] hover:bg-[#FAF5F1]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={() => setPaymentMethod('transfer')}
                        className="accent-[#6B3C45]"
                      />
                      <div>
                        <strong className="block text-xs font-bold text-[#272124]">تحويل يدوي (إنستاباي / فودافون كاش)</strong>
                        <span className="text-[11px] text-[#766A6C]">تحويل مباشر مع إرفاق صورة الإيصال للاعتماد</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Transfer Details Panel */}
                {paymentMethod === 'transfer' && (
                  <div className="p-4 bg-[#FAF5F1] rounded-xl border border-[#E9E1DD] space-y-3 mt-3 animate-in fade-in duration-150">
                    <span className="text-[11px] font-bold text-[#492832] block">
                      بيانات التحويل المعتمدة:
                    </span>

                    {/* InstaPay */}
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E9E1DD] text-xs">
                      <div>
                        <span className="text-[10px] text-[#766A6C] block">InstaPay IPA:</span>
                        <strong className="font-latin text-xs font-bold text-[#272124]">topone.official@instapay</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('topone.official@instapay', 'معرف إنستاباي')}
                        className="p-1.5 text-[#6B3C45] hover:bg-[#F0E2DF] rounded-md transition-colors"
                        title="نسخ"
                      >
                        {copiedField === 'معرف إنستاباي' ? <Check className="w-4 h-4 text-[#597B6D]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Vodafone Cash */}
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E9E1DD] text-xs">
                      <div>
                        <span className="text-[10px] text-[#766A6C] block">محفظة فودافون كاش:</span>
                        <strong className="font-latin text-xs font-bold text-[#272124]">0100 123 4567</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('01001234567', 'رقم المحفظة')}
                        className="p-1.5 text-[#6B3C45] hover:bg-[#F0E2DF] rounded-md transition-colors"
                        title="نسخ"
                      >
                        {copiedField === 'رقم المحفظة' ? <Check className="w-4 h-4 text-[#597B6D]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Receipt Upload */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#492832] mb-1.5">
                        صورة إيصال التحويل *
                      </label>
                      <label className="border-2 border-dashed border-[#D9C7C1] hover:border-[#6B3C45] bg-white rounded-xl p-3 text-center cursor-pointer block transition-colors">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Upload className="w-5 h-5 text-[#6B3C45] mx-auto mb-1" />
                        <span className="text-xs font-bold text-[#272124] block">
                          {proofFileName ? proofFileName : 'اضغطي هنا لرفع صورة الإيصال'}
                        </span>
                        <span className="text-[10px] text-[#9A8E90]">
                          JPG, PNG أو PDF
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Details Form */}
              <div className="pt-3 border-t border-[#E9E1DD] space-y-3">
                <h3 className="text-xs font-bold text-[#492832]">بيانات مستلم الطلب</h3>

                <div>
                  <label htmlFor="client-name" className="block text-[11px] text-[#766A6C] font-semibold mb-1">
                    الاسم بالكامل
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full h-10 px-3 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="client-phone" className="block text-[11px] text-[#766A6C] font-semibold mb-1">
                    رقم الهاتف للتوصيل
                  </label>
                  <input
                    id="client-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="010XXXXXXXX"
                    className="w-full h-10 px-3 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none font-latin"
                  />
                </div>

                <div>
                  <label htmlFor="client-address" className="block text-[11px] text-[#766A6C] font-semibold mb-1">
                    العنوان التفصيلي
                  </label>
                  <textarea
                    id="client-address"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="الشارع، رقم العمارة، الدور، الشقة، علامة مميزة"
                    className="w-full p-2.5 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isBelowMinimum}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isBelowMinimum 
                    ? 'bg-[#E9E1DD] text-[#9A8E90] cursor-not-allowed' 
                    : 'bg-[#6B3C45] hover:bg-[#492832] text-white hover:shadow'
                }`}
              >
                <span>تأكيد الطلب الآن</span>
                <span className="font-latin text-xs">({cartTotal} ج.م)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#766A6C]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#597B6D]" />
                <span>طلبك محمي بضمان الاسترجاع وفحص المنتجات قبل الاستلام.</span>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="bg-white border border-[#E9E1DD] rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF5F1] text-[#6B3C45] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="text-lg font-bold text-[#272124]">
            سلة المشتريات فارغة حالياً
          </h2>
          <p className="text-xs text-[#766A6C] max-w-sm mx-auto leading-relaxed">
            اختاري مستحضرات العناية والمكياج والعطور من الكتالوج واحصلي على توصيل فوري من تاجر منطقتك.
          </p>
          <button
            onClick={() => setRoute('catalog')}
            className="px-6 py-3 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            تصفح الكتالوج الآن
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, ShieldCheck, Truck, Store, Plus, Minus } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProductModal, 
    setActiveProductModal, 
    getProductStockAtMerchant, 
    selectedMerchant, 
    addToCart,
    setRoute
  } = useApp();

  const [qty, setQty] = useState(1);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const stock = getProductStockAtMerchant(product.id);
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (addToCart(product.id, qty)) {
      setActiveProductModal(null);
    }
  };

  const handleBuyNow = () => {
    if (addToCart(product.id, qty)) {
      setActiveProductModal(null);
      setRoute('cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24181B]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#FFFDFB] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E9E1DD] relative max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-5 left-5 p-2 rounded-xl bg-[#F8F2EE] text-[#766A6C] hover:text-[#272124] hover:bg-[#E9E1DD] transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Product Image */}
          <div className="bg-[#F8F2EE] rounded-2xl overflow-hidden aspect-4/3 md:aspect-square flex items-center justify-center relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-white/90 text-[#492832] backdrop-blur-xs shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Specs & Purchase Module */}
          <div className="flex flex-col justify-between h-full space-y-4">
            <div>
              {/* Brand and SKU */}
              <div className="flex items-center gap-2 text-xs text-[#766A6C] font-semibold mb-1">
                <span>{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span className="font-latin">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-[#272124] leading-snug mb-2">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-latin text-2xl font-bold text-[#492832] tabular-nums">
                  {product.price}
                </span>
                <span className="text-xs text-[#766A6C] font-bold">جنيه مصري</span>
                {product.oldPrice && (
                  <span className="text-xs text-[#9A8E90] line-through font-latin mr-2 tabular-nums">
                    {product.oldPrice} ج.م
                  </span>
                )}
                <span className="text-[10px] text-[#597B6D] bg-[#E9F2ED] px-2 py-0.5 rounded font-bold mr-auto">
                  سعر موحّد رسمي
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#766A6C] leading-relaxed mb-4">
                {product.description || 'مستحضر أصلي مصرح، تم استيراده وفحصه من الشركة لضمان أعلى معايير الجودة والفاعلية.'}
              </p>

              {/* Merchant Stock Context */}
              <div className="p-3.5 rounded-xl bg-[#FAF5F1] border border-[#E9E1DD] space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#492832] flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#6B3C45]" />
                    التاجر المعتمد:
                  </span>
                  <span className="text-[#272124] font-semibold">{selectedMerchant.name}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#766A6C]">حالة التوفر لدى الفرع:</span>
                  <span className={`font-bold ${isOutOfStock ? 'text-[#B84E58]' : 'text-[#597B6D]'}`}>
                    {isOutOfStock ? 'نفد المخزون حالياً' : `متوفر (${stock} قطعة)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Stepper & Buttons */}
            <div className="space-y-3 pt-2">
              {!isOutOfStock && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#492832]">الكمية المطلوبة:</span>
                  <div className="flex items-center border border-[#E9E1DD] bg-white rounded-xl overflow-hidden h-9">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-full flex items-center justify-center text-[#766A6C] hover:bg-[#F8F2EE] transition-colors"
                      aria-label="تقليل"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-latin font-bold text-xs text-[#272124]">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(stock, qty + 1))}
                      className="w-8 h-full flex items-center justify-center text-[#766A6C] hover:bg-[#F8F2EE] transition-colors"
                      aria-label="زيادة"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isOutOfStock
                      ? 'bg-[#E9E1DD] text-[#9A8E90] cursor-not-allowed'
                      : 'bg-[#6B3C45] hover:bg-[#492832] text-white'
                  }`}
                >
                  إضافة إلى سلة المشتريات
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`py-3 px-5 rounded-xl text-xs font-bold border transition-colors ${
                    isOutOfStock
                      ? 'border-[#E9E1DD] text-[#9A8E90] cursor-not-allowed'
                      : 'border-[#6B3C45] text-[#6B3C45] hover:bg-[#F0E2DF]'
                  }`}
                >
                  طلب فوري
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-[#766A6C] pt-2 border-t border-[#E9E1DD]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#597B6D]" />
                  أصلي 100% ومعتمد
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#6B3C45]" />
                  شحن من أقرب تاجر
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#B08C5A]" />
                  دفع عند الاستلام أو تحويل
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

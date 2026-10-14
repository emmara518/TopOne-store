import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    getProductStockAtMerchant, 
    addToCart, 
    favorites, 
    toggleFavorite, 
    setActiveProductModal,
    cart
  } = useApp();

  const stock = getProductStockAtMerchant(product.id);
  const isOutOfStock = stock <= 0;
  const isFav = favorites.includes(product.id);
  const cartItem = cart.find(i => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  return (
    <article className="group bg-white rounded-2xl border border-[#E9E1DD] overflow-hidden flex flex-col hover:border-[#C89191] hover:shadow-md transition-all duration-200">
      {/* Product Image Area */}
      <div 
        onClick={() => setActiveProductModal(product)}
        className="relative h-56 sm:h-64 bg-[#F8F2EE] cursor-pointer overflow-hidden flex items-center justify-center"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300"
        />

        {/* Top Badges / Tag */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-start pointer-events-none">
          {product.badge && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              product.isDeal 
                ? 'bg-[#FBE9EB] text-[#B84E58]' 
                : 'bg-white/90 text-[#492832] backdrop-blur-xs'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFav 
              ? 'bg-[#B84E58] text-white shadow-xs' 
              : 'bg-white/85 text-[#766A6C] hover:text-[#B84E58] hover:bg-white'
          }`}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Volume / Size indicator */}
        {product.volume && (
          <span className="absolute bottom-2.5 right-3 text-[10px] font-medium text-[#766A6C] bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded font-latin">
            {product.volume}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center gap-2 text-[11px] text-[#766A6C] font-semibold mb-1">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setActiveProductModal(product)}
            className="text-xs sm:text-sm font-bold text-[#272124] leading-snug line-clamp-2 hover:text-[#6B3C45] transition-colors cursor-pointer mb-2 min-h-10"
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Stock Footer */}
        <div className="pt-2 border-t border-[#F8F2EE] mt-2">
          <div className="flex items-baseline justify-between gap-2 mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-latin text-base sm:text-lg font-bold text-[#492832] tabular-nums">
                {product.price}
              </span>
              <span className="text-[11px] text-[#766A6C]">ج.م</span>
              {product.oldPrice && (
                <span className="text-[11px] text-[#9A8E90] line-through font-latin mr-1 tabular-nums">
                  {product.oldPrice} ج.م
                </span>
              )}
            </div>

            {/* Live Merchant Stock Status */}
            <div className="text-[11px]">
              {isOutOfStock ? (
                <span className="text-[#B84E58] font-bold">غير متوفر</span>
              ) : (
                <span className="text-[#597B6D] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#597B6D]"></span>
                  متوفر ({stock})
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveProductModal(product)}
              className="flex-1 py-2 px-3 text-[11px] font-bold text-[#492832] bg-[#F8F2EE] hover:bg-[#F0E2DF] rounded-xl transition-colors"
            >
              تفاصيل
            </button>

            <button
              onClick={() => addToCart(product.id, 1)}
              disabled={isOutOfStock}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-[#F1EEEC] text-[#9A8E90] cursor-not-allowed'
                  : inCartQty > 0
                  ? 'bg-[#597B6D] text-white hover:bg-[#466659]'
                  : 'bg-[#6B3C45] text-white hover:bg-[#492832] shadow-xs'
              }`}
              aria-label="إضافة للسلة"
            >
              {inCartQty > 0 ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="font-latin text-[11px]">({inCartQty})</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">أضف</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

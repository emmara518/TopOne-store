import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  SlidersHorizontal, 
  Store, 
  Sparkles, 
  X,
  Search
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { 
    products, 
    activeCategory, 
    setActiveCategory, 
    activeBrand, 
    setActiveBrand, 
    dealsOnly, 
    setDealsOnly, 
    sortBy, 
    setSortBy, 
    searchQuery, 
    setSearchQuery, 
    selectedMerchant, 
    setRoute 
  } = useApp();

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  const categories = ['الكل', 'العناية بالبشرة', 'المكياج', 'العناية بالشعر', 'العطور', 'العناية بالجسم'];
  const brands = ['الكل', ...new Set(products.map(p => p.brand))];

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchCategory = activeCategory === 'الكل' || p.category === activeCategory;
      const matchBrand = activeBrand === 'الكل' || p.brand === activeBrand;
      const matchDeal = !dealsOnly || p.isDeal;
      const matchSearch = searchQuery.trim() === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchBrand && matchDeal && matchSearch;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    }

    return result;
  }, [products, activeCategory, activeBrand, dealsOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setActiveCategory('الكل');
    setActiveBrand('الكل');
    setDealsOnly(false);
    setSearchQuery('');
    setSortBy('recommended');
  };

  const hasActiveFilters = activeCategory !== 'الكل' || activeBrand !== 'الكل' || dealsOnly || searchQuery.trim() !== '';

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-16">
      {/* Catalog Intro Header */}
      <div className="border-b border-[#E9E1DD] pb-5">
        <div className="flex items-center gap-2 text-xs text-[#766A6C] mb-2">
          <button onClick={() => setRoute('home')} className="hover:text-[#6B3C45]">الرئيسية</button>
          <span>‹</span>
          <span className="text-[#6B3C45] font-bold">كل المنتجات</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#272124]">
              كتالوج مستحضرات التجميل
            </h1>
            <p className="text-xs text-[#766A6C] mt-1">
              الأسعار موحدة لكافة المنتجات. يتم فحص توفر الكميات فورياً لدى فرع التاجر: <strong className="text-[#492832]">{selectedMerchant.shortName}</strong> ({selectedMerchant.area}).
            </p>
          </div>

          <button
            onClick={() => setRoute('merchants')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E9E1DD] bg-white text-xs font-bold text-[#492832] hover:bg-[#FAF5F1] transition-colors self-start sm:self-auto"
          >
            <Store className="w-4 h-4 text-[#6B3C45]" />
            <span>تغيير التاجر ({selectedMerchant.shortName})</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white border border-[#E9E1DD] rounded-2xl p-5 space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E1DD]">
            <h3 className="text-xs font-bold text-[#492832] flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#6B3C45]" />
              تصفية المنتجات
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-[#B84E58] hover:underline"
              >
                مسح الفلاتر
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#272124]">القسم</h4>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    activeCategory === cat 
                      ? 'bg-[#F0E2DF] text-[#6B3C45] font-bold' 
                      : 'text-[#766A6C] hover:bg-[#FAF5F1]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="font-latin text-[10px] text-[#9A8E90]">
                    {cat === 'الكل' ? products.length : products.filter(p => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Deals Only Toggle */}
          <div className="pt-4 border-t border-[#E9E1DD]">
            <button
              onClick={() => setDealsOnly(!dealsOnly)}
              className={`w-full text-right p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                dealsOnly 
                  ? 'bg-[#FBE9EB] border-[#B84E58] text-[#B84E58]' 
                  : 'bg-[#FAF5F1] border-[#E9E1DD] text-[#766A6C] hover:bg-[#F0E2DF]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B84E58]" />
                عروض وتخفيضات خاصة
              </span>
              <span className="w-4 h-4 rounded border flex items-center justify-center font-bold text-[10px] bg-white">
                {dealsOnly ? '✓' : ''}
              </span>
            </button>
          </div>

          {/* Brand Filter */}
          <div className="pt-4 border-t border-[#E9E1DD] space-y-2">
            <h4 className="text-xs font-bold text-[#272124]">الماركة</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pl-1">
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => setActiveBrand(b)}
                  className={`w-full text-right px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    activeBrand === b 
                      ? 'bg-[#F0E2DF] text-[#6B3C45] font-bold' 
                      : 'text-[#766A6C] hover:bg-[#FAF5F1]'
                  }`}
                >
                  <span>{b}</span>
                  <span className="font-latin text-[10px] text-[#9A8E90]">
                    {b === 'الكل' ? products.length : products.filter(p => p.brand === b).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Merchant Stock reminder */}
          <div className="pt-4 border-t border-[#E9E1DD] text-[11px] text-[#766A6C] space-y-1">
            <span className="font-bold text-[#492832] block">مخزون الفرع الحالي:</span>
            <span>{selectedMerchant.shortName} ({selectedMerchant.area})</span>
            <p className="text-[10px] text-[#597B6D] pt-1">
              ● تظهر حالة التوفر بالألوان والأرقام الحقيقية لكل صنف.
            </p>
          </div>
        </aside>

        {/* Products Content Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar: Category Chips, Mobile Filter Button, Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E9E1DD]">
            {/* Category horizontal chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.slice(0, 4).map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    activeCategory === c 
                      ? 'bg-[#6B3C45] text-white font-bold' 
                      : 'bg-[#FAF5F1] text-[#766A6C] hover:bg-[#F0E2DF]'
                  }`}
                >
                  {c}
                </button>
              ))}
              {dealsOnly && (
                <span className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap bg-[#FBE9EB] text-[#B84E58] font-bold flex items-center gap-1">
                  عروض فقط
                  <button onClick={() => setDealsOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>

            {/* Actions: Sort & Mobile filter */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3 py-1.5 bg-[#FAF5F1] text-[#492832] rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>فلاتر</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none"
              >
                <option value="recommended">الترتيب: المقترح</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="name">الاسم: أ - ي</option>
              </select>
            </div>
          </div>

          {/* Results count & Active search hint */}
          <div className="flex items-center justify-between text-xs text-[#766A6C] px-1">
            <span>
              عرض <strong className="font-latin text-[#272124]">{filteredProducts.length}</strong> منتج
            </span>
            {searchQuery && (
              <span className="flex items-center gap-1">
                البحث عن: «{searchQuery}»
                <button onClick={() => setSearchQuery('')} className="text-[#B84E58] font-bold">مسح</button>
              </span>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-[#D9C7C1] p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-[#9A8E90] mx-auto opacity-70" />
              <h3 className="text-sm font-bold text-[#272124]">
                لم نعثر على منتجات تطابق هذه الفلاتر
              </h3>
              <p className="text-xs text-[#766A6C] max-w-sm mx-auto">
                جرّبي إزالة بعض الفلاتر أو البحث بكلمات أخرى لعرض تشكيلات التجميل المتاحة.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#6B3C45] text-white rounded-xl text-xs font-bold"
              >
                مسح كل الفلاتر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

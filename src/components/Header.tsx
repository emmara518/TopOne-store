import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  Store, 
  Building2, 
  ChevronDown, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    route, 
    setRoute, 
    governorate, 
    area, 
    cartCount, 
    searchQuery, 
    setSearchQuery, 
    selectedMerchant,
    setIsLocationModalOpen,
    setActiveCategory,
    dealsOnly,
    setDealsOnly
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (route !== 'catalog' && val.trim().length > 0) {
      setRoute('catalog');
    }
  };

  const navToCategory = (cat: string) => {
    setActiveCategory(cat);
    setDealsOnly(false);
    setRoute('catalog');
    setMobileMenuOpen(false);
  };

  const navToDeals = () => {
    setActiveCategory('الكل');
    setDealsOnly(true);
    setRoute('catalog');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFB]/95 backdrop-blur-md border-b border-[#E9E1DD] shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#492832] text-[#FFF4F0] px-4 py-1.5 text-xs text-center flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E1B8A6] animate-pulse"></span>
        <span className="font-medium">توصيل محلي سريع عبر تاجر معتمد في منطقتك</span>
        <span className="opacity-40">|</span>
        <span className="opacity-90">الأسعار موحدة في كافة المحافظات والمناطق</span>
        <span className="hidden md:inline-flex items-center gap-1.5 text-[#E1B8A6] font-semibold text-[11px] mr-2">
          <Sparkles className="w-3 h-3" />
          <span>ضمان جودة وأصالة TOP ONE</span>
        </span>
      </div>

      {/* Main Top Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 sm:gap-8">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#492832] hover:bg-[#F8F2EE] rounded-xl transition-colors"
          aria-label="القائمة"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Wordmark (Zone 1) */}
        <button 
          onClick={() => { setRoute('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 text-right group shrink-0 focus:outline-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#6B3C45] flex items-center justify-center text-white font-latin font-bold text-2xl tracking-tighter shadow-sm group-hover:bg-[#492832] transition-colors">
            T<span className="text-[#E1B8A6]">O</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-latin font-bold text-xl tracking-wider text-[#492832]">
              TOP ONE
            </span>
            <span className="text-[10px] tracking-widest text-[#766A6C] font-semibold uppercase">
              Beauty Distribution
            </span>
          </div>
        </button>

        {/* Location Selector */}
        <button 
          onClick={() => setIsLocationModalOpen(true)}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#E9E1DD] bg-[#FAF5F1] hover:bg-[#F0E2DF]/60 transition-colors shrink-0 text-right group"
        >
          <MapPin className="w-4 h-4 text-[#6B3C45] group-hover:scale-110 transition-transform shrink-0" />
          <div className="flex flex-col text-right leading-none">
            <span className="text-[10px] text-[#766A6C] font-medium mb-1">منطقة التوصيل</span>
            <span className="text-xs font-bold text-[#272124] flex items-center gap-1">
              {governorate}، {area}
              <ChevronDown className="w-3 h-3 text-[#766A6C] group-hover:translate-y-0.5 transition-transform" />
            </span>
          </div>
        </button>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#9A8E90] absolute right-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="ابحث عن سيروم، عطر، ماركة، أو مرطب..."
              className="w-full h-10.5 pr-9 pl-12 text-xs bg-[#F6F1EE] border border-transparent rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none transition-all placeholder:text-[#9A8E90]"
            />
            <kbd className="hidden lg:flex items-center gap-0.5 absolute left-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-latin font-semibold text-[#9A8E90] bg-[#E9E1DD]/70 rounded border border-[#D9C7C1]/50 pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Action Controls (Zone 3) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Merchant Indicator */}
          <button 
            onClick={() => setRoute('merchants')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-white border border-[#E9E1DD] text-[#492832] hover:border-[#C89191] transition-colors"
            title="التاجر المعتمد المختار"
          >
            <Store className="w-3.5 h-3.5 text-[#6B3C45]" />
            <span className="text-[11px] text-[#766A6C]">التاجر:</span>
            <strong className="text-xs font-bold text-[#492832]">{selectedMerchant.shortName}</strong>
          </button>

          {/* B2B Merchant Portal Button */}
          <button
            onClick={() => setRoute('merchant-portal')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              route === 'merchant-portal' 
                ? 'bg-[#492832] text-white shadow-sm' 
                : 'text-[#492832] bg-[#F8F2EE] hover:bg-[#F0E2DF]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#6B3C45]" />
            <span className="hidden sm:inline">بوابة التجار</span>
            <span className="sm:hidden">تاجر</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setRoute('cart')}
            className="relative flex items-center gap-2.5 px-4 py-2 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all group"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFF4F0] group-hover:scale-105 transition-transform" />
            <span className="hidden md:inline">السلة</span>
            {cartCount > 0 ? (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-white text-[#6B3C45] font-latin font-bold text-[11px] flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            ) : (
              <span className="hidden md:inline opacity-75 font-normal text-[11px]">0</span>
            )}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="border-t border-[#E9E1DD]/80 bg-[#FFFDFB] hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-6 h-11 flex items-center justify-between">
          <div className="flex items-center gap-8 text-xs font-semibold text-[#766A6C]">
            <button 
              onClick={() => { setActiveCategory('الكل'); setDealsOnly(false); setRoute('home'); }}
              className={`py-3 transition-colors hover:text-[#6B3C45] ${route === 'home' ? 'text-[#6B3C45] font-bold border-b-2 border-[#6B3C45]' : ''}`}
            >
              الرئيسية
            </button>
            <button 
              onClick={() => { setRoute('merchants'); }}
              className={`py-3 transition-colors hover:text-[#6B3C45] ${route === 'merchants' ? 'text-[#6B3C45] font-bold border-b-2 border-[#6B3C45]' : ''}`}
            >
              التجار المعتمدون
            </button>
            <button 
              onClick={() => navToCategory('الكل')}
              className={`py-3 transition-colors hover:text-[#6B3C45] ${route === 'catalog' && !dealsOnly ? 'text-[#6B3C45] font-bold border-b-2 border-[#6B3C45]' : ''}`}
            >
              جميع المنتجات
            </button>
            <button 
              onClick={() => navToCategory('العناية بالبشرة')}
              className="py-3 transition-colors hover:text-[#6B3C45]"
            >
              العناية بالبشرة
            </button>
            <button 
              onClick={() => navToCategory('المكياج')}
              className="py-3 transition-colors hover:text-[#6B3C45]"
            >
              المكياج
            </button>
            <button 
              onClick={() => navToCategory('العطور')}
              className="py-3 transition-colors hover:text-[#6B3C45]"
            >
              العطور الفرنسية
            </button>
            <button 
              onClick={() => navToCategory('العناية بالشعر')}
              className="py-3 transition-colors hover:text-[#6B3C45]"
            >
              العناية بالشعر
            </button>
            <button 
              onClick={navToDeals}
              className={`py-3 transition-colors hover:text-[#B84E58] flex items-center gap-1.5 ${dealsOnly ? 'text-[#B84E58] font-bold border-b-2 border-[#B84E58]' : 'text-[#B84E58]'}`}
            >
              <span>العروض والخصومات</span>
              <span className="text-[10px] bg-[#FBE9EB] text-[#B84E58] px-1.5 py-0.2 rounded font-bold">توفير</span>
            </button>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <button
              onClick={() => setRoute('order')}
              className={`py-3 font-semibold transition-colors ${route === 'order' ? 'text-[#6B3C45] font-bold' : 'text-[#766A6C] hover:text-[#6B3C45]'}`}
            >
              تتبّع الطلب
            </button>
            <span className="text-[#E9E1DD]">|</span>
            <button
              onClick={() => setRoute('company-portal')}
              className={`py-3 font-semibold transition-colors flex items-center gap-1.5 ${route === 'company-portal' ? 'text-[#492832] font-bold' : 'text-[#766A6C] hover:text-[#492832]'}`}
            >
              <span>لوحة الشركة (Admin)</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E9E1DD] px-4 py-4 space-y-3">
          <button 
            onClick={() => { setIsLocationModalOpen(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF5F1] text-xs font-bold text-[#492832]"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6B3C45]" />
              <span>منطقة التوصيل: {governorate}، {area}</span>
            </div>
            <span className="text-[#6B3C45] text-[11px]">تغيير</span>
          </button>

          <div className="relative pt-1">
            <Search className="w-4 h-4 text-[#9A8E90] absolute right-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="ابحث عن منتج أو ماركة..."
              className="w-full h-10 pr-9 pl-4 text-xs bg-[#F6F1EE] rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E9E1DD]">
            <button 
              onClick={() => { setRoute('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-right text-xs font-bold ${route === 'home' ? 'bg-[#F0E2DF] text-[#6B3C45]' : 'text-[#272124]'}`}
            >
              الرئيسية
            </button>
            <button 
              onClick={() => { setRoute('merchants'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-right text-xs font-bold ${route === 'merchants' ? 'bg-[#F0E2DF] text-[#6B3C45]' : 'text-[#272124]'}`}
            >
              التجار المعتمدون
            </button>
            <button 
              onClick={() => navToCategory('الكل')}
              className="p-2.5 rounded-lg text-right text-xs font-bold text-[#272124]"
            >
              كل المنتجات
            </button>
            <button 
              onClick={navToDeals}
              className="p-2.5 rounded-lg text-right text-xs font-bold text-[#B84E58]"
            >
              العروض والخصومات
            </button>
            <button 
              onClick={() => navToCategory('العناية بالبشرة')}
              className="p-2.5 rounded-lg text-right text-xs font-semibold text-[#766A6C]"
            >
              العناية بالبشرة
            </button>
            <button 
              onClick={() => navToCategory('المكياج')}
              className="p-2.5 rounded-lg text-right text-xs font-semibold text-[#766A6C]"
            >
              المكياج
            </button>
            <button 
              onClick={() => navToCategory('العطور')}
              className="p-2.5 rounded-lg text-right text-xs font-semibold text-[#766A6C]"
            >
              العطور
            </button>
            <button 
              onClick={() => navToCategory('العناية بالشعر')}
              className="p-2.5 rounded-lg text-right text-xs font-semibold text-[#766A6C]"
            >
              العناية بالشعر
            </button>
          </div>

          <div className="pt-2 border-t border-[#E9E1DD] flex items-center justify-between text-xs font-bold">
            <button 
              onClick={() => { setRoute('order'); setMobileMenuOpen(false); }}
              className="text-[#6B3C45] p-2"
            >
              تتبّع الطلب
            </button>
            <button 
              onClick={() => { setRoute('company-portal'); setMobileMenuOpen(false); }}
              className="text-[#492832] p-2"
            >
              لوحة إدارة الشركة
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

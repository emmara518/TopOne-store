import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { HERO_IMAGE } from '../data/initialData';
import { 
  ShieldCheck, 
  Tag, 
  Truck, 
  CreditCard, 
  MapPin, 
  ArrowLeft, 
  Store, 
  Sparkles,
  Droplets,
  Palette,
  HeartHandshake
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    setRoute, 
    governorate, 
    area, 
    products, 
    setActiveCategory, 
    setDealsOnly,
    setIsLocationModalOpen,
    selectedMerchant
  } = useApp();

  const featuredProducts = products.slice(0, 8);

  const categories = [
    { name: 'العناية بالبشرة', icon: Droplets, sub: 'سيروم، كريمات، غسول منقي' },
    { name: 'المكياج', icon: Palette, sub: 'أساسيات الإطلالة والجمال' },
    { name: 'العناية بالشعر', icon: Sparkles, sub: 'روتين يومي وترميم متكامل' },
    { name: 'العطور', icon: Tag, sub: 'عطور فرنسية وزهرية فاخرة' },
    { name: 'العناية بالجسم', icon: HeartHandshake, sub: 'ترطيب عميق وزيوت طبيعية' },
    { name: 'عروض', icon: Sparkles, sub: 'خصومات مميزة وأسعار توفير', isSale: true }
  ];

  const handleCategoryClick = (catName: string) => {
    if (catName === 'عروض') {
      setActiveCategory('الكل');
      setDealsOnly(true);
    } else {
      setActiveCategory(catName);
      setDealsOnly(false);
    }
    setRoute('catalog');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="bg-[#F2E7E0] rounded-3xl overflow-hidden border border-[#E9E1DD] grid grid-cols-1 lg:grid-cols-12 min-h-[460px] items-stretch">
            {/* Copy Side */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-14 flex flex-col justify-center items-start text-right">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#6B3C45] mb-4">
                <span className="w-5 h-px bg-[#6B3C45]"></span>
                <span>بوابة توزيع التجميل الأولى في مصر</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#492832] leading-tight mb-4 tracking-tight">
                كل ما تحتاجينه من الجمال، <br />
                <span className="text-[#C89191] font-bold">في مكان واحد وبسعر موحّد.</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#766A6C] max-w-lg leading-relaxed mb-8">
                اكتشفي أرقى مستحضرات العناية والمكياج والعطور الأصلية، واختاري التاجر المعتمد الذي يغطي منطقتك في {governorate} مع شحن فوري وأسعار ثابتة.
              </p>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setRoute('merchants')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>اختاري التاجر الأقرب</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { setActiveCategory('الكل'); setDealsOnly(false); setRoute('catalog'); }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FAF5F1] text-[#492832] border border-[#E9E1DD] rounded-xl text-xs font-bold transition-colors"
                >
                  تصفح المنتجات
                </button>
              </div>

              {/* Social Proof / Network Coverage */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#E9E1DD]/70 text-xs text-[#766A6C]">
                <div className="flex -space-x-2 space-x-reverse font-latin font-bold text-[10px] text-[#492832]">
                  <span className="w-7 h-7 rounded-full bg-[#DFBEB5] border-2 border-[#F2E7E0] flex items-center justify-center">TO</span>
                  <span className="w-7 h-7 rounded-full bg-[#D1B99D] border-2 border-[#F2E7E0] flex items-center justify-center">EG</span>
                  <span className="w-7 h-7 rounded-full bg-[#B8C4B1] border-2 border-[#F2E7E0] flex items-center justify-center">B2B</span>
                </div>
                <span>شبكة من التجار المعتمدين تغطي محافظات القاهرة والجيزة والإسكندرية والدلتا</span>
              </div>
            </div>

            {/* Visual Side */}
            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-[#E5D2C8] overflow-hidden">
              <img
                src={HERO_IMAGE}
                alt="تشكيلة مستحضرات التجميل والعناية الفاخرة TOP ONE"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#492832]/30 via-transparent to-transparent"></div>

              {/* Verified Floating Chip */}
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md border border-white/60 p-3 rounded-2xl shadow-lg flex items-center gap-3 max-w-xs">
                <div className="w-9 h-9 rounded-xl bg-[#E9F2ED] text-[#597B6D] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div className="text-right">
                  <strong className="block text-xs font-bold text-[#272124]">طلبك بثقة كاملة</strong>
                  <span className="text-[10px] text-[#766A6C]">تاجر معتمد ومخزون فوري</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-[#E9E1DD] rounded-2xl mt-5 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-l border-[#E9E1DD] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5F1] text-[#6B3C45] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-right">
                <strong className="block text-xs font-bold text-[#272124]">تجار معتمدون</strong>
                <span className="text-[11px] text-[#766A6C]">توزيع مباشر وموثوق</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-l border-[#E9E1DD] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5F1] text-[#6B3C45] flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="text-right">
                <strong className="block text-xs font-bold text-[#272124]">سعر موحد رسمي</strong>
                <span className="text-[11px] text-[#766A6C]">لا اختلاف بالأسعار</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-l border-[#E9E1DD] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5F1] text-[#6B3C45] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <strong className="block text-xs font-bold text-[#272124]">توصيل محلي شفاف</strong>
                <span className="text-[11px] text-[#766A6C]">الرسوم واضحة مسبقاً</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5F1] text-[#6B3C45] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-right">
                <strong className="block text-xs font-bold text-[#272124]">دفع عند الاستلام</strong>
                <span className="text-[11px] text-[#766A6C]">أو إنستاباي ومحافظ</span>
              </div>
            </div>
          </div>

          {/* Location Bar / Selection Card */}
          <div className="mt-5 p-4 sm:p-5 bg-white border border-[#E9E1DD] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-right">
              <div className="w-9 h-9 rounded-xl bg-[#F0E2DF] text-[#6B3C45] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#766A6C] font-semibold block">موقعك الحالي:</span>
                <strong className="text-xs sm:text-sm font-bold text-[#492832]">
                  {governorate} — {area}
                </strong>
                <span className="text-[11px] text-[#766A6C] block sm:inline sm:mr-2">
                  (التاجر الأقرب: {selectedMerchant.shortName})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-[#6B3C45] bg-[#FAF5F1] hover:bg-[#F0E2DF] rounded-xl transition-colors"
              >
                تغيير المنطقة
              </button>
              <button
                onClick={() => setRoute('merchants')}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-white bg-[#6B3C45] hover:bg-[#492832] rounded-xl transition-colors"
              >
                عرض التجار المتاحين
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Discovery */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#6B3C45] uppercase tracking-wider block mb-1">
              تسوقي حسب احتياجك
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#272124]">
              اكتشفي أقسام TOP ONE
            </h2>
          </div>
          <button
            onClick={() => { setActiveCategory('الكل'); setDealsOnly(false); setRoute('catalog'); }}
            className="text-xs font-bold text-[#6B3C45] hover:text-[#492832] flex items-center gap-1 transition-colors"
          >
            <span>كل الأقسام</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={i}
                onClick={() => handleCategoryClick(cat.name)}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2.5 transition-all group hover:-translate-y-1 ${
                  cat.isSale 
                    ? 'bg-[#FBE9EB]/50 border-[#B84E58]/30 hover:border-[#B84E58]' 
                    : 'bg-white border-[#E9E1DD] hover:border-[#C89191] hover:shadow-xs'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  cat.isSale 
                    ? 'bg-[#FBE9EB] text-[#B84E58]' 
                    : 'bg-[#FAF5F1] text-[#6B3C45] group-hover:bg-[#F0E2DF]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-[#272124] mb-0.5">
                    {cat.name}
                  </strong>
                  <span className="text-[10px] text-[#766A6C] line-clamp-1">
                    {cat.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#FAF5F1] py-12 border-y border-[#E9E1DD]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold text-[#6B3C45] uppercase tracking-wider block mb-1">
                مختارة بعناية لكِ
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272124]">
                منتجات مميزة تستحق التجربة
              </h2>
              <p className="text-xs text-[#766A6C] mt-1">
                الأسعار موحدة، ويتم التحقق من التوفر فورياً لدى تاجر {selectedMerchant.shortName}.
              </p>
            </div>

            <button
              onClick={() => { setActiveCategory('الكل'); setDealsOnly(false); setRoute('catalog'); }}
              className="text-xs font-bold text-[#6B3C45] hover:text-[#492832] flex items-center gap-1 transition-colors"
            >
              <span>عرض كل المنتجات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => { setActiveCategory('الكل'); setDealsOnly(false); setRoute('catalog'); }}
              className="px-8 py-3.5 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all inline-flex items-center gap-2"
            >
              <span>تصفح الكتالوج الكامل ({products.length} منتج)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Merchant Promo Banner */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="bg-[#492832] text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative border border-[#6B3C45] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-right z-10">
            <span className="text-[11px] font-bold text-[#E1B8A6] uppercase tracking-wider block mb-2">
              شبكة التجار المعتمدين في مصر
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-3">
              طلبك يوصلك من تاجر قريب منك — بسرعة وموثوقية.
            </h3>
            <p className="text-xs sm:text-sm text-[#F0E2DF] leading-relaxed mb-6">
              قارني بين التقييمات ووقت التوصيل ورسوم الشحن لكل فرع، واختاري التاجر الأنسب لمنطقتك قبل إتمام الشراء.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setRoute('merchants')}
                className="px-6 py-3 bg-[#E1B8A6] hover:bg-white text-[#492832] rounded-xl text-xs font-bold transition-colors"
              >
                اختاري التاجر الآن
              </button>
              <button
                onClick={() => setRoute('merchant-portal')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
              >
                أنت تاجر؟ انضم للشبكة (B2B)
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-44 h-44 rounded-full border border-white/15 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-white/25 flex flex-col items-center justify-center text-center">
                <span className="font-latin text-2xl font-black tracking-wider text-[#E1B8A6]">TOP ONE</span>
                <span className="text-[9px] tracking-widest uppercase opacity-75">Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

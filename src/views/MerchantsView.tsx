import React from 'react';
import { useApp } from '../context/AppContext';
import { GOVERNORATES, AREAS_BY_GOV } from '../data/initialData';
import { 
  Store, 
  MapPin, 
  Star, 
  Clock, 
  Truck, 
  Check, 
  ArrowLeft, 
  ShieldCheck,
  Search
} from 'lucide-react';

export const MerchantsView: React.FC = () => {
  const { 
    governorate, 
    area, 
    setLocation, 
    merchants, 
    selectedMerchantId, 
    setSelectedMerchantId,
    setRoute,
    showToast
  } = useApp();

  const [filterGov, setFilterGov] = React.useState(governorate);
  const [filterSearch, setFilterSearch] = React.useState('');

  const currentAreas = AREAS_BY_GOV[filterGov] || ['وسط المدينة'];

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGov = e.target.value;
    setFilterGov(newGov);
    const newArea = (AREAS_BY_GOV[newGov] || ['وسط المدينة'])[0];
    setLocation(newGov, newArea);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(filterGov, e.target.value);
  };

  const eligibleMerchants = merchants
    .filter(m => {
      const matchGov = m.governorate === filterGov || (filterGov === 'القاهرة' && m.governorate === 'الجيزة');
      const matchSearch = filterSearch.trim() === '' || 
        m.name.toLowerCase().includes(filterSearch.toLowerCase()) || 
        m.area.toLowerCase().includes(filterSearch.toLowerCase());
      return matchGov && matchSearch;
    })
    .sort((a, b) => b.rating - a.rating);

  const handleSelectMerchant = (merchantId: string, name: string) => {
    setSelectedMerchantId(merchantId);
    showToast(`تم اختيار ${name} كتاجر معتمد. تم تحديث التوفر ورسوم التوصيل.`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 pb-16">
      {/* Intro Header */}
      <div className="border-b border-[#E9E1DD] pb-6">
        <div className="flex items-center gap-2 text-xs text-[#766A6C] mb-2">
          <span>الرئيسية</span>
          <span>‹</span>
          <span className="text-[#6B3C45] font-bold">اختيار التاجر المعتمد</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#272124]">
              التجار المعتمدون في نطاق منطقتك
            </h1>
            <p className="text-xs text-[#766A6C] mt-1.5 max-w-xl leading-relaxed">
              أسعار كافة المنتجات موحدة ورسمية من TOP ONE. تختلف فقط رسوم التوصيل ووقت الوصول ومستويات المخزون المحلي لكل تاجر.
            </p>
          </div>
          <button
            onClick={() => setRoute('catalog')}
            className="px-5 py-2.5 bg-[#FAF5F1] hover:bg-[#F0E2DF] text-[#6B3C45] rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <span>متابعة التسوق</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Location Controls */}
      <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="merch-gov" className="block text-xs font-bold text-[#492832] mb-1.5">
              ١. المحافظة
            </label>
            <select
              id="merch-gov"
              value={filterGov}
              onChange={handleGovChange}
              className="w-full h-10.5 px-3.5 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none"
            >
              {GOVERNORATES.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="merch-area" className="block text-xs font-bold text-[#492832] mb-1.5">
              ٢. الحي / المركز
            </label>
            <select
              id="merch-area"
              value={area}
              onChange={handleAreaChange}
              className="w-full h-10.5 px-3.5 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none"
            >
              {currentAreas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="merch-search" className="block text-xs font-bold text-[#492832] mb-1.5">
              بحث عن فرع معين
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#9A8E90] absolute right-3 top-3.5" />
              <input
                id="merch-search"
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="اسم الفرع أو الحي..."
                className="w-full h-10.5 pr-9 pl-3.5 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Coverage statement */}
        <div className="p-3.5 rounded-xl bg-[#E9F2ED] text-[#42695A] text-xs flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#597B6D] shrink-0" />
          <span>
            يتم فحص مخزون التجار بصورة دورية لضمان وصول المنتجات طازجة ومحفوظة بمعايير التخزين المعتمدة من TOP ONE.
          </span>
        </div>
      </div>

      {/* Merchants Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#492832]">
            التجار المتاحون ({eligibleMerchants.length})
          </h2>
          <span className="text-[11px] text-[#766A6C]">مرتبة حسب التقييم ورسوم التوصيل</span>
        </div>

        {eligibleMerchants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {eligibleMerchants.map(merchant => {
              const isSelected = merchant.id === selectedMerchantId;

              return (
                <article
                  key={merchant.id}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
                    isSelected
                      ? 'border-[#6B3C45] shadow-md ring-2 ring-[#6B3C45]/10'
                      : 'border-[#E9E1DD] hover:border-[#C89191] hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#F0E2DF] text-[#6B3C45] flex items-center justify-center font-bold font-latin text-base shrink-0">
                        {merchant.shortName.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#272124] leading-snug">
                          {merchant.name}
                        </h3>
                        <span className="text-xs text-[#766A6C] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#6B3C45]" />
                          {merchant.area}، {merchant.governorate}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-xs font-bold text-[#B08C5A] font-latin shrink-0 bg-[#FFF8E7] px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{merchant.rating}</span>
                      <span className="text-[#9A8E90] text-[10px]">({merchant.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F0E9E6] text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-[#766A6C] block">المسافة</span>
                      <strong className="text-xs font-bold text-[#272124] font-latin">{merchant.distance}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#766A6C] block flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        التوصيل المتوقع
                      </span>
                      <strong className="text-xs font-bold text-[#272124]">{merchant.eta}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#766A6C] block flex items-center gap-1">
                        <Truck className="w-2.5 h-2.5" />
                        رسوم الشحن
                      </span>
                      <strong className="text-xs font-bold text-[#6B3C45] font-latin">
                        {merchant.fee} <span className="font-normal text-[10px]">ج.م</span>
                      </strong>
                    </div>
                  </div>

                  {/* Stock Note & Minimum */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] gap-2 mb-5">
                    <span className="text-[#597B6D] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#597B6D]"></span>
                      {merchant.stockNote}
                    </span>
                    <span className="text-[#766A6C]">
                      الحد الأدنى للطلب: <strong className="font-latin font-bold text-[#492832]">{merchant.minimumOrder} ج.م</strong>
                    </span>
                  </div>

                  {/* Selection Button */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    {isSelected ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E9F2ED] text-[#42695A] text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          التاجر المختار حالياً
                        </span>
                        <button
                          onClick={() => setRoute('catalog')}
                          className="px-4 py-2 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          تصفح منتجاته
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectMerchant(merchant.id, merchant.name)}
                        className="w-full py-2.5 px-4 bg-[#FAF5F1] hover:bg-[#6B3C45] hover:text-white text-[#492832] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>اختيار هذا التاجر للشحن</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#FAF5F1] rounded-2xl p-10 text-center border border-dashed border-[#D9C7C1]">
            <Store className="w-8 h-8 text-[#6B3C45] mx-auto mb-3 opacity-60" />
            <h3 className="text-sm font-bold text-[#272124] mb-1">
              لم نعثر على تجار مسجلين يطابقون هذا البحث
            </h3>
            <p className="text-xs text-[#766A6C] max-w-sm mx-auto mb-4">
              يمكنك تجربة محافظة أخرى كالقاهرة أو الجيزة للاطلاع على شبكة الموزعين المعتمدين فوراً.
            </p>
            <button
              onClick={() => { setFilterGov('القاهرة'); setLocation('القاهرة', 'مدينة نصر'); }}
              className="px-4 py-2 bg-[#6B3C45] text-white rounded-xl text-xs font-bold"
            >
              عرض تجار القاهرة
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

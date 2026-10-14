import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GOVERNORATES, AREAS_BY_GOV } from '../data/initialData';
import { MapPin, X, Check, Store } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    governorate, 
    area, 
    setLocation,
    merchants,
    selectedMerchantId,
    setSelectedMerchantId,
    showToast
  } = useApp();

  const [tempGov, setTempGov] = useState(governorate);
  const [tempArea, setTempArea] = useState(area);

  if (!isLocationModalOpen) return null;

  const currentAreas = AREAS_BY_GOV[tempGov] || ['وسط المدينة', 'المنطقة الرئيسية', 'المركز'];

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGov = e.target.value;
    setTempGov(newGov);
    const newAreas = AREAS_BY_GOV[newGov] || ['وسط المدينة'];
    setTempArea(newAreas[0]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(tempGov, tempArea);
    setIsLocationModalOpen(false);
    showToast(`تم تحديث منطقة التوصيل إلى: ${tempGov} — ${tempArea}`);
  };

  const eligibleMerchants = merchants.filter(m => m.governorate === tempGov);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24181B]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#FFFDFB] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E9E1DD] relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => setIsLocationModalOpen(false)}
          className="absolute top-5 left-5 p-2 rounded-xl bg-[#F8F2EE] text-[#766A6C] hover:text-[#272124] hover:bg-[#E9E1DD] transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-[#6B3C45] mb-1">
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">تحديد نطاق التوصيل المعتمد</span>
        </div>
        <h2 className="text-xl font-bold text-[#272124] mb-2">أين ترغبين في استلام طلبك؟</h2>
        <p className="text-xs text-[#766A6C] leading-relaxed mb-6">
          نعرض لكِ التجار المعتمدين الأقرب لمنطقتك مع رسوم الشحن ووقت التوصيل التقديري. الأسعار موحدة دائماً.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gov-select" className="block text-xs font-bold text-[#492832] mb-1.5">
                المحافظة
              </label>
              <select
                id="gov-select"
                value={tempGov}
                onChange={handleGovChange}
                className="w-full h-11 px-3.5 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none"
              >
                {GOVERNORATES.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="area-select" className="block text-xs font-bold text-[#492832] mb-1.5">
                الحي / المنطقة
              </label>
              <select
                id="area-select"
                value={tempArea}
                onChange={(e) => setTempArea(e.target.value)}
                className="w-full h-11 px-3.5 text-xs bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl focus:border-[#C89191] focus:bg-white focus:outline-none"
              >
                {currentAreas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Merchant Preview for chosen Governorate */}
          <div className="pt-3 border-t border-[#E9E1DD]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-[#492832] flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-[#6B3C45]" />
                التجار المتاحون في {tempGov}:
              </span>
              <span className="text-[11px] text-[#766A6C]">
                {eligibleMerchants.length} تاجر معتمد
              </span>
            </div>

            {eligibleMerchants.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pl-1">
                {eligibleMerchants.map(m => {
                  const isSelected = m.id === selectedMerchantId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMerchantId(m.id)}
                      className={`w-full text-right p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        isSelected 
                          ? 'bg-[#F0E2DF] border-[#6B3C45] shadow-xs' 
                          : 'bg-white border-[#E9E1DD] hover:bg-[#FAF5F1]'
                      }`}
                    >
                      <div>
                        <strong className="block text-[#272124] font-bold">{m.name}</strong>
                        <span className="text-[11px] text-[#766A6C]">
                          {m.area} · توصيل خلال {m.eta} · رسوم: {m.fee} ج.م
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-latin text-xs font-bold text-[#B08C5A]">★ {m.rating}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#6B3C45] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#FAF5F1] text-center text-xs text-[#766A6C]">
                يتم التوصيل إلى {tempGov} عبر أقرب نقطة شحن وتوزيع معتمدة.
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              تأكيد المنطقة ومتابعة التسوق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

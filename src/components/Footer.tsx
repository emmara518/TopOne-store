import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, CheckCircle2, ShieldCheck, PhoneCall, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setRoute, setActiveCategory, setDealsOnly, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast('شكراً لاشتراكك في النشرة البريدية لـ TOP ONE.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#332529] text-[#F6EEEB] pt-14 pb-8 border-t border-[#492832]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#492832] flex items-center justify-center font-latin font-bold text-xl">
                T<span className="text-[#BB8688]">O</span>
              </div>
              <div>
                <span className="font-latin font-bold text-lg tracking-wider text-white block">
                  TOP ONE
                </span>
                <span className="text-[9px] tracking-widest text-[#B7A4A8] uppercase font-semibold">
                  Beauty Distribution Platform
                </span>
              </div>
            </div>

            <p className="text-xs text-[#C9B8BB] leading-relaxed max-w-sm">
              المنصة المتكاملة الأولى في مصر لتوزيع مستحضرات التجميل الأصلية بالجملة والتجزئة. نربط العملاء بأقرب التجار المعتمدين بأسعار موحدة وشحن محلي موثوق.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#E1B8A6] pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#89B8A2]" />
                منتجات أصلية 100%
              </span>
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#E1B8A6]" />
                دعم التجار والعملاء
              </span>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">التسوق والكتالوج</h4>
            <ul className="space-y-2 text-xs text-[#C9B8BB]">
              <li>
                <button 
                  onClick={() => { setActiveCategory('الكل'); setDealsOnly(false); setRoute('catalog'); }}
                  className="hover:text-white transition-colors"
                >
                  جميع المنتجات
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveCategory('العناية بالبشرة'); setDealsOnly(false); setRoute('catalog'); }}
                  className="hover:text-white transition-colors"
                >
                  العناية بالبشرة
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveCategory('المكياج'); setDealsOnly(false); setRoute('catalog'); }}
                  className="hover:text-white transition-colors"
                >
                  المكياج ومستحضرات التجميل
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveCategory('العطور'); setDealsOnly(false); setRoute('catalog'); }}
                  className="hover:text-white transition-colors"
                >
                  العطور الفاخرة
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveCategory('الكل'); setDealsOnly(true); setRoute('catalog'); }}
                  className="hover:text-white text-[#E1B8A6] font-semibold transition-colors"
                >
                  العروض والخصومات
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">الخدمات والبوابات</h4>
            <ul className="space-y-2 text-xs text-[#C9B8BB]">
              <li>
                <button onClick={() => setRoute('merchants')} className="hover:text-white transition-colors">
                  شبكة التجار المعتمدين
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('order')} className="hover:text-white transition-colors">
                  تتبّع حالة الطلب
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('merchant-portal')} className="hover:text-white transition-colors">
                  بوابة الشركاء والتجار (B2B)
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('company-portal')} className="hover:text-white transition-colors">
                  لوحة إدارة المنصة (Admin)
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('cart')} className="hover:text-white transition-colors">
                  طرق الشحن والدفع
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">النشرة البريدية</h4>
            <p className="text-xs text-[#C9B8BB] leading-relaxed">
              اشتركي لتصلكِ أحدث تشكيلات التجميل وعروض التوريد الحصرية.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني..."
                  required
                  className="w-full h-10 pr-3.5 pl-9 text-xs bg-[#423337] border border-[#5F4C50] rounded-xl text-white placeholder:text-[#9A8E90] focus:outline-none focus:border-[#E1B8A6]"
                />
                <button
                  type="submit"
                  className="absolute left-2 top-2 p-1 text-[#E1B8A6] hover:text-white transition-colors"
                  aria-label="اشتراك"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </div>

              {subscribed && (
                <span className="text-[11px] text-[#89B8A2] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تم تسجيل بريدك بنجاح!
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#BDAEB1]">
          <span>
            © {new Date().getFullYear()} TOP ONE Beauty Distribution. جميع الحقوق محفوظة.
          </span>
          <div className="flex items-center gap-4">
            <span>الأسعار موحدة في كافة المحافظات المصرية</span>
            <span className="text-white/20">|</span>
            <span>الدفع عند الاستلام أو عبر إنستاباي ومحافظ الهاتف</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

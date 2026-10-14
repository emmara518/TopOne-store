import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GOVERNORATES, AREAS_BY_GOV } from '../data/initialData';
import { 
  Building2, 
  Store, 
  Layers, 
  CreditCard, 
  Plus, 
  Check, 
  X, 
  Eye, 
  Save, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export const CompanyPortalView: React.FC = () => {
  const { 
    merchants, 
    addMerchant, 
    products, 
    getMainStock, 
    updateMainStock, 
    paymentRecords, 
    updatePaymentStatus, 
    allOrders, 
    setSelectedMerchantId, 
    setRoute, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'merchants' | 'inventory' | 'transfers'>('overview');
  const [mainStockInputs, setMainStockInputs] = useState<Record<string, number>>({});
  const [isAddMerchantOpen, setIsAddMerchantOpen] = useState(false);
  const [inspectReceipt, setInspectReceipt] = useState<string | null>(null);

  // New merchant form state
  const [newMName, setNewMName] = useState('');
  const [newMGov, setNewMGov] = useState('القاهرة');
  const [newMArea, setNewMArea] = useState('التجمع الخامس');
  const [newMFee, setNewMFee] = useState(35);
  const [newMMin, setNewMMin] = useState(450);

  const tabs = [
    { id: 'overview', label: 'نظرة عامة والمنصة', icon: Layers },
    { id: 'merchants', label: 'شبكة التجار المعتمدين', icon: Store },
    { id: 'inventory', label: 'المخزون الرئيسي للشركة', icon: Building2 },
    { id: 'transfers', label: 'مراجعة التحويلات والإيصالات', icon: CreditCard }
  ] as const;

  const handleStockChange = (productId: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setMainStockInputs(prev => ({ ...prev, [productId]: num }));
  };

  const handleSaveMainStock = () => {
    Object.entries(mainStockInputs).forEach(([prodId, qty]) => {
      updateMainStock(prodId, qty);
    });
    showToast('تم تحديث المخزون الرئيسي للشركة بنجاح.');
    setMainStockInputs({});
  };

  const handleAddMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMName.trim()) return;

    addMerchant({
      name: newMName.trim(),
      shortName: newMName.trim().slice(0, 16),
      governorate: newMGov,
      area: newMArea,
      fee: newMFee,
      minimumOrder: newMMin
    });

    setNewMName('');
    setIsAddMerchantOpen(false);
  };

  const pendingPayments = paymentRecords.filter(p => p.status === 'قيد المراجعة');

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-20">
      {/* Admin Header Banner */}
      <div className="bg-[#272124] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center font-latin font-bold text-lg text-[#E1B8A6]">
            TO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#E1B8A6] font-bold uppercase tracking-wider">TOP ONE · COMPANY ADMIN</span>
              <span className="text-[10px] bg-[#E9F2ED] text-[#42695A] px-2 py-0.2 rounded font-bold">صلاحية الإدارة المركزية</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold">لوحة التحكم المركزية للمنصة</h1>
            <span className="text-xs text-[#9A8E90]">
              إدارة شبكة الموزعين، المستودع الرئيسي، واعتماد التحويلات اليدوية.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setRoute('merchant-portal')}
            className="px-3.5 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            بوابة التاجر (B2B)
          </button>
          <button
            onClick={() => setRoute('catalog')}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#6B3C45] hover:bg-[#B84E58] text-white rounded-xl transition-colors"
          >
            المتجر العام
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E9E1DD] scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-[#272124] text-white shadow-xs' 
                  : 'text-[#766A6C] hover:bg-[#FAF5F1] hover:text-[#272124]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.id === 'transfers' && pendingPayments.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#B84E58] text-white font-latin text-[10px] flex items-center justify-center font-bold">
                  {pendingPayments.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5">
              <span className="text-[11px] text-[#766A6C] block mb-1">إجمالي التجار المعتمدين</span>
              <strong className="font-latin text-2xl font-bold text-[#272124] block">{merchants.length}</strong>
              <span className="text-[10px] text-[#597B6D] font-semibold">تغطية تشمل 8 محافظات</span>
            </div>

            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5">
              <span className="text-[11px] text-[#766A6C] block mb-1">طلبات المنصة المسجلة</span>
              <strong className="font-latin text-2xl font-bold text-[#492832] block">{allOrders.length}</strong>
              <span className="text-[10px] text-[#766A6C]">عبر كافة الفروع</span>
            </div>

            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5">
              <span className="text-[11px] text-[#766A6C] block mb-1">إيصالات بانتظار المراجعة</span>
              <strong className="font-latin text-2xl font-bold text-[#B84E58] block">{pendingPayments.length}</strong>
              <button 
                onClick={() => setActiveTab('transfers')}
                className="text-[10px] text-[#6B3C45] font-bold hover:underline mt-1 block"
              >
                مراجعة التحويلات الآن ←
              </button>
            </div>

            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5">
              <span className="text-[11px] text-[#766A6C] block mb-1">الأصناف بالكتالوج المركزي</span>
              <strong className="font-latin text-2xl font-bold text-[#B08C5A] block">{products.length}</strong>
              <span className="text-[10px] text-[#766A6C]">منتجات أصلية معتمدة</span>
            </div>
          </div>

          {/* Quick Review Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-[#E9E1DD] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E1DD]">
                <h3 className="text-xs font-bold text-[#272124]">تحويلات إنستاباي ومحافظ قيد التدقيق</h3>
                <button onClick={() => setActiveTab('transfers')} className="text-xs text-[#6B3C45] font-bold hover:underline">
                  عرض الكل
                </button>
              </div>

              {pendingPayments.length > 0 ? (
                <div className="divide-y divide-[#F1E9E6]">
                  {pendingPayments.slice(0, 3).map(pay => (
                    <div key={pay.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="font-latin font-bold text-[#272124]">{pay.id} · {pay.customerName}</strong>
                        <span className="text-[11px] text-[#766A6C] block">
                          التاجر: {pay.merchantName} · المبلغ: {pay.amount} ج.م · {pay.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updatePaymentStatus(pay.id, 'معتمد')}
                          className="px-2.5 py-1 bg-[#E9F2ED] text-[#42695A] hover:bg-[#597B6D] hover:text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          اعتماد
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(pay.id, 'مرفوض')}
                          className="px-2.5 py-1 bg-[#FBE9EB] text-[#B84E58] hover:bg-[#B84E58] hover:text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#766A6C]">
                  تمت مراجعة واعتماد كافة الإيصالات.
                </div>
              )}
            </div>

            <div className="lg:col-span-5 bg-white border border-[#E9E1DD] rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="text-xs font-bold text-[#272124] pb-3 border-b border-[#E9E1DD]">
                سياسة عزل البيانات والصلاحيات
              </h3>
              <p className="text-[#766A6C] leading-relaxed">
                في منصة TOP ONE، تتم حماية بيانات كل تاجر بصورة معزولة: كل فرع يرى فقط طلباته المحلية ومخزونه، بينما تمتلك إدارة الشركة صلاحية الإشراف والتوريد واعتماد التحويلات البنكية.
              </p>
              <div className="p-3 bg-[#FAF5F1] rounded-xl border border-[#E9E1DD] space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#766A6C]">فروع نشطة:</span>
                  <strong className="font-bold text-[#272124]">{merchants.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766A6C]">سياسة الأسعار:</span>
                  <strong className="font-bold text-[#597B6D]">موحدة رسمياً بنسبة 100%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Merchants Network */}
      {activeTab === 'merchants' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E1DD]">
            <div>
              <h2 className="text-base font-bold text-[#272124]">شبكة الموزعين والتجار المعتمدين</h2>
              <p className="text-xs text-[#766A6C] mt-0.5">
                قائمة الفروع المرخصة لتوزيع منتجات TOP ONE في المحافظات.
              </p>
            </div>
            <button
              onClick={() => setIsAddMerchantOpen(true)}
              className="px-4 py-2 bg-[#272124] hover:bg-[#492832] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تاجر معتمد</span>
            </button>
          </div>

          {/* Add Merchant Modal Form */}
          {isAddMerchantOpen && (
            <form onSubmit={handleAddMerchantSubmit} className="p-5 bg-[#FAF5F1] rounded-2xl border border-[#E9E1DD] space-y-4">
              <h3 className="text-xs font-bold text-[#492832]">تسجيل تاجر جديد في الشبكة:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-[#766A6C] mb-1">اسم الفرع / التاجر</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: لوتس بيوتي سنتر"
                    value={newMName}
                    onChange={(e) => setNewMName(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-[#E9E1DD] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#766A6C] mb-1">المحافظة</label>
                  <select
                    value={newMGov}
                    onChange={(e) => {
                      setNewMGov(e.target.value);
                      setNewMArea((AREAS_BY_GOV[e.target.value] || ['وسط المدينة'])[0]);
                    }}
                    className="w-full h-9 px-3 bg-white border border-[#E9E1DD] rounded-xl text-xs"
                  >
                    {GOVERNORATES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#766A6C] mb-1">الحي / النطاق</label>
                  <select
                    value={newMArea}
                    onChange={(e) => setNewMArea(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-[#E9E1DD] rounded-xl text-xs"
                  >
                    {(AREAS_BY_GOV[newMGov] || ['وسط المدينة']).map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#766A6C] mb-1">رسوم الشحن (ج.م)</label>
                  <input
                    type="number"
                    value={newMFee}
                    onChange={(e) => setNewMFee(parseInt(e.target.value) || 25)}
                    className="w-full h-9 px-3 bg-white border border-[#E9E1DD] rounded-xl text-xs font-latin"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-5 py-2 bg-[#6B3C45] text-white rounded-xl text-xs font-bold">
                  اعتماد التاجر
                </button>
                <button type="button" onClick={() => setIsAddMerchantOpen(false)} className="px-4 py-2 bg-[#E9E1DD] text-[#766A6C] rounded-xl text-xs font-bold">
                  إلغاء
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF5F1] text-[#766A6C] border-b border-[#E9E1DD]">
                <tr>
                  <th className="p-3">اسم التاجر</th>
                  <th className="p-3">المحافظة والمنطقة</th>
                  <th className="p-3">التقييم</th>
                  <th className="p-3">الحد الأدنى للطلب</th>
                  <th className="p-3">رسوم التوصيل</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E9E6]">
                {merchants.map(m => (
                  <tr key={m.id} className="hover:bg-[#FFFDFB]">
                    <td className="p-3">
                      <strong className="block text-[#272124]">{m.name}</strong>
                      <span className="text-[10px] text-[#766A6C] font-latin">{m.id}</span>
                    </td>
                    <td className="p-3 text-[#766A6C]">{m.area}، {m.governorate}</td>
                    <td className="p-3 font-latin font-bold text-[#B08C5A]">★ {m.rating}</td>
                    <td className="p-3 font-latin font-bold text-[#492832]">{m.minimumOrder} ج.م</td>
                    <td className="p-3 font-latin text-[#766A6C]">{m.fee} ج.م</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E9F2ED] text-[#42695A]">
                        معتمد
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedMerchantId(m.id);
                          setRoute('merchant-portal');
                          showToast(`تم فتح لوحة فرع: ${m.shortName}`);
                        }}
                        className="text-xs font-bold text-[#6B3C45] hover:underline flex items-center gap-1 mx-auto"
                      >
                        <span>فتح لوحة الفرع</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Main Company Warehouse */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E1DD]">
            <div>
              <h2 className="text-base font-bold text-[#272124]">
                المستودع المركزي لشركة TOP ONE
              </h2>
              <p className="text-xs text-[#766A6C] mt-0.5">
                هذا المخزون مخصص لإمداد وتزويد شبكة التجار بالفروع، ومنفصل عن المخازن المحلية.
              </p>
            </div>
            <button
              onClick={handleSaveMainStock}
              className="px-5 py-2.5 bg-[#272124] hover:bg-[#492832] text-white rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>حفظ المخزون المركزي</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF5F1] text-[#766A6C] border-b border-[#E9E1DD]">
                <tr>
                  <th className="p-3">المنتج</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">سعر الجملة والتجزئة الموحد</th>
                  <th className="p-3">المخزون المركزي الحالي</th>
                  <th className="p-3">تعديل المخزون المركزي</th>
                  <th className="p-3">الحالة العامة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E9E6]">
                {products.map(p => {
                  const companyStock = getMainStock(p.id);
                  const inputValue = mainStockInputs[p.id] !== undefined ? mainStockInputs[p.id] : companyStock;

                  return (
                    <tr key={p.id} className="hover:bg-[#FFFDFB]">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <strong className="block text-[#272124]">{p.name}</strong>
                          <span className="text-[10px] text-[#766A6C]">{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-3 font-latin text-[#766A6C]">{p.sku}</td>
                      <td className="p-3 font-latin font-bold text-[#492832]">{p.price} ج.م</td>
                      <td className="p-3 font-latin font-bold text-[#597B6D]">{companyStock} قطعة</td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          value={inputValue}
                          onChange={(e) => handleStockChange(p.id, e.target.value)}
                          className="w-20 h-8 px-2 text-center text-xs font-latin border border-[#E9E1DD] rounded-lg bg-[#FAF5F1] focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E9F2ED] text-[#42695A]">
                          متوفر للتوريد
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Transfers Review */}
      {activeTab === 'transfers' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="pb-4 border-b border-[#E9E1DD]">
            <h2 className="text-base font-bold text-[#272124]">مراجعة وتدقيق التحويلات اليدوية</h2>
            <p className="text-xs text-[#766A6C] mt-0.5">
              مطابقة إيصالات العملاء مع حساب إنستاباي ومحفظة فودافون كاش قبل تغيير حالة الطلب إلى «تم تأكيد الدفع».
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF5F1] text-[#766A6C] border-b border-[#E9E1DD]">
                <tr>
                  <th className="p-3">رقم التحويل</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3">التاجر المنفذ</th>
                  <th className="p-3">المبلغ</th>
                  <th className="p-3">طريقة التحويل</th>
                  <th className="p-3">الحالة الحالية</th>
                  <th className="p-3 text-center">الإيصال والقرار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E9E6]">
                {paymentRecords.map(record => (
                  <tr key={record.id} className="hover:bg-[#FFFDFB]">
                    <td className="p-3 font-latin font-bold text-[#492832]">{record.id}</td>
                    <td className="p-3 font-semibold text-[#272124]">{record.customerName}</td>
                    <td className="p-3 text-[#766A6C]">{record.merchantName}</td>
                    <td className="p-3 font-latin font-bold text-[#272124]">{record.amount} ج.م</td>
                    <td className="p-3 text-[#766A6C]">{record.method}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        record.status === 'معتمد' 
                          ? 'bg-[#E9F2ED] text-[#42695A]' 
                          : record.status === 'مرفوض' 
                          ? 'bg-[#FBE9EB] text-[#B84E58]' 
                          : 'bg-[#FFF3D8] text-[#8A6428]'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setInspectReceipt(record.receiptName || 'receipt_view.jpg')}
                          className="px-2.5 py-1 text-[11px] font-bold bg-[#FAF5F1] hover:bg-[#F0E2DF] text-[#492832] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>معاينة</span>
                        </button>
                        {record.status === 'قيد المراجعة' && (
                          <>
                            <button
                              onClick={() => updatePaymentStatus(record.id, 'معتمد')}
                              className="px-2.5 py-1 text-[11px] font-bold bg-[#E9F2ED] hover:bg-[#597B6D] hover:text-white text-[#42695A] rounded-lg transition-colors"
                            >
                              اعتماد
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(record.id, 'مرفوض')}
                              className="px-2.5 py-1 text-[11px] font-bold bg-[#FBE9EB] hover:bg-[#B84E58] hover:text-white text-[#B84E58] rounded-lg transition-colors"
                            >
                              رفض
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receipt Inspector Modal */}
      {inspectReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24181B]/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E9E1DD] shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setInspectReceipt(null)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-[#FAF5F1] text-[#766A6C]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#272124]">معاينة إيصال التحويل البنكي</h3>
            <p className="text-xs text-[#766A6C]">
              الملف المرفق: <strong className="font-latin text-[#492832]">{inspectReceipt}</strong>
            </p>

            <div className="p-8 bg-[#FAF5F1] rounded-2xl border border-dashed border-[#D9C7C1] space-y-2">
              <ShieldCheck className="w-10 h-10 text-[#597B6D] mx-auto" />
              <strong className="block text-xs font-bold text-[#272124]">تم التحقق من نوع الملف والتشفير</strong>
              <span className="text-[11px] text-[#766A6C] block">
                تأكدي من مطابقة رقم العملية وتاريخ التحويل مع رسائل الحساب قبل الاعتماد.
              </span>
            </div>

            <button
              onClick={() => setInspectReceipt(null)}
              className="w-full py-2.5 bg-[#6B3C45] text-white rounded-xl text-xs font-bold"
            >
              إغلاق المعاينة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

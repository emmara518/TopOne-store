import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Package, 
  ShoppingBag, 
  Layers, 
  FileText, 
  Users, 
  Settings, 
  Check, 
  X, 
  Download, 
  Plus, 
  Store, 
  ArrowUpRight, 
  ShieldCheck,
  Save
} from 'lucide-react';

export const MerchantPortalView: React.FC = () => {
  const { 
    selectedMerchant, 
    merchants, 
    setSelectedMerchantId, 
    products, 
    getProductStockAtMerchant, 
    getMainStock, 
    updateMerchantStock, 
    getMerchantMinimum, 
    updateMerchantMinimum, 
    restockRequests, 
    createRestockRequest, 
    teamMembers, 
    addTeamMember, 
    allOrders, 
    setRoute, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'wholesale' | 'orders' | 'inventory' | 'account' | 'team' | 'settings'>('overview');
  const [minOrderInput, setMinOrderInput] = useState(getMerchantMinimum(selectedMerchant.id).toString());
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('مسؤول تجهيز');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [restockQtyInput, setRestockQtyInput] = useState<Record<string, number>>({});

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Layers },
    { id: 'wholesale', label: 'كتالوج التوريد (B2B)', icon: Package },
    { id: 'orders', label: 'الطلبات الواردة', icon: ShoppingBag },
    { id: 'inventory', label: 'مخزون الفرع', icon: Layers },
    { id: 'account', label: 'كشف الحساب', icon: FileText },
    { id: 'team', label: 'فريق العمل', icon: Users },
    { id: 'settings', label: 'إعدادات الفرع', icon: Settings }
  ] as const;

  // Filter orders related to this merchant
  const merchantOrders = allOrders.filter(o => o.merchantId === selectedMerchant.id);

  const handleStockChange = (productId: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setStockInputs(prev => ({ ...prev, [productId]: num }));
  };

  const saveInventoryChanges = () => {
    Object.entries(stockInputs).forEach(([prodId, qty]) => {
      updateMerchantStock(selectedMerchant.id, prodId, qty);
    });
    showToast('تم حفظ تحديثات مخزون الفرع بنجاح.');
    setStockInputs({});
  };

  const handleSaveMinOrder = () => {
    const val = Math.max(0, parseInt(minOrderInput) || 0);
    updateMerchantMinimum(selectedMerchant.id, val);
    showToast(`تم تحديث الحد الأدنى للطلب إلى ${val} ج.م.`);
  };

  const handleSendRestock = (productId: string) => {
    const qty = restockQtyInput[productId] || 10;
    createRestockRequest(productId, qty);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,\ufeff" + 
      "التاريخ,المرجع,البيان,القيمة,الحالة\n" +
      "14 أكتوبر 2026,TX-1048,مبيعات طلبات تجزئة,8400 ج.م,مكتمل\n" +
      "13 أكتوبر 2026,TR-017,تسوية تحويل يدوي,2400 ج.م,قيد المراجعة\n" +
      "12 أكتوبر 2026,ADJ-005,تسوية مخزون دوري,0 ج.م,معتمد\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `topone_${selectedMerchant.shortName}_statement.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('تم تصدير كشف الحساب بصيغة CSV.');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      addTeamMember(newMemberName.trim(), newMemberRole);
      setNewMemberName('');
      setIsAddMemberOpen(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-20">
      {/* Top Banner / Switch Merchant context for testing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#492832] text-white p-5 rounded-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center font-latin font-bold text-lg text-[#E1B8A6]">
            {selectedMerchant.shortName.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#E1B8A6] font-bold uppercase tracking-wider">بوابة الشركاء والتجار (B2B)</span>
              <span className="text-[10px] bg-[#E9F2ED] text-[#42695A] px-2 py-0.2 rounded font-bold">فرع معتمد</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold">{selectedMerchant.name}</h1>
            <span className="text-xs text-[#F0E2DF]/80">
              نطاق التغطية: {selectedMerchant.area}، {selectedMerchant.governorate} · الحد الأدنى: {getMerchantMinimum(selectedMerchant.id)} ج.م
            </span>
          </div>
        </div>

        {/* Branch Context Switcher for simulation */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#E1B8A6] font-semibold hidden md:inline">تبديل الفرع:</span>
          <select
            value={selectedMerchant.id}
            onChange={(e) => setSelectedMerchantId(e.target.value)}
            className="h-9 px-3 text-xs bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none"
          >
            {merchants.map(m => (
              <option key={m.id} value={m.id} className="text-[#272124]">{m.shortName} ({m.area})</option>
            ))}
          </select>
          <button
            onClick={() => setRoute('company-portal')}
            className="px-3 py-1.5 text-xs font-bold bg-[#E1B8A6] text-[#492832] rounded-xl hover:bg-white transition-colors"
          >
            لوحة الشركة ↗
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
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
                  ? 'bg-[#6B3C45] text-white shadow-xs' 
                  : 'text-[#766A6C] hover:bg-[#FAF5F1] hover:text-[#492832]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5">
              <span className="text-[11px] text-[#766A6C] block mb-1">طلبات اليوم الواردة</span>
              <strong className="font-latin text-2xl font-bold text-[#272124] block">14</strong>
              <span className="text-[10px] text-[#597B6D] flex items-center gap-1 mt-1 font-semibold">
                <ArrowUpRight className="w-3 h-3" />
                +3 عن الأمس (معدل ممتاز)
              </span>
            </div>

            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5">
              <span className="text-[11px] text-[#766A6C] block mb-1">إجمالي مبيعات الشهر</span>
              <strong className="font-latin text-2xl font-bold text-[#492832] block">28,450</strong>
              <span className="text-[10px] text-[#766A6C]">جنيه مصري عبر المنصة</span>
            </div>

            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5">
              <span className="text-[11px] text-[#766A6C] block mb-1">منتجات منخفضة المخزون</span>
              <strong className="font-latin text-2xl font-bold text-[#B08C5A] block">3</strong>
              <button 
                onClick={() => setActiveTab('wholesale')}
                className="text-[10px] text-[#6B3C45] font-bold hover:underline mt-1 block"
              >
                طلب توريد من المستودع ←
              </button>
            </div>

            <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5">
              <span className="text-[11px] text-[#766A6C] block mb-1">تقييم الفرع وموثوقيته</span>
              <strong className="font-latin text-2xl font-bold text-[#B08C5A] block">
                ★ {selectedMerchant.rating}
              </strong>
              <span className="text-[10px] text-[#766A6C]">من 5 نجوم ({selectedMerchant.reviewsCount} عميل)</span>
            </div>
          </div>

          {/* Quick Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-7 bg-white border border-[#E9E1DD] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E1DD]">
                <h3 className="text-xs font-bold text-[#272124]">أحدث الطلبات الخاصة بفرعك</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#6B3C45] font-bold hover:underline"
                >
                  عرض كافة الطلبات ({merchantOrders.length})
                </button>
              </div>

              {merchantOrders.length > 0 ? (
                <div className="divide-y divide-[#F1E9E6]">
                  {merchantOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="font-latin font-bold text-[#272124]">طلب #{order.id}</strong>
                        <span className="text-[11px] text-[#766A6C] block">
                          {order.customerName} · {order.items.length} أصناف · {order.createdAt}
                        </span>
                      </div>
                      <div className="text-left">
                        <strong className="font-latin font-bold text-[#492832] block">{order.total} ج.م</strong>
                        <span className="text-[10px] bg-[#E9F2ED] text-[#42695A] px-2 py-0.5 rounded font-bold">
                          {order.paymentMethod === 'cod' ? 'عند الاستلام' : 'تحويل يدوي'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-[#766A6C]">
                  لا توجد طلبات واردة جديدة حالياً.
                </div>
              )}
            </div>

            {/* Quick Settings & Branch Info */}
            <div className="lg:col-span-5 bg-white border border-[#E9E1DD] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-[#272124] pb-3 border-b border-[#E9E1DD]">
                إعدادات تشغيل الفرع
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] text-[#766A6C] mb-1">
                    الحد الأدنى لطلب العميل (ج.م):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minOrderInput}
                      onChange={(e) => setMinOrderInput(e.target.value)}
                      className="w-full h-9 px-3 bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl text-xs font-latin"
                    />
                    <button
                      onClick={handleSaveMinOrder}
                      className="px-3.5 py-1.5 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold shrink-0"
                    >
                      حفظ
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1E9E6] flex justify-between items-center text-xs">
                  <span className="text-[#766A6C]">حالة استقبال الطلبات:</span>
                  <span className="text-[#597B6D] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#597B6D]"></span>
                    نشط ويستقبل طلبات
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#766A6C]">رسوم التوصيل المحلية:</span>
                  <strong className="font-latin text-[#272124]">{selectedMerchant.fee} ج.م</strong>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#766A6C]">المنطقة المخصصة:</span>
                  <strong className="text-[#272124]">{selectedMerchant.area}، {selectedMerchant.governorate}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Wholesale Restock */}
      {activeTab === 'wholesale' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E1DD]">
            <div>
              <h2 className="text-base font-bold text-[#272124]">
                كتالوج التوريد من المستودع الرئيسي للشركة
              </h2>
              <p className="text-xs text-[#766A6C] mt-1">
                اطلبي إعادة تزويد فرعك بالكميات المطلوبة مباشرة من مستودع TOP ONE المركزي بالأسعار الرسمية.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#E9F2ED] text-[#42695A] self-start sm:self-auto">
              سياسة السعر الموحد معتمدة
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF5F1] text-[#766A6C] border-b border-[#E9E1DD]">
                <tr>
                  <th className="p-3">المنتج</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">سعر الوحدة</th>
                  <th className="p-3">مخزون الشركة المتاح</th>
                  <th className="p-3">مخزون فرعك الحالي</th>
                  <th className="p-3 text-center">طلب توريد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E9E6]">
                {products.map(p => {
                  const companyStock = getMainStock(p.id);
                  const branchStock = getProductStockAtMerchant(p.id, selectedMerchant.id);
                  const reqQty = restockQtyInput[p.id] || 10;

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
                      <td className="p-3 font-latin text-[#766A6C]">{branchStock} قطعة</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={companyStock}
                            value={reqQty}
                            onChange={(e) => setRestockQtyInput({ ...restockQtyInput, [p.id]: parseInt(e.target.value) || 1 })}
                            className="w-16 h-8 text-center text-xs font-latin border border-[#E9E1DD] rounded-lg bg-[#FAF5F1]"
                          />
                          <button
                            onClick={() => handleSendRestock(p.id)}
                            className="px-3 py-1.5 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            طلب توريد
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Restock History */}
          <div className="pt-6 border-t border-[#E9E1DD]">
            <h3 className="text-xs font-bold text-[#492832] mb-3">سجل طلبات التوريد الأخيرة</h3>
            {restockRequests.length > 0 ? (
              <div className="space-y-2">
                {restockRequests.map(req => (
                  <div key={req.id} className="p-3 rounded-xl bg-[#FAF5F1] border border-[#E9E1DD] flex items-center justify-between text-xs">
                    <div>
                      <strong className="font-latin text-[#492832]">#{req.id} · {req.productName}</strong>
                      <span className="text-[11px] text-[#766A6C] block">
                        الكمية: {req.quantity} قطعة · التاريخ: {req.date}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FFF3D8] text-[#8A6428] border border-[#EFDFB6]">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-[#766A6C]">لم يتم تقديم طلبات توريد بعد.</span>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E1DD]">
            <div>
              <h2 className="text-base font-bold text-[#272124]">طلبات الفرع الواردة</h2>
              <p className="text-xs text-[#766A6C] mt-0.5">
                تظهر هنا كافة الطلبات المحولة لمخزون فرعك للتنفيذ والتوصيل.
              </p>
            </div>
            <span className="text-xs font-bold text-[#6B3C45]">
              إجمالي: {merchantOrders.length} طلب
            </span>
          </div>

          {merchantOrders.length > 0 ? (
            <div className="space-y-4">
              {merchantOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-[#E9E1DD] bg-[#FFFDFB] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="font-latin text-sm font-bold text-[#272124]">طلب #{order.id}</strong>
                      <span className="text-xs text-[#766A6C] mr-2">{order.createdAt}</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#E9F2ED] text-[#42695A]">
                      {order.isCancelled ? 'ملغي' : 'مقبول وقيد التجهيز'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#766A6C] pt-2 border-t border-[#F1E9E6]">
                    <div>العميل: <strong className="text-[#272124]">{order.customerName}</strong></div>
                    <div>الهاتف: <strong className="font-latin text-[#272124]">{order.phone}</strong></div>
                    <div>العنوان: <strong className="text-[#272124]">{order.address}</strong></div>
                    <div>الإجمالي: <strong className="font-latin font-bold text-[#6B3C45]">{order.total} ج.م</strong></div>
                  </div>

                  <div className="text-xs text-[#766A6C] pt-2 border-t border-[#F1E9E6]">
                    <span>الأصناف: </span>
                    {order.items.map((i, idx) => (
                      <span key={idx} className="font-semibold text-[#272124] mr-1">
                        {i.product.name} ({i.quantity})
                        {idx < order.items.length - 1 ? '، ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#766A6C]">
              لا توجد طلبات واردة حالياً لهذا الفرع.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E1DD]">
            <div>
              <h2 className="text-base font-bold text-[#272124]">
                إدارة المخزون المحلي لفرع ({selectedMerchant.shortName})
              </h2>
              <p className="text-xs text-[#766A6C] mt-1">
                تعديل الكميات هنا ينعكس فوراً على المتجر الخاص بمنطقتك، ومعزول تماماً عن بقية الفروع.
              </p>
            </div>
            <button
              onClick={saveInventoryChanges}
              className="px-5 py-2.5 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>حفظ تعديلات المخزون</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF5F1] text-[#766A6C] border-b border-[#E9E1DD]">
                <tr>
                  <th className="p-3">المنتج</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">سعر التجزئة</th>
                  <th className="p-3">الكمية الحالية</th>
                  <th className="p-3">تعديل الكمية</th>
                  <th className="p-3">حالة الصنف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E9E6]">
                {products.map(p => {
                  const currentStock = getProductStockAtMerchant(p.id, selectedMerchant.id);
                  const inputValue = stockInputs[p.id] !== undefined ? stockInputs[p.id] : currentStock;

                  return (
                    <tr key={p.id} className="hover:bg-[#FFFDFB]">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <strong className="block text-[#272124]">{p.name}</strong>
                          <span className="text-[10px] text-[#766A6C]">{p.category}</span>
                        </div>
                      </td>
                      <td className="p-3 font-latin text-[#766A6C]">{p.sku}</td>
                      <td className="p-3 font-latin font-bold text-[#492832]">{p.price} ج.م</td>
                      <td className="p-3 font-latin font-bold text-[#272124]">{currentStock} قطعة</td>
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
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          currentStock === 0 
                            ? 'bg-[#FBE9EB] text-[#B84E58]' 
                            : currentStock < 10 
                            ? 'bg-[#FFF3D8] text-[#8A6428]' 
                            : 'bg-[#E9F2ED] text-[#42695A]'
                        }`}>
                          {currentStock === 0 ? 'نفد' : currentStock < 10 ? 'منخفض' : 'متوفر'}
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

      {/* TAB CONTENT: Account & Settlements */}
      {activeTab === 'account' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E1DD]">
            <div>
              <h2 className="text-base font-bold text-[#272124]">كشف الحساب والتسويات المالية</h2>
              <p className="text-xs text-[#766A6C] mt-1">
                سجل المبيعات والتحصيلات النقدية والتحويلات المعتمدة لفرع {selectedMerchant.shortName}.
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-[#FAF5F1] hover:bg-[#F0E2DF] text-[#492832] border border-[#E9E1DD] rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors"
            >
              <Download className="w-4 h-4 text-[#6B3C45]" />
              <span>تصدير تقرير CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF5F1] border border-[#E9E1DD]">
              <span className="text-[10px] text-[#766A6C] block">المبيعات الإجمالية</span>
              <strong className="font-latin text-xl font-bold text-[#272124] block mt-1">48,250 ج.م</strong>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF5F1] border border-[#E9E1DD]">
              <span className="text-[10px] text-[#766A6C] block">تحويلات معتمدة</span>
              <strong className="font-latin text-xl font-bold text-[#597B6D] block mt-1">42,850 ج.م</strong>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF5F1] border border-[#E9E1DD]">
              <span className="text-[10px] text-[#766A6C] block">قيد المراجعة</span>
              <strong className="font-latin text-xl font-bold text-[#B08C5A] block mt-1">5,400 ج.م</strong>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF5F1] border border-[#E9E1DD]">
              <span className="text-[10px] text-[#766A6C] block">الرصيد المستحق</span>
              <strong className="font-latin text-xl font-bold text-[#6B3C45] block mt-1">45,850 ج.م</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF5F1] text-[#766A6C] border-b border-[#E9E1DD]">
                <tr>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">رقم المرجع</th>
                  <th className="p-3">نوع الحركة</th>
                  <th className="p-3">القيمة</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E9E6]">
                <tr>
                  <td className="p-3">14 أكتوبر 2026</td>
                  <td className="p-3 font-latin">TX-1048</td>
                  <td className="p-3">مبيعات طلبات تجزئة</td>
                  <td className="p-3 font-latin font-bold text-[#597B6D]">+ 8,400 ج.م</td>
                  <td className="p-3"><span className="text-[10px] font-bold text-[#597B6D]">مكتمل</span></td>
                </tr>
                <tr>
                  <td className="p-3">13 أكتوبر 2026</td>
                  <td className="p-3 font-latin">TR-017</td>
                  <td className="p-3">تحويل يدوي إنستاباي</td>
                  <td className="p-3 font-latin font-bold text-[#B08C5A]">+ 2,400 ج.م</td>
                  <td className="p-3"><span className="text-[10px] font-bold text-[#B08C5A]">قيد المراجعة</span></td>
                </tr>
                <tr>
                  <td className="p-3">12 أكتوبر 2026</td>
                  <td className="p-3 font-latin">ADJ-005</td>
                  <td className="p-3">تسوية مخزون</td>
                  <td className="p-3 font-latin font-bold text-[#766A6C]">0 ج.م</td>
                  <td className="p-3"><span className="text-[10px] font-bold text-[#597B6D]">معتمد</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Team */}
      {activeTab === 'team' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E9E1DD]">
            <div>
              <h2 className="text-base font-bold text-[#272124]">فريق عمل الفرع</h2>
              <p className="text-xs text-[#766A6C] mt-0.5">
                إدارة الأعضاء المصرح لهم بتجهيز الطلبات وتحديث المخزون.
              </p>
            </div>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="px-4 py-2 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عضو</span>
            </button>
          </div>

          {/* Add member form inline modal */}
          {isAddMemberOpen && (
            <form onSubmit={handleAddMember} className="p-4 rounded-xl bg-[#FAF5F1] border border-[#E9E1DD] space-y-3">
              <h3 className="text-xs font-bold text-[#492832]">بيانات العضو الجديد:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="الاسم الثلاثي..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                  className="h-9 px-3 text-xs bg-white border border-[#E9E1DD] rounded-xl focus:outline-none"
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="h-9 px-3 text-xs bg-white border border-[#E9E1DD] rounded-xl focus:outline-none"
                >
                  <option value="مسؤول طلبات">مسؤول طلبات</option>
                  <option value="مسؤول مخزون">مسؤول مخزون</option>
                  <option value="مدير فرع">مدير فرع</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-1.5 bg-[#6B3C45] text-white rounded-lg text-xs font-bold">
                  حفظ العضو
                </button>
                <button type="button" onClick={() => setIsAddMemberOpen(false)} className="px-3 py-1.5 bg-[#E9E1DD] text-[#766A6C] rounded-lg text-xs font-bold">
                  إلغاء
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-[#F1E9E6]">
            {teamMembers.map(member => (
              <div key={member.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0E2DF] text-[#6B3C45] font-bold flex items-center justify-center text-xs">
                    {member.initials}
                  </div>
                  <div>
                    <strong className="block text-[#272124]">{member.name}</strong>
                    <span className="text-[11px] text-[#766A6C]">{member.role}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#FAF5F1] text-[#766A6C] px-2.5 py-1 rounded-md font-semibold border border-[#E9E1DD]">
                  نشط
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-[#E9E1DD] rounded-2xl p-5 sm:p-6 space-y-6 max-w-xl">
          <div className="pb-4 border-b border-[#E9E1DD]">
            <h2 className="text-base font-bold text-[#272124]">إعدادات الفرع والشحن</h2>
            <p className="text-xs text-[#766A6C] mt-0.5">
              تحديد الشروط التجارية للفرع ونطاق التوصيل.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#492832] mb-1.5">
                الحد الأدنى لطلب الشراء (ج.م)
              </label>
              <input
                type="number"
                value={minOrderInput}
                onChange={(e) => setMinOrderInput(e.target.value)}
                className="w-full h-10 px-3 bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl text-xs font-latin font-bold"
              />
              <span className="text-[10px] text-[#766A6C] mt-1 block">
                لن يتمكن العميل من تأكيد الطلب إذا كان إجمالي المنتجات أقل من هذا المبلغ.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#492832] mb-1.5">
                رسوم التوصيل المحلية للفرع (ج.م)
              </label>
              <input
                type="text"
                disabled
                value={`${selectedMerchant.fee} ج.م (معتمد رسمياً)`}
                className="w-full h-10 px-3 bg-[#FAF5F1] border border-[#E9E1DD] rounded-xl text-xs font-latin text-[#766A6C]"
              />
            </div>

            <button
              onClick={handleSaveMinOrder}
              className="w-full py-3 bg-[#6B3C45] hover:bg-[#492832] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              حفظ الإعدادات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

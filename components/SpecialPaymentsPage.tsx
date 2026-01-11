
import React, { useState } from 'react';
import { SpecialPayment } from '../types';
// Added missing 'Users' icon import from lucide-react
import { Users, User, CreditCard, Send, History, CheckCircle2, AlertCircle } from 'lucide-react';

interface SpecialPaymentsPageProps {
  payments: SpecialPayment[];
  onPay: (id: string, amount: number) => void;
}

const SpecialPaymentsPage: React.FC<SpecialPaymentsPageProps> = ({ payments, onPay }) => {
  const [payAmount, setPayAmount] = useState<{ [key: string]: string }>({});

  const handlePayment = (id: string) => {
    const amount = parseFloat(payAmount[id]);
    if (isNaN(amount) || amount <= 0) return;
    onPay(id, amount);
    setPayAmount({ ...payAmount, [id]: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Users className="text-blue-400 w-8 h-8" />
          পাওনাদার ও বিশেষ পেমেন্ট
        </h2>
        <p className="text-slate-400 mt-2">পরিবার এবং অন্যান্য ব্যক্তিগত পাওনার হিসাব রাখুন এখানে।</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {payments.map(payment => {
          const isFixed = payment.type === 'FIXED';
          const progress = isFixed ? (payment.paidAmount / payment.totalAmount) * 100 : 0;
          const remaining = isFixed ? payment.totalAmount - payment.paidAmount : 0;

          return (
            <div key={payment.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${payment.id === 'sp1' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{payment.name}</h3>
                    <p className="text-xs text-slate-500">
                      {payment.type === 'MONTHLY' ? 'প্রতিমাসে প্রদেয়' : 'নির্দিষ্ট পাওনা'}
                    </p>
                  </div>
                </div>
                {isFixed && remaining === 0 && (
                  <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> পরিশোধিত
                  </div>
                )}
              </div>

              {isFixed && (
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">পরিশোধের অগ্রগতি</span>
                    <span className="font-bold text-blue-400">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-slate-500">মোট: ৳ {payment.totalAmount.toLocaleString()}</span>
                    <span className="text-amber-500 font-medium">বাকি: ৳ {remaining.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {payment.type === 'MONTHLY' && (
                <div className="mb-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="text-emerald-500" size={18} />
                  <p className="text-sm text-slate-300">আব্বুর একাউন্টে প্রতিমাসে নিয়মিত টাকা পাঠাতে ভুলবেন না।</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs text-slate-500 block">টাকা পাঠান</label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    value={payAmount[payment.id] || ''}
                    onChange={(e) => setPayAmount({ ...payAmount, [payment.id]: e.target.value })}
                    placeholder="পরিমাণ"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => handlePayment(payment.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-500">মোট পরিশোধিত:</span>
                <span className="font-bold text-slate-200">৳ {payment.paidAmount.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
          <History size={24} />
        </div>
        <div>
          <h4 className="font-bold">পেমেন্ট হিস্ট্রি</h4>
          <p className="text-sm text-slate-500">সকল বিশেষ পেমেন্টের ইতিহাস 'লেনদেন' ট্যাবে পাওয়া যাবে।</p>
        </div>
      </div>
    </div>
  );
};

export default SpecialPaymentsPage;

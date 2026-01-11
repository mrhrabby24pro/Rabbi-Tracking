
import React, { useState } from 'react';
import { Loan } from '../types';
import { Plus, CreditCard, Calendar, ArrowRight } from 'lucide-react';

interface LoansPageProps {
  loans: Loan[];
  onAdd: (l: Omit<Loan, 'id'>) => void;
}

const LoansPage: React.FC<LoansPageProps> = ({ loans, onAdd }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    remainingAmount: '',
    installmentAmount: '',
    nextPaymentDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      totalAmount: parseFloat(formData.totalAmount),
      remainingAmount: parseFloat(formData.remainingAmount),
      installmentAmount: parseFloat(formData.installmentAmount),
      nextPaymentDate: formData.nextPaymentDate
    });
    setFormData({ name: '', totalAmount: '', remainingAmount: '', installmentAmount: '', nextPaymentDate: '' });
    setShowAdd(false);
  };

  const totalDebt = loans.reduce((acc, curr) => acc + curr.remainingAmount, 0);
  const monthlyEmi = loans.reduce((acc, curr) => acc + curr.installmentAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">ঋণ ও কিস্তি</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus size={20} />
          নতুন ঋণ যোগ করুন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-400 text-sm mb-1">সর্বমোট বকেয়া ঋণ</p>
          <p className="text-3xl font-bold text-amber-500">৳ {totalDebt.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-400 text-sm mb-1">মাসিক কিস্তি (EMI)</p>
          <p className="text-3xl font-bold text-blue-400">৳ {monthlyEmi.toLocaleString()}</p>
        </div>
      </div>

      {showAdd && (
        <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-3xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="ঋণের নাম"
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="মোট ঋণের পরিমাণ"
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.totalAmount}
              onChange={e => setFormData({...formData, totalAmount: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="বাকি পরিমাণ"
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.remainingAmount}
              onChange={e => setFormData({...formData, remainingAmount: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="মাসিক কিস্তি"
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.installmentAmount}
              onChange={e => setFormData({...formData, installmentAmount: e.target.value})}
              required
            />
            <input 
              type="date" 
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.nextPaymentDate}
              onChange={e => setFormData({...formData, nextPaymentDate: e.target.value})}
              required
            />
            <button className="bg-amber-500 text-slate-900 font-bold p-3 rounded-xl">সেভ করুন</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loans.map(loan => (
          <div key={loan.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-amber-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{loan.name}</h3>
                <p className="text-xs text-slate-500">পরবর্তী কিস্তি: {new Date(loan.nextPaymentDate).toLocaleDateString('bn-BD')}</p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <CreditCard className="text-amber-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">পরিশোধিত অগ্রগতি</span>
                  <span className="text-amber-500 font-bold">
                    {((1 - (loan.remainingAmount / loan.totalAmount)) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500" 
                    style={{ width: `${(1 - (loan.remainingAmount / loan.totalAmount)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">বাকি পরিমাণ:</span>
                <span className="font-bold">৳ {loan.remainingAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">মাসিক কিস্তি:</span>
                <span className="text-blue-400 font-bold">৳ {loan.installmentAmount.toLocaleString()}</span>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 border border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              বিস্তারিত দেখুন
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
        {loans.length === 0 && (
          <div className="lg:col-span-2 py-20 text-center bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-500">আপনার কোন সচল ঋণ বা কিস্তি নেই।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoansPage;


import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { Plus, Trash2, Search, Filter } from 'lucide-react';

interface TransactionsPageProps {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onAdd, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: TransactionType.EXPENSE,
    category: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;
    onAdd({
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      note: formData.note,
      date: new Date().toISOString()
    });
    setFormData({ amount: '', type: TransactionType.EXPENSE, category: '', note: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">দৈনিক লেনদেন</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus size={20} />
          লেনদেন যোগ করুন
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-3xl animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">পরিমাণ (টাকা)</label>
              <input 
                type="number"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="৫০০"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">ধরন</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={TransactionType.EXPENSE}>ব্যয় (-)</option>
                <option value={TransactionType.INCOME}>আয় (+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">ক্যাটেগরি</label>
              <input 
                type="text"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="যেমন: বাজার, রিকশা ভাড়া"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">নোট (ঐচ্ছিক)</label>
              <input 
                type="text"
                value={formData.note}
                onChange={e => setFormData({...formData, note: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="কিছু লিখতে চাইলে..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 text-slate-400 hover:text-slate-100"
              >
                বাতিল
              </button>
              <button 
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-xl font-medium"
              >
                সেভ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-4 bg-slate-800/50 flex items-center gap-3">
          <Search className="text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="লেনদেন খুঁজুন..."
            className="bg-transparent border-none focus:outline-none w-full text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">তারিখ</th>
                <th className="px-6 py-4 font-medium">ক্যাটেগরি</th>
                <th className="px-6 py-4 font-medium">পরিমাণ</th>
                <th className="px-6 py-4 font-medium text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(t.date).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{t.category}</span>
                    {t.note && <p className="text-[10px] text-slate-500">{t.note}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} ৳ {t.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-slate-600 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                    কোন লেনদেনের তথ্য পাওয়া যায়নি। প্রথম লেনদেন যোগ করুন!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;

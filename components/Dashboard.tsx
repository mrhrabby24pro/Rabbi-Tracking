
import React from 'react';
import { UserFinance, TransactionType } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  AlertCircle,
  Target
} from 'lucide-react';

interface DashboardProps {
  finance: UserFinance;
}

const Dashboard: React.FC<DashboardProps> = ({ finance }) => {
  const totalIncome = finance.transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalExpense = finance.transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDebt = finance.loans.reduce((acc, curr) => acc + curr.remainingAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold">এক নজরে আপনার হিসাব</h2>
          <p className="text-slate-400">স্বাগতম! আপনার আর্থিক অবস্থা এখানে দেখুন।</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-slate-900 border border-slate-800 p-2 px-4 rounded-full text-sm text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              সব কিছু ঠিক আছে
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="মোট ব্যালেন্স" 
          value={finance.bankBalance} 
          icon={<Wallet className="text-emerald-500" />} 
          color="emerald"
        />
        <StatCard 
          title="মাসিক আয়" 
          value={totalIncome} 
          icon={<TrendingUp className="text-blue-500" />} 
          color="blue"
        />
        <StatCard 
          title="মাসিক ব্যয়" 
          value={totalExpense} 
          icon={<TrendingDown className="text-rose-500" />} 
          color="rose"
        />
        <StatCard 
          title="মোট দায়-দেনা" 
          value={totalDebt} 
          icon={<AlertCircle className="text-amber-500" />} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Goals Progress - Now takes full width as chart is removed */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
             <Target className="w-5 h-5 text-emerald-500" />
             লক্ষ্যমাত্রার অগ্রগতি
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {finance.goals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="bg-slate-800/20 p-4 rounded-2xl border border-slate-800/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium">{goal.name}</span>
                    <span className="font-bold text-emerald-400">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${goal.type === 'LONG' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-[10px] text-slate-500">
                      লক্ষ্য: ৳ {goal.targetAmount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-emerald-500">
                      বাকি: ৳ {(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
            {finance.goals.length === 0 && (
              <p className="text-slate-500 text-center py-10 col-span-full">কোন লক্ষ্যমাত্রা নেই</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <h3 className="text-xl font-semibold mb-4">সাম্প্রতিক লেনদেন</h3>
        <div className="divide-y divide-slate-800">
          {finance.transactions.slice(0, 5).map(t => (
            <div key={t.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${t.type === TransactionType.INCOME ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {t.type === TransactionType.INCOME ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-medium">{t.category}</p>
                  <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString('bn-BD')}</p>
                </div>
              </div>
              <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'} ৳ {t.amount.toLocaleString()}
              </p>
            </div>
          ))}
          {finance.transactions.length === 0 && (
            <p className="text-slate-500 text-center py-6">কোন লেনদেনের ইতিহাস নেই</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 transition-colors group">
    <div className="flex items-center justify-between mb-3">
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <div className="p-2 rounded-xl bg-slate-800 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <p className={`text-2xl font-bold tracking-tight`}>৳ {value.toLocaleString()}</p>
  </div>
);

export default Dashboard;

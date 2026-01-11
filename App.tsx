
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingDown, 
  Target, 
  CreditCard, 
  History,
  Sparkles
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import LoansPage from './components/LoansPage';
import GoalsPage from './components/GoalsPage';
import AIAnalyst from './components/AIAnalyst';
import { UserFinance, Transaction, Loan, Goal, TransactionType } from './types';

const INITIAL_DATA: UserFinance = {
  bankBalance: 50000,
  transactions: [
    { id: '1', date: new Date().toISOString(), amount: 1500, type: TransactionType.EXPENSE, category: 'বাজার', note: 'সাপ্তাহিক বাজার' },
    { id: '2', date: new Date().toISOString(), amount: 45000, type: TransactionType.INCOME, category: 'বেতন', note: 'জানুয়ারি মাসের বেতন' }
  ],
  loans: [
    { id: 'l1', name: 'হোম লোন', totalAmount: 500000, remainingAmount: 420000, installmentAmount: 8500, nextPaymentDate: '2024-02-15' }
  ],
  goals: [
    { id: 'g1', name: 'নতুন ল্যাপটপ', targetAmount: 80000, currentAmount: 15000, deadline: '2024-12-31', type: 'SHORT' },
    { id: 'g2', name: 'নিজের বাড়ি', targetAmount: 2000000, currentAmount: 50000, deadline: '2027-06-30', type: 'LONG' }
  ]
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'loans' | 'goals' | 'ai-analyst'>('dashboard');
  const [finance, setFinance] = useState<UserFinance>(() => {
    const saved = localStorage.getItem('amar_hisab_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('amar_hisab_data', JSON.stringify(finance));
  }, [finance]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: Date.now().toString() };
    setFinance(prev => ({
      ...prev,
      transactions: [newT, ...prev.transactions],
      bankBalance: t.type === TransactionType.INCOME 
        ? prev.bankBalance + t.amount 
        : prev.bankBalance - t.amount
    }));
  };

  const addLoan = (l: Omit<Loan, 'id'>) => {
    setFinance(prev => ({
      ...prev,
      loans: [...prev.loans, { ...l, id: Date.now().toString() }]
    }));
  };

  const addGoal = (g: Omit<Goal, 'id'>) => {
    setFinance(prev => ({
      ...prev,
      goals: [...prev.goals, { ...g, id: Date.now().toString() }]
    }));
  };

  const deleteTransaction = (id: string) => {
    const transaction = finance.transactions.find(t => t.id === id);
    if (!transaction) return;
    setFinance(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
      bankBalance: transaction.type === TransactionType.INCOME 
        ? prev.bankBalance - transaction.amount 
        : prev.bankBalance + transaction.amount
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 md:pb-0 md:pl-64">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-emerald-500 flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            আমার হিসাব
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="ড্যাশবোর্ড" />
          <NavItem active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<History />} label="লেনদেন" />
          <NavItem active={activeTab === 'loans'} onClick={() => setActiveTab('loans')} icon={<CreditCard />} label="ঋণ ও কিস্তি" />
          <NavItem active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} icon={<Target />} label="লক্ষ্যমাত্রা" />
          <NavItem active={activeTab === 'ai-analyst'} onClick={() => setActiveTab('ai-analyst')} icon={<Sparkles />} label="এআই এনালিস্ট" />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">মোট ব্যালেন্স</p>
            <p className="text-xl font-bold text-emerald-400">৳ {finance.bankBalance.toLocaleString()}</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-3 md:hidden z-50">
        <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} />
        <MobileNavItem active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<History />} />
        <MobileNavItem active={activeTab === 'loans'} onClick={() => setActiveTab('loans')} icon={<CreditCard />} />
        <MobileNavItem active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} icon={<Target />} />
        <MobileNavItem active={activeTab === 'ai-analyst'} onClick={() => setActiveTab('ai-analyst')} icon={<Sparkles />} />
      </nav>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard finance={finance} />}
        {activeTab === 'transactions' && (
          <TransactionsPage 
            transactions={finance.transactions} 
            onAdd={addTransaction} 
            onDelete={deleteTransaction}
          />
        )}
        {activeTab === 'loans' && <LoansPage loans={finance.loans} onAdd={addLoan} />}
        {activeTab === 'goals' && <GoalsPage goals={finance.goals} onAdd={addGoal} />}
        {activeTab === 'ai-analyst' && <AIAnalyst finance={finance} />}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-emerald-500/10 text-emerald-500 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    <span>{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-full transition-all ${
      active ? 'bg-emerald-500 text-white' : 'text-slate-400'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
  </button>
);

export default App;

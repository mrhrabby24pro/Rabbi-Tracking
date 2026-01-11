
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Target, 
  CreditCard, 
  History,
  Sparkles,
  Users
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import LoansPage from './components/LoansPage';
import GoalsPage from './components/GoalsPage';
import AIAnalyst from './components/AIAnalyst';
import SpecialPaymentsPage from './components/SpecialPaymentsPage';
import { UserFinance, Transaction, Loan, Goal, TransactionType, SpecialPayment } from './types';

const INITIAL_DATA: UserFinance = {
  bankBalance: 500000,
  transactions: [
    { id: '1', date: new Date().toISOString(), amount: 45000, type: TransactionType.INCOME, category: 'বেতন', note: 'জানুয়ারি মাসের বেতন' }
  ],
  loans: [],
  goals: [],
  specialPayments: [
    { id: 'sp1', name: 'আব্বুর একাউন্ট', totalAmount: 0, paidAmount: 0, type: 'MONTHLY' },
    { id: 'sp2', name: 'তমা', totalAmount: 120000, paidAmount: 0, type: 'FIXED' },
    { id: 'sp3', name: 'মামা', totalAmount: 70000, paidAmount: 0, type: 'FIXED' },
    { id: 'sp4', name: 'বকেয়া কিস্তি', totalAmount: 100000, paidAmount: 0, type: 'FIXED' }
  ]
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'loans' | 'goals' | 'ai-analyst' | 'special-payments'>('dashboard');
  const [finance, setFinance] = useState<UserFinance>(() => {
    const saved = localStorage.getItem('amar_hisab_data_v2');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('amar_hisab_data_v2', JSON.stringify(finance));
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

  const handleSpecialPayment = (id: string, amount: number) => {
    setFinance(prev => {
      const updatedPayments = prev.specialPayments.map(p => 
        p.id === id ? { ...p, paidAmount: p.paidAmount + amount } : p
      );
      
      const payment = prev.specialPayments.find(p => p.id === id);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: amount,
        type: TransactionType.EXPENSE,
        category: 'বিশেষ পেমেন্ট',
        note: `${payment?.name} কে প্রদান`
      };

      return {
        ...prev,
        specialPayments: updatedPayments,
        bankBalance: prev.bankBalance - amount,
        transactions: [newTransaction, ...prev.transactions]
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 md:pb-0 md:pl-64">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-emerald-500 flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            আমার হিসাব
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="ড্যাশবোর্ড" />
          <NavItem active={activeTab === 'special-payments'} onClick={() => setActiveTab('special-payments')} icon={<Users />} label="পাওনাদার" />
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

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-3 md:hidden z-50">
        <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} />
        <MobileNavItem active={activeTab === 'special-payments'} onClick={() => setActiveTab('special-payments')} icon={<Users />} />
        <MobileNavItem active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<History />} />
        <MobileNavItem active={activeTab === 'loans'} onClick={() => setActiveTab('loans')} icon={<CreditCard />} />
        <MobileNavItem active={activeTab === 'ai-analyst'} onClick={() => setActiveTab('ai-analyst')} icon={<Sparkles />} />
      </nav>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard finance={finance} />}
        {activeTab === 'transactions' && (
          <TransactionsPage 
            transactions={finance.transactions} 
            onAdd={addTransaction} 
            onDelete={() => {}} 
          />
        )}
        {activeTab === 'loans' && <LoansPage loans={finance.loans} onAdd={() => {}} />}
        {activeTab === 'goals' && <GoalsPage goals={finance.goals} onAdd={() => {}} />}
        {activeTab === 'ai-analyst' && <AIAnalyst finance={finance} />}
        {activeTab === 'special-payments' && (
          <SpecialPaymentsPage 
            payments={finance.specialPayments} 
            onPay={handleSpecialPayment} 
          />
        )}
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

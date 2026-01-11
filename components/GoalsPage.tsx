
import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, Flag, Calendar, Plus, Trophy } from 'lucide-react';

interface GoalsPageProps {
  goals: Goal[];
  onAdd: (g: Omit<Goal, 'id'>) => void;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ goals, onAdd }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    type: 'SHORT' as 'SHORT' | 'LONG'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline,
      type: formData.type
    });
    setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '', type: 'SHORT' });
    setShowAdd(false);
  };

  const shortTermGoals = goals.filter(g => g.type === 'SHORT');
  const longTermGoals = goals.filter(g => g.type === 'LONG');

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">আর্থিক লক্ষ্যমাত্রা</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
        >
          <Plus size={20} />
          লক্ষ্য যোগ করুন
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-3xl animate-in slide-in-from-top-2">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="লক্ষ্যের নাম (যেমন: বাড়ি কেনা)"
              className="bg-slate-800 p-3 rounded-xl border border-slate-700 col-span-2"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="টার্গেট পরিমাণ"
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.targetAmount}
              onChange={e => setFormData({...formData, targetAmount: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="বর্তমান জমানো পরিমাণ"
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.currentAmount}
              onChange={e => setFormData({...formData, currentAmount: e.target.value})}
              required
            />
            <input 
              type="date" 
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
              required
            />
            <select 
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as 'SHORT' | 'LONG'})}
            >
              <option value="SHORT">স্বল্পমেয়াদী (১ বছর)</option>
              <option value="LONG">দীর্ঘমেয়াদী (২-৩ বছর)</option>
            </select>
            <button className="bg-emerald-500 text-white font-bold p-3 rounded-xl col-span-2">সেভ করুন</button>
          </form>
        </div>
      )}

      {/* Goal Sections */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flag className="text-emerald-500" />
          <h3 className="text-xl font-bold">স্বল্পমেয়াদী লক্ষ্যমাত্রা (১ বছর)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortTermGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
          {shortTermGoals.length === 0 && <EmptyState text="কোন স্বল্পমেয়াদী লক্ষ্য নেই" />}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-amber-500" />
          <h3 className="text-xl font-bold">দীর্ঘমেয়াদী লক্ষ্যমাত্রা (২-৩ বছর)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {longTermGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
          {longTermGoals.length === 0 && <EmptyState text="কোন দীর্ঘমেয়াদী লক্ষ্য নেই" />}
        </div>
      </section>
    </div>
  );
};

const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-slate-600 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{goal.name}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <Calendar size={12} />
            শেষ তারিখ: {new Date(goal.deadline).toLocaleDateString('bn-BD')}
          </p>
        </div>
        <div className={`p-3 rounded-2xl ${goal.type === 'LONG' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
          <Target />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">অগ্রগতি</span>
            <span className="font-bold">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-1">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${goal.type === 'LONG' ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-slate-800">
          <div>
            <p className="text-[10px] text-slate-500 uppercase">জমানো হয়েছে</p>
            <p className="font-bold text-emerald-400">৳ {goal.currentAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase">টার্গেট</p>
            <p className="font-bold">৳ {goal.targetAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-3xl text-slate-500">
    <Target className="w-12 h-12 mb-3 opacity-20" />
    <p>{text}</p>
  </div>
);

export default GoalsPage;

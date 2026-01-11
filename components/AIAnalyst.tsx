
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UserFinance, TransactionType } from '../types';
import { Sparkles, Brain, Loader2, MessageSquare, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface AIAnalystProps {
  finance: UserFinance;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ finance }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const totalIncome = finance.transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((acc, curr) => acc + curr.amount, 0);
      
      const totalExpense = finance.transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, curr) => acc + curr.amount, 0);

      const totalDebt = finance.loans.reduce((acc, curr) => acc + curr.remainingAmount, 0);

      const prompt = `
        আপনি একজন পেশাদার আর্থিক উপদেষ্টা। এখানে একজন ব্যবহারকারীর আর্থিক তথ্য দেওয়া হলো:
        - বর্তমান ব্যালেন্স: ৳${finance.bankBalance}
        - এই মাসের মোট আয়: ৳${totalIncome}
        - এই মাসের মোট ব্যয়: ৳${totalExpense}
        - মোট বকেয়া ঋণ: ৳${totalDebt}
        - লক্ষ্যমাত্রা সংখ্যা: ${finance.goals.length} টি

        এই তথ্যের ভিত্তিতে ব্যবহারকারীকে বাংলায় একটি সংক্ষিপ্ত কিন্তু কার্যকর আর্থিক রিপোর্ট দিন। 
        রিপোর্টে নিচের বিষয়গুলো পয়েন্ট আকারে থাকতে হবে:
        ১. বর্তমান আর্থিক অবস্থার মূল্যায়ন।
        ২. ব্যয়ের ধরন নিয়ে মন্তব্য।
        ৩. ঋণ ব্যবস্থাপনা নিয়ে পরামর্শ।
        ৪. সঞ্চয় বাড়ানোর জন্য ৩টি কার্যকর টিপস।
        
        উত্তরটি সুন্দরভাবে সাজিয়ে দিন এবং ইতিবাচক শব্দ ব্যবহার করুন।
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'দুঃখিত, কোনো বিশ্লেষণ পাওয়া যায়নি।');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAnalysis('এআই বিশ্লেষণ করতে সমস্যা হচ্ছে। অনুগ্রহ করে পরে চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="text-emerald-400 w-8 h-8" />
          এআই এনালিস্ট
        </h2>
        <p className="text-slate-400 mt-2">আপনার আর্থিক তথ্য বিশ্লেষণ করে সঠিক সিদ্ধান্ত নিতে সাহায্য করবে আমাদের এআই।</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Action Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Brain className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">স্মার্ট বিশ্লেষণ</h3>
            <p className="text-sm text-slate-400 mb-6">
              আপনার আয়, ব্যয় এবং ঋণের তথ্য বিশ্লেষণ করে এআই আপনাকে একটি ব্যক্তিগত রিপোর্ট তৈরি করে দেবে।
            </p>
            <button
              onClick={generateAnalysis}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  বিশ্লেষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  বিশ্লেষণ শুরু করুন
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">নিরাপত্তা নিশ্চিতকরণ</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck className="text-blue-400 w-4 h-4" />
                তথ্য নিরাপদ এবং এনক্রিপ্টেড
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck className="text-blue-400 w-4 h-4" />
                তৃতীয় পক্ষের কাছে তথ্য বিক্রয় করা হয় না
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="lg:col-span-2">
          {!analysis && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-10 text-center">
              <div className="p-4 bg-slate-800 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-xl font-medium text-slate-300 mb-2">রিপোর্ট জেনারেট করুন</h4>
              <p className="text-slate-500 max-w-sm">
                বামে থাকা বাটনে ক্লিক করুন এবং আপনার আর্থিক তথ্যের ভিত্তিতে গভীর বিশ্লেষণ এবং পরামর্শ গ্রহণ করুন।
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-xl font-medium text-slate-300 mb-2">এআই আপনার ডেটা প্রসেস করছে...</h4>
              <p className="text-slate-500">একটু অপেক্ষা করুন, আপনার জন্য কাস্টমাইজড পরামর্শ তৈরি হচ্ছে।</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="bg-slate-900 border border-emerald-500/20 p-8 rounded-3xl shadow-2xl shadow-emerald-500/5 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-emerald-500 uppercase">এআই জেনারেটেড রিপোর্ট</span>
                </div>
                <span className="text-xs text-slate-500">{new Date().toLocaleDateString('bn-BD')}</span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-200 whitespace-pre-line leading-relaxed text-lg">
                  {analysis}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-2xl flex items-center gap-3">
                  <TrendingUp className="text-emerald-400" />
                  <span className="text-sm">সঞ্চয় বাড়ানোর সুযোগ আছে</span>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-2xl flex items-center gap-3">
                  <AlertTriangle className="text-amber-400" />
                  <span className="text-sm">ঋণ পরিশোধে গুরুত্ব দিন</span>
                </div>
              </div>

              <button 
                onClick={() => setAnalysis(null)}
                className="mt-8 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                রিপোর্ট ক্লিয়ার করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalyst;

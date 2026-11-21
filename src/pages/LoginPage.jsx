import React, { useState } from 'react';
import { Wrench, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage({ setActivePage }) {
  const { login, demoUsers, switchDemoAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') setActivePage('admin-dashboard');
      else if (result.user.role === 'staff') setActivePage('staff-dashboard');
      else if (result.user.role === 'faculty') setActivePage('faculty-dashboard');
      else setActivePage('student-dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleQuickDemoLogin = (user) => {
    switchDemoAccount(user.id);
    if (user.role === 'admin') setActivePage('admin-dashboard');
    else if (user.role === 'staff') setActivePage('staff-dashboard');
    else if (user.role === 'faculty') setActivePage('faculty-dashboard');
    else setActivePage('student-dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 space-y-6 text-xs">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white mx-auto shadow-md">
          <Wrench className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome to FixMyCampus
        </h1>
        <p className="text-slate-500 text-xs">
          Sign in with your institutional credentials or choose a quick demo account
        </p>
      </div>

      {/* 1-Click Hackathon Demo Selector */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-xs">
          <UserCheck className="w-4 h-4 text-brand-500" />
          <span>Quick 1-Click Demo Accounts (Hackathon Presentation)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {demoUsers.map(dUser => (
            <button
              key={dUser.id}
              type="button"
              onClick={() => handleQuickDemoLogin(dUser)}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-left transition-all group shadow-xs"
            >
              <span className="font-bold text-slate-900 dark:text-white block group-hover:text-brand-600">
                {dUser.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">
                Role: {dUser.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Campus Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.chen@campus.edu"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 text-slate-500 text-[11px]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setActivePage('register')}
            className="font-bold text-brand-600 hover:underline"
          >
            Register as Student or Faculty
          </button>
        </div>
      </form>
    </div>
  );
}

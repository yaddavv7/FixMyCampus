import React, { useState } from 'react';
import { Wrench, Mail, Lock, User, ShieldCheck, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage({ setActivePage }) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // student | faculty (Admin explicitly blocked)
  const [institutionalId, setInstitutionalId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      setError('Administrative privileges require Dean authorization and cannot be self-selected.');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      role,
      institutionalId,
      department
    });
    setLoading(false);

    if (result.success) {
      if (role === 'faculty') setActivePage('faculty-dashboard');
      else setActivePage('student-dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 space-y-6 text-xs">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white mx-auto shadow-md">
          <Wrench className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create FixMyCampus Account
        </h1>
        <p className="text-slate-500 text-xs">
          Institutional access for verified students and academic faculty
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Role Selection (Student vs Faculty ONLY) */}
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Institutional Role *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3 rounded-xl border text-center font-bold transition-all ${
                role === 'student'
                  ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              className={`p-3 rounded-xl border text-center font-bold transition-all ${
                role === 'faculty'
                  ? 'border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Faculty Member
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            🔒 Administrative roles require university executive credentials and cannot be self-registered.
          </p>
        </div>

        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan Miller"
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Institutional Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jordan.miller@campus.edu"
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              {role === 'student' ? 'Student Roll No.' : 'Faculty Staff ID'} *
            </label>
            <input
              type="text"
              required
              value={institutionalId}
              onChange={(e) => setInstitutionalId(e.target.value)}
              placeholder={role === 'student' ? 'STU-2024-9102' : 'FAC-ENG-205'}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Department *
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Electrical & Electronics"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Create Password *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-2"
        >
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 text-slate-500 text-[11px]">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => setActivePage('login')}
            className="font-bold text-brand-600 hover:underline"
          >
            Sign In here
          </button>
        </div>
      </form>
    </div>
  );
}

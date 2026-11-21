import React, { useState } from 'react';
import { User, Mail, Phone, Building, Shield, RefreshCw, Key, Check, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { useTheme } from '../context/ThemeContext';

export function ProfilePage({ onOpenFirebaseModal }) {
  const { user, switchDemoAccount, demoUsers } = useAuth();
  const { resetAllDemoData } = useComplaints();
  const { isDark, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 text-xs">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          User Profile & Settings
        </h1>
        <p className="text-slate-500 text-xs">
          Manage institutional credentials, notification preferences, and hackathon presentation accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* User Badge Card (1 Col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <div className="relative inline-block">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-500/20 mx-auto"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white shadow-xs capitalize">
              {user?.role}
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-slate-500 text-xs">{user?.email}</p>
            <p className="text-brand-600 dark:text-brand-400 font-semibold text-[11px] mt-1">
              {user?.badge || 'Campus Member'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-left space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <span>Department:</span>
              <strong className="text-slate-800 dark:text-slate-200">{user?.department}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>ID Number:</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">
                {user?.studentId || user?.staffId || 'CAMPUS-AUTH-01'}
              </strong>
            </div>
          </div>
        </div>

        {/* Profile Settings Form (2 Cols) */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              Personal Information
            </h3>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-2">
                <Check className="w-4 h-4" /> Profile changes saved successfully!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Campus Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bio / Notes</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold"
              >
                Save Settings
              </button>
            </div>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              Switch Presentation Demo Profile (Hackathon Mode)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {demoUsers.map(dUser => (
                <button
                  key={dUser.id}
                  onClick={() => switchDemoAccount(dUser.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    user?.id === dUser.id
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="block font-bold capitalize text-xs">{dUser.role}</span>
                  <span className="text-[10px] text-slate-400">{dUser.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System & Reset Options */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={onOpenFirebaseModal}
              className="text-brand-600 font-bold hover:underline"
            >
              View Firebase Backend Status →
            </button>
            <button
              onClick={resetAllDemoData}
              className="text-rose-600 font-bold hover:underline"
            >
              Reset All Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Wrench, Heart, Shield, PhoneCall, ExternalLink, Globe } from 'lucide-react';

export function Footer({ setActivePage, onOpenFirebaseModal }) {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#070b14]/70 backdrop-blur-sm text-xs text-slate-500 dark:text-slate-400 py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-base">
                FixMy<span className="text-brand-600">Campus</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Smart campus maintenance & problem-reporting platform connecting students, faculty, facilities, and administration.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational (99.9% uptime)
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('landing')} className="hover:text-brand-600 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('track')} className="hover:text-brand-600 transition-colors">
                  Universal Complaint Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('heatmap')} className="hover:text-brand-600 transition-colors">
                  Campus Issue Heatmap
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('qr')} className="hover:text-brand-600 transition-colors">
                  Classroom QR Codes
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('transparency')} className="hover:text-brand-600 transition-colors">
                  Public Transparency Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Roles */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Campus Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('student-dashboard')} className="hover:text-brand-600 transition-colors">
                  Student Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('faculty-dashboard')} className="hover:text-brand-600 transition-colors">
                  Faculty Laboratory Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('staff-dashboard')} className="hover:text-brand-600 transition-colors">
                  Maintenance Dispatch Panel
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin-dashboard')} className="hover:text-brand-600 transition-colors">
                  Dean / Admin Control Center
                </button>
              </li>
              <li>
                <button onClick={onOpenFirebaseModal} className="hover:text-brand-600 transition-colors text-emerald-600 dark:text-emerald-400 font-semibold">
                  Backend Architecture & Rules
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Safety & Emergency */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Emergency Hotlines
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/60 dark:bg-rose-950/20">
                <p className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" /> Emergency Facilities Dispatch:
                </p>
                <p className="text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                  Ext. 2099 / +1 (555) 019-9111
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                For electrical hazards, burst mains, or gas leaks, call security immediately.
              </p>
              <div className="pt-2">
                <button onClick={() => setActivePage('about')} className="text-brand-600 hover:underline">
                  About Project & Privacy Policy →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} FixMyCampus Platform. Built for College Operations & National Hackathon Showcase.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React.js</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Firestore Engine</span>
            <span>•</span>
            <span>Role-Based Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

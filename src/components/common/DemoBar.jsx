import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Shield, Sparkles, RefreshCw, AlertTriangle, Database, ChevronUp, ChevronDown, UserCheck } from 'lucide-react';

export function DemoBar({ onOpenFirebaseModal }) {
  const { user, switchDemoAccount, demoUsers } = useAuth();
  const { simulateSlaEscalation, resetAllDemoData } = useComplaints();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside aria-label="Hackathon Demo Controller" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-t border-slate-800 shadow-2xl transition-all duration-300">
      {/* Mini Toggle tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-wide text-brand-300 text-[11px] uppercase">
              Hackathon Demo Controller
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <button
              onClick={onOpenFirebaseModal}
              className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>Demo Mode (Local Persistent Storage)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Active User: <strong className="text-white">{user?.name}</strong> ({user?.role?.toUpperCase()})
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>{isCollapsed ? 'Show Controls' : 'Hide'}</span>
              {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Controls */}
        {!isCollapsed && (
          <div className="py-2.5 pb-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Quick Role Switcher Buttons */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-slate-400 text-[11px] mr-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Switch Role:
              </span>
              {demoUsers.map(dUser => {
                const isActive = user?.id === dUser.id;
                return (
                  <button
                    key={dUser.id}
                    onClick={() => switchDemoAccount(dUser.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-brand-600 text-white font-bold ring-2 ring-brand-400 ring-offset-1 ring-offset-slate-900 shadow-sm'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    <span className="capitalize">{dUser.role}:</span>
                    <span>{dUser.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Presentation Superpowers */}
            <div className="flex items-center gap-2">
              <button
                onClick={simulateSlaEscalation}
                title="Simulates SLA breach on an active ticket to trigger instant Admin alert"
                className="px-2.5 py-1 bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Simulate SLA Escalation</span>
              </button>

              <button
                onClick={resetAllDemoData}
                title="Restores fresh 10 seed complaints and clean state"
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

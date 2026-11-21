import React from 'react';
import {
  CheckCircle2,
  Clock,
  User,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  FileText,
  RotateCcw
} from 'lucide-react';

export function ComplaintTimeline({ timeline = [], currentStatus = 'Submitted' }) {
  const getStepIcon = (status) => {
    switch (status) {
      case 'Submitted':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Under Review':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Assigned':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'In Progress':
        return <Wrench className="w-4 h-4 text-cyan-500" />;
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Reopened':
        return <RotateCcw className="w-4 h-4 text-rose-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
      case 'staff':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'faculty':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {timeline.map((item, index) => {
          const isLatest = index === timeline.length - 1;
          return (
            <div key={item.id || index} className="relative group">
              {/* Dot / Icon */}
              <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs ${
                isLatest
                  ? 'border-brand-500 ring-4 ring-brand-500/10'
                  : 'border-slate-300 dark:border-slate-700'
              }`}>
                {getStepIcon(item.status)}
              </div>

              {/* Card */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3.5 sm:p-4 text-xs space-y-1.5 transition-all group-hover:border-brand-500/30">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {item.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${getRoleBadge(item.role)}`}>
                      {item.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(item.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  {item.note}
                </p>

                <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Updated by:</span>
                  <strong className="text-slate-700 dark:text-slate-200">{item.actor}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

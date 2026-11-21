import React from 'react';
import { AlertTriangle, ThumbsUp, Eye, ArrowRight } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';

export function DuplicateAlert({ duplicates = [], onSelectExisting, onDismiss }) {
  const { upvote } = useComplaints();

  if (!duplicates || duplicates.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/90 dark:bg-amber-950/40 text-xs shadow-md animate-slide-in space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
            Smart Duplicate Detection: Similar Issue Already Reported!
          </h4>
          <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
            We found {duplicates.length} active unresolved complaint(s) in this exact location. Supporting the existing ticket boosts its priority instead of creating redundant tickets.
          </p>
        </div>
      </div>

      {/* Duplicate list */}
      <div className="space-y-2 pt-1">
        {duplicates.map(existing => (
          <div
            key={existing.id}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {existing.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Status: {existing.status}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {existing.room}
                </span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white truncate">
                {existing.title}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => upvote(existing.id)}
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Support Issue (+1)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectExisting(existing.id)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onDismiss}
          className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 hover:underline"
        >
          My problem is different (Continue reporting anyway) →
        </button>
      </div>
    </div>
  );
}

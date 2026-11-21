import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, ArrowRight, AlertCircle, Wand2, RefreshCw } from 'lucide-react';
import { analyzeComplaintDraft } from '../../services/nlpAssistant';

export function AIAssistantModal({ isOpen, onClose, formData, onApplySuggestions }) {
  const [analysis, setAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        const result = analyzeComplaintDraft(formData);
        setAnalysis(result);
        setIsProcessing(false);
      }, 400); // brief realistic micro-delay
      return () => clearTimeout(timer);
    }
  }, [isOpen, formData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-brand-50 to-indigo-50/50 dark:from-brand-950/40 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  FixMyCampus Smart Report Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  NLP Heuristics
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enhance clarity, auto-detect categories & spot missing details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {isProcessing ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                Analyzing problem description, safety hazards, and location context...
              </p>
            </div>
          ) : analysis ? (
            <>
              {/* Category & Priority Suggestion */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 block mb-1">Recommended Category</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {analysis.suggestedCategory}
                    </span>
                    {analysis.suggestedCategory !== formData.category && (
                      <span className="text-[10px] text-brand-600 font-semibold bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded">
                        Suggested Change
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 block mb-1">Recommended Priority</span>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-sm ${
                      analysis.suggestedPriority === 'Urgent' ? 'text-rose-600' :
                      analysis.suggestedPriority === 'High' ? 'text-orange-600' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {analysis.suggestedPriority}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      SLA: {analysis.suggestedPriority === 'Urgent' ? '12h' : analysis.suggestedPriority === 'High' ? '24h' : '48h'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Priority explanation */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Safety Triage Note: </strong>
                {analysis.priorityReason}
              </div>

              {/* Missing Details Checklist */}
              {analysis.missingChecks.length > 0 && (
                <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 space-y-1.5">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Completeness Checks ({analysis.missingChecks.length})
                  </h4>
                  <ul className="space-y-1 pl-5 list-disc text-amber-800 dark:text-amber-300">
                    {analysis.missingChecks.map((check, idx) => (
                      <li key={idx}>{check}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Proposed Enhanced Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    Proposed Enhanced Description
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Technical Clarity & Actionable Phrasing
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/30 dark:bg-brand-950/20 text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {analysis.enhancedDescription}
                </div>
              </div>

              {/* Proposed Enhanced Title */}
              {analysis.enhancedTitle && analysis.enhancedTitle !== formData.title && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    Suggested Crisp Title
                  </label>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-900 dark:text-white">
                    {analysis.enhancedTitle}
                  </div>
                </div>
              )}

              {/* Engine disclosure badge */}
              <div className="text-[11px] text-slate-400 text-center pt-1">
                Engine: <span className="font-mono">{analysis.engine}</span> • Transparent, private, on-device heuristic analysis.
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-xs"
          >
            Keep Original
          </button>
          <button
            onClick={() => {
              if (analysis) {
                onApplySuggestions({
                  title: analysis.enhancedTitle || formData.title,
                  description: analysis.enhancedDescription || formData.description,
                  category: analysis.suggestedCategory || formData.category,
                  priority: analysis.suggestedPriority || formData.priority
                });
              }
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply AI Enhancements</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ShieldCheck, Database, Wrench, Heart, Code2, Users, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export function AboutPage({ onOpenFirebaseModal }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 text-xs">
      {/* Hero */}
      <div className="space-y-3 text-center">
        <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold text-xs">
          About FixMyCampus
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          "Report It. Track It. Fix It."
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          A smart campus maintenance and problem-reporting platform designed to eliminate neglected facilities, improve response times, and bring total transparency to university living.
        </p>
      </div>

      {/* The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
          <h3 className="font-extrabold text-rose-900 dark:text-rose-200 text-base">
            The Campus Reality Today
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            Broken ceiling fans, water cooler leaks, and Wi-Fi outages in colleges frequently take weeks to get fixed. Students have no central place to report problems, complaints get lost in WhatsApp groups or paper registers, maintenance crews lack dispatch prioritization, and administrators have zero visibility into overdue tasks.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/80 dark:border-brand-900/40 space-y-3">
          <h3 className="font-extrabold text-brand-900 dark:text-brand-200 text-base">
            The FixMyCampus Solution
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            FixMyCampus automates the entire lifecycle: students report issues in 30 seconds or scan room QR codes, smart duplicate detection prevents redundant tickets, an AI assistant polishes reports and recommends priorities, SLAs automatically escalate overdue items to the Dean, and field technicians upload completion photo evidence.
          </p>
        </div>
      </div>

      {/* Security & Anonymous Protection */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-600">
          <Lock className="w-5 h-5" />
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            Security & Anonymous Reporting Guarantee
          </h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Students can freely report sensitive hygiene or safety problems using the <strong>Anonymous Reporting</strong> toggle. When activated, institutional identity details (name, student ID, email) are stripped and never displayed on public feeds or shared with field technicians. Role-based access control prevents users from self-elevating privileges to administrator.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-1">
          <span className="text-brand-400 font-bold text-xs uppercase tracking-wider">
            Technical Architecture
          </span>
          <h3 className="text-xl font-black">Modern SaaS Engineering Stack</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-brand-400 font-bold block">Frontend</span>
            <span className="font-bold text-white text-sm block">React + Vite</span>
            <span className="text-[11px] text-slate-400">Tailwind CSS & Lucide Icons</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-indigo-400 font-bold block">Motion</span>
            <span className="font-bold text-white text-sm block">Framer Motion</span>
            <span className="text-[11px] text-slate-400">Smooth micro-interactions</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-cyan-400 font-bold block">Database</span>
            <span className="font-bold text-white text-sm block">Cloud Firestore</span>
            <span className="text-[11px] text-slate-400">Reactive persistence engine</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-emerald-400 font-bold block">AI Engine</span>
            <span className="font-bold text-white text-sm block">NLP Assistant</span>
            <span className="text-[11px] text-slate-400">Rule-based + Gemini API ready</span>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800">
          <span>Engineered for national hackathon competition presentation.</span>
          <button
            onClick={onOpenFirebaseModal}
            className="text-brand-400 font-bold hover:underline"
          >
            Inspect Security Rules & Config →
          </button>
        </div>
      </div>
    </div>
  );
}

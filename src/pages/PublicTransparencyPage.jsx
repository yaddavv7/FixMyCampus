import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  PieChart,
  Lock
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { CATEGORIES, CAMPUS_BUILDINGS } from '../data/campusLocations';

export function PublicTransparencyPage({ setActivePage, onSelectComplaint }) {
  const { publicStats, complaints } = useComplaints();

  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved');
  const recentPublicResolved = resolvedComplaints.slice(0, 5);

  // Category statistics array with percentages
  const categoryStats = CATEGORIES.map(cat => {
    const count = publicStats.categoryCounts[cat.id] || 0;
    const resolvedCat = complaints.filter(c => c.category === cat.id && c.status === 'Resolved').length;
    const percentage = publicStats.total > 0 ? Math.round((count / publicStats.total) * 100) : 0;
    return {
      ...cat,
      count,
      resolvedCat,
      percentage
    };
  }).sort((a, b) => b.count - a.count);

  // Monthly simulated statistics for semester reporting
  const monthlyStats = [
    { month: 'August', reported: 45, resolved: 43, rate: '95%' },
    { month: 'September', reported: 68, resolved: 65, rate: '96%' },
    { month: 'October', reported: 82, resolved: 79, rate: '96%' },
    { month: 'November (Current)', reported: publicStats.total, resolved: publicStats.resolved, rate: `${publicStats.resolutionRate}%` },
  ];

  return (
    <div className="space-y-8 py-6 text-xs">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Institutional Accountability & SLA Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Campus Transparency & Public Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Real-time public audit of facilities management, turnaround times, and resolution rates.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 flex items-center gap-3">
          <Lock className="w-5 h-5 text-emerald-400" />
          <div className="text-left text-xs">
            <span className="font-bold text-white block">Student PII Protected</span>
            <span className="text-[10px] text-slate-300">All student identity data is redacted by policy.</span>
          </div>
        </div>
      </div>

      {/* 4 Primary Public KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
          <span className="text-[11px] text-slate-500 block mb-1">Total Issues Reported</span>
          <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {publicStats.total}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Verified on campus</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mb-1">Total Issues Fixed</span>
          <div className="text-2xl sm:text-4xl font-black text-emerald-600">
            {publicStats.resolved}
          </div>
          <span className="text-[10px] text-emerald-500 block mt-1">100% physically inspected</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
          <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold block mb-1">Campus Resolution Rate</span>
          <div className="text-2xl sm:text-4xl font-black text-brand-600">
            {publicStats.resolutionRate}%
          </div>
          <span className="text-[10px] text-brand-500 block mt-1">Benchmark: &gt;90% SLA target</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">Average Turnaround Time</span>
          <div className="text-2xl sm:text-4xl font-black text-indigo-600">
            {publicStats.avgResolutionHours}h
          </div>
          <span className="text-[10px] text-indigo-500 block mt-1">From report to completion</span>
        </div>
      </div>

      {/* Category Breakdown & Monthly Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Most Reported Problem Categories (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Most Reported Issue Categories
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Breakdown of facilities demand across campus infrastructure
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-brand-500" />
          </div>

          <div className="space-y-3.5">
            {categoryStats.map(cat => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                    {cat.label}
                  </span>
                  <div className="text-slate-500 text-[11px] space-x-2">
                    <span>{cat.count} reports ({cat.percentage}%)</span>
                    <span className="text-emerald-600 font-semibold">• {cat.resolvedCat} resolved</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, cat.percentage)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Resolution Statistics (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Monthly Resolution Stats
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Semester trend performance
              </p>
            </div>
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="space-y-3">
            {monthlyStats.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {item.month}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {item.reported} reported • {item.resolved} resolved
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {item.rate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Recent Completed Repairs Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Public Verification Feed: Recently Completed Maintenance
        </h3>

        <div className="space-y-3">
          {recentPublicResolved.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint && onSelectComplaint(item.id)}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-600">{item.id}</span>
                  <span className="px-2 py-0.2 rounded font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px]">
                    {item.category}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {item.building} • {item.room}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                  {item.title}
                </h4>
                {item.resolutionNotes && (
                  <p className="text-slate-500 text-[11px] truncate">
                    Notes: {item.resolutionNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.feedback && (
                  <span className="text-amber-500 font-bold text-[11px] bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded-lg">
                    ★ {item.feedback.rating}/5 Student Verified
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px]">
                  Resolved
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

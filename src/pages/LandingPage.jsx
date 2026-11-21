import React from 'react';
import {
  Wrench,
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode,
  MapPin,
  TrendingUp,
  Users,
  Building2,
  Cpu,
  BarChart3,
  Search,
  PlusCircle,
  ThumbsUp
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';

export function LandingPage({ setActivePage, onSelectComplaint }) {
  const { publicStats, complaints } = useComplaints();
  const { user } = useAuth();

  const recentResolved = complaints.filter(c => c.status === 'Resolved').slice(0, 3);

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-50/80 via-white to-slate-50 dark:from-brand-950/30 dark:via-[#090d16] dark:to-[#070b14] border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-12 lg:p-16 text-center space-y-8 shadow-sm">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-500/10 blur-[120px] pointer-events-none rounded-full"></div>

        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-brand-200/80 dark:border-brand-900/60 shadow-xs text-xs font-semibold text-brand-700 dark:text-brand-300">
          <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse"></span>
          <span>Next-Gen Smart Campus Infrastructure Platform</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Report It. Track It.{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Fix It.
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            FixMyCampus bridges the gap between students, faculty, maintenance crews, and administrators. 
            Resolve broken fans, leaks, Wi-Fi drops, and lab failures with automated SLAs and live transparency.
          </p>
        </div>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActivePage('report')}
            className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>REPORT A PROBLEM</span>
          </button>

          <button
            onClick={() => setActivePage('track')}
            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-brand-600" />
            <span>Track by Complaint ID</span>
          </button>

          <button
            onClick={() => setActivePage('heatmap')}
            className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>Campus Heatmap</span>
          </button>
        </div>

        {/* Live Public Statistics Counters */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {publicStats.total}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Reported Issues</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {publicStats.resolved}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Issues Resolved</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400">
              {publicStats.resolutionRate}%
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Resolution Rate</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {publicStats.avgResolutionHours}h
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Avg Resolution Time</div>
          </div>
        </div>
      </section>

      {/* Campus Problems We Solve */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Comprehensive Campus Problem Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated routing to specialized college departments with strict SLAs
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'Electrical Hazards', desc: 'Broken fans, sparking sockets, flickering lights', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
            { title: 'Plumbing & Water', desc: 'Corridor leaks, water cooler issues, pipe bursts', icon: Droplets, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
            { title: 'Hygiene & Cleanliness', desc: 'Restroom sanitation, full bins, odor complaints', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
            { title: 'Campus Wi-Fi & LAN', desc: 'Router down, authentication drops, lab cables', icon: Wifi, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
            { title: 'Classroom Furniture', desc: 'Broken desks, cracked podiums, sharp metal edges', icon: Building2, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' },
            { title: 'Laboratory Equipment', desc: 'Oscilloscopes, microscopes, apparatus failure', icon: Cpu, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
            { title: 'Civil Infrastructure', desc: 'Stuck fire doors, cracked glass panes, roof leaks', icon: Wrench, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
            { title: 'SLA Escalation Alert', desc: 'Automatic breach alerts sent to Dean on overdue items', icon: Clock, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 shadow-xs hover:shadow-md transition-all space-y-2.5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role-Based Synergy Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>4 Interconnected Roles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How FixMyCampus Connects Everyone
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Student */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                01
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Students
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan QR or report in 30 seconds. Attach photos, track live progress, support existing issues (+1), and rate resolution quality.
              </p>
            </div>
            <button
              onClick={() => setActivePage('student-dashboard')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline pt-2"
            >
              Open Student Portal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Faculty */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-purple-500 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-sm">
                02
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Faculty
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                High-priority reporting for research lab instruments, lecture hall AV, and departmental infrastructure during exam sessions.
              </p>
            </div>
            <button
              onClick={() => setActivePage('faculty-dashboard')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline pt-2"
            >
              Open Faculty Hub <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Maintenance Staff */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                03
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Maintenance Staff
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Technician field app: view assigned orders, update status to In Progress, upload after-repair photographs, and log work notes.
              </p>
            </div>
            <button
              onClick={() => setActivePage('staff-dashboard')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline pt-2"
            >
              Open Staff Dispatch <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Administrator */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-rose-500 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center text-sm">
                04
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Administration
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Campus operations command center: monitor SLA breaches, dispatch departments, balance staff workload, and export CSV reports.
              </p>
            </div>
            <button
              onClick={() => setActivePage('admin-dashboard')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline pt-2"
            >
              Open Admin Control <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Recent Resolution Feed (Public Transparency) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Recent Successfully Resolved Campus Issues
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live transparency ticker (student private data protected)
            </p>
          </div>
          <button
            onClick={() => setActivePage('transparency')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            View Full Transparency Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentResolved.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint && onSelectComplaint(item.id)}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-brand-500/50 cursor-pointer transition-all space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-slate-500">{item.id}</span>
                <span className="px-2 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Resolved
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                {item.title}
              </h4>
              <p className="text-slate-500 text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {item.building} • {item.room}
              </p>
              {item.feedback && (
                <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>★ {item.feedback.rating}/5 Student Rating:</span>
                  <span className="text-slate-600 dark:text-slate-400 truncate italic">
                    "{item.feedback.comment}"
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Hackathon Presentation Flow Showcase */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Hackathon Demonstration Flow (100% Working End-to-End)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 font-bold flex items-center justify-center text-[11px]">
              1
            </span>
            <h4 className="font-bold text-white text-sm">Student Reports</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Alex logs broken fan in Room 203. Smart Duplicate check verifies no existing ticket, AI improves description, generates FC-2026-0001.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 font-bold flex items-center justify-center text-[11px]">
              2
            </span>
            <h4 className="font-bold text-white text-sm">Admin Triage</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Dean Sterling sees incoming electrical hazard. Sets Urgent priority, dispatches to Electrical Wing (Marcus Vance).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-2">
            <span className="w-6 h-6 rounded-full bg-purple-600 font-bold flex items-center justify-center text-[11px]">
              3
            </span>
            <h4 className="font-bold text-white text-sm">Staff Fixes Issue</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Marcus updates status to In Progress, replaces regulator, uploads completion photograph, marks Resolved with work notes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 font-bold flex items-center justify-center text-[11px]">
              4
            </span>
            <h4 className="font-bold text-white text-sm">Feedback & Stats</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Alex receives notification, gives 5-star rating. Public dashboard and campus heatmap dynamically update with live stats.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs border-t border-slate-800 text-slate-400">
          <span>Use the floating controller at the bottom to switch accounts instantly.</span>
          <button
            onClick={() => setActivePage('report')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-colors"
          >
            Start Demonstration Now →
          </button>
        </div>
      </section>
    </div>
  );
}

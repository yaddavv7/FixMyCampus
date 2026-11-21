import React, { useState } from 'react';
import {
  FlaskConical,
  PlusCircle,
  Clock,
  Wrench,
  CheckCircle2,
  Tv,
  Cpu,
  Search,
  Filter,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { ComplaintCard } from '../components/complaints/ComplaintCard';

export function FacultyDashboard({ setActivePage, onSelectComplaint }) {
  const { complaints } = useComplaints();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Filter complaints reported by faculty or lab/classroom related
  const facultyComplaints = complaints.filter(c => {
    if (user?.role === 'faculty') {
      return c.reporterRole === 'faculty' || c.reporterId === user.id || c.category === 'Laboratory';
    }
    return c.category === 'Laboratory' || c.reporterRole === 'faculty';
  });

  const labIssues = facultyComplaints.filter(c => c.category === 'Laboratory').length;
  const activeIssues = facultyComplaints.filter(c => c.status !== 'Resolved').length;
  const resolvedIssues = facultyComplaints.filter(c => c.status === 'Resolved').length;

  const filtered = facultyComplaints.filter(c => {
    if (activeFilter === 'ACTIVE') return c.status !== 'Resolved';
    if (activeFilter === 'RESOLVED') return c.status === 'Resolved';
    if (activeFilter === 'LAB') return c.category === 'Laboratory';
    return true;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Faculty Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-brand-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Faculty Laboratory & Classroom Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Faculty Hub: {user?.name || 'Dr. Sarah Sharma'}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Report urgent laboratory instrument failures, high-voltage cell defects, and classroom AV disruptions. Direct priority dispatch to campus technicians.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => setActivePage('report')}
            className="px-5 py-3.5 rounded-2xl bg-white text-purple-800 hover:bg-purple-50 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-purple-700" />
            <span>LOG LAB DEFECT</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveFilter('ALL')}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border cursor-pointer transition-all ${
            activeFilter === 'ALL' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="text-xs text-slate-500 block mb-1">Total Faculty Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {facultyComplaints.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Research & class tickets</p>
        </div>

        <div
          onClick={() => setActiveFilter('ACTIVE')}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border cursor-pointer transition-all ${
            activeFilter === 'ACTIVE' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="text-xs text-amber-600 dark:text-amber-400 block mb-1">Active / In Progress</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {activeIssues}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Under repair</p>
        </div>

        <div
          onClick={() => setActiveFilter('LAB')}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border cursor-pointer transition-all ${
            activeFilter === 'LAB' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="text-xs text-indigo-600 dark:text-indigo-400 block mb-1">Lab Equipment Items</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {labIssues}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Oscilloscopes, sensors, routers</p>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Departmental & Laboratory Complaints ({filtered.length})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${activeFilter === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('ACTIVE')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${activeFilter === 'ACTIVE' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter('RESOLVED')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${activeFilter === 'RESOLVED' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Resolved
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(c => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              onSelect={onSelectComplaint}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

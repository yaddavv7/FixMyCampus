import React, { useState } from 'react';
import {
  PlusCircle,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  User,
  Star,
  MapPin
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { FeedbackModal } from '../components/complaints/FeedbackModal';
import { ReopenModal } from '../components/complaints/ReopenModal';

export function StudentDashboard({ setActivePage, onSelectComplaint }) {
  const { complaints, submitComplaintFeedback, reopen } = useComplaints();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('ALL'); // ALL | PENDING | IN_PROGRESS | RESOLVED
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [reopenTargetComplaint, setReopenTargetComplaint] = useState(null);

  // Filter complaints related to this student (or demo student Alex Chen)
  const studentComplaints = complaints.filter(c => {
    if (user?.role === 'student') {
      return c.reporterId === user.id || c.reporterEmail === user.email || (user.id === 'user_alex_chen' && c.reporterId === 'user_alex_chen');
    }
    return true; // if testing as admin/faculty, show all
  });

  const totalSubmitted = studentComplaints.length;
  const pendingCount = studentComplaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgressCount = studentComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = studentComplaints.filter(c => c.status === 'Resolved').length;

  const filteredComplaints = studentComplaints.filter(c => {
    if (activeTab === 'PENDING') {
      if (c.status !== 'Submitted' && c.status !== 'Under Review') return false;
    } else if (activeTab === 'IN_PROGRESS') {
      if (c.status !== 'In Progress' && c.status !== 'Assigned' && c.status !== 'Reopened') return false;
    } else if (activeTab === 'RESOLVED') {
      if (c.status !== 'Resolved') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchRoom = c.room.toLowerCase().includes(q);
      const matchBuilding = c.building.toLowerCase().includes(q);
      return matchTitle || matchId || matchRoom || matchBuilding;
    }
    return true;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 text-white shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <User className="w-3.5 h-3.5" />
            <span>Student Maintenance Portal • {user?.department || 'Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Report broken infrastructure in classrooms, dorms, and labs. All tickets are tracked live with campus SLA guarantees.
          </p>
        </div>

        {/* Prominent REPORT A PROBLEM button */}
        <button
          onClick={() => setActivePage('report')}
          className="px-6 py-4 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 font-black text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 shrink-0 group"
        >
          <PlusCircle className="w-5 h-5 text-brand-600 group-hover:rotate-90 transition-transform duration-300" />
          <span>REPORT A PROBLEM</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Submitted */}
        <div
          onClick={() => setActiveTab('ALL')}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border cursor-pointer transition-all ${
            activeTab === 'ALL'
              ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
              : 'border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Submitted</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              {totalSubmitted}
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalSubmitted}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">All tickets filed</p>
        </div>

        {/* Pending */}
        <div
          onClick={() => setActiveTab('PENDING')}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border cursor-pointer transition-all ${
            activeTab === 'PENDING'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
              : 'border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 mb-2">
            <span>Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting dispatch</p>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border cursor-pointer transition-all ${
            activeTab === 'IN_PROGRESS'
              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
              : 'border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 mb-2">
            <span>In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
            {inProgressCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Technician assigned</p>
        </div>

        {/* Resolved */}
        <div
          onClick={() => setActiveTab('RESOLVED')}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border cursor-pointer transition-all ${
            activeTab === 'RESOLVED'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
              : 'border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 mb-2">
            <span>Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {resolvedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Completed repairs</p>
        </div>
      </div>

      {/* Complaints List Section */}
      <div className="space-y-4">
        {/* Controls Bar: Search & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All My Complaints' },
              { id: 'PENDING', label: `Pending (${pendingCount})` },
              { id: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` },
              { id: 'RESOLVED', label: `Resolved (${resolvedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, room, or title..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                No complaints found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? 'No tickets match your search query. Try clearing the search bar.'
                  : 'You have no tickets in this status category.'}
              </p>
            </div>
            <button
              onClick={() => setActivePage('report')}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
            >
              Report a Problem
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredComplaints.map(complaint => (
              <div key={complaint.id} className="flex flex-col">
                <ComplaintCard
                  complaint={complaint}
                  onSelect={onSelectComplaint}
                />
                {/* If resolved and not rated yet, show inline rate CTA */}
                {complaint.status === 'Resolved' && !complaint.feedback && (
                  <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-900 dark:text-amber-200">
                      ★ Rate this repair resolution
                    </span>
                    <button
                      onClick={() => setFeedbackComplaint(complaint)}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px]"
                    >
                      Give Feedback
                    </button>
                  </div>
                )}
                {/* If resolved and fixed was false, allow reopen */}
                {complaint.status === 'Resolved' && complaint.feedback && !complaint.feedback.wasFixed && (
                  <div className="mt-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-900 dark:text-rose-200">
                      Still broken? Reopen ticket
                    </span>
                    <button
                      onClick={() => setReopenTargetComplaint(complaint)}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]"
                    >
                      Reopen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <FeedbackModal
        isOpen={Boolean(feedbackComplaint)}
        complaint={feedbackComplaint}
        onClose={() => setFeedbackComplaint(null)}
        onSubmitFeedback={submitComplaintFeedback}
        onReopen={(c) => setReopenTargetComplaint(c)}
      />

      <ReopenModal
        isOpen={Boolean(reopenTargetComplaint)}
        complaint={reopenTargetComplaint}
        onClose={() => setReopenTargetComplaint(null)}
        onReopenSubmit={reopen}
      />
    </div>
  );
}

import React, { useState } from 'react';
import {
  Shield,
  Download,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { AssignModal } from '../components/complaints/AssignModal';
import { exportComplaintsToCSV } from '../services/exportCsv';
import { CATEGORIES, PRIORITIES, DEPARTMENTS } from '../data/campusLocations';
import { DEMO_USERS } from '../data/demoUsers';

export function AdminDashboard({ setActivePage, onSelectComplaint }) {
  const { complaints, publicStats, changePriority, assignToStaff } = useComplaints();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [selectedComplaintForAssign, setSelectedComplaintForAssign] = useState(null);

  // Compute staff workload
  const staffWorkload = DEMO_USERS.filter(u => u.role === 'staff').map(staff => {
    const assigned = complaints.filter(c => c.assignedStaffId === staff.id && c.status !== 'Resolved');
    const resolved = complaints.filter(c => c.assignedStaffId === staff.id && c.status === 'Resolved');
    return {
      ...staff,
      activeCount: assigned.length,
      resolvedCount: resolved.length
    };
  });

  const overdueComplaints = complaints.filter(c => c.isOverdue && c.status !== 'Resolved');

  const filteredComplaints = complaints.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchRoom = c.room.toLowerCase().includes(q);
      const matchBuilding = c.building.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchRoom && !matchBuilding) return false;
    }

    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'OVERDUE') {
        if (!c.isOverdue || c.status === 'Resolved') return false;
      } else if (c.status !== filterStatus) {
        return false;
      }
    }
    if (filterPriority !== 'ALL' && c.priority !== filterPriority) return false;

    return true;
  });

  return (
    <div className="space-y-8 py-6 text-xs">
      {/* Admin Executive Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <span>Directorate of Campus Operations • Executive Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Admin Dashboard: {user?.name || 'Dean Robert Sterling'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Campus-wide maintenance oversight, automated SLA enforcement, department dispatch, and facility health telemetry.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => exportComplaintsToCSV(complaints)}
            className="px-4 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT CSV REPORT</span>
          </button>
        </div>
      </div>

      {/* 5 High-Level KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {/* Total Complaints */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
          <span className="text-[11px] text-slate-500 block mb-1">Total Complaints</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {publicStats.total}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Campus-wide lifetime</p>
        </div>

        {/* Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block mb-1">Pending Triage</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {publicStats.pending}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Needs assignment</p>
        </div>

        {/* In Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 block mb-1">Under Active Work</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
            {publicStats.inProgress}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">With field technicians</p>
        </div>

        {/* Overdue (SLA Breaches) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900/60 shadow-xs bg-rose-50/20">
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold block mb-1 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Overdue (SLA Breach)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {overdueComplaints.length}
          </div>
          <p className="text-[10px] text-rose-500 mt-1">High priority escalations</p>
        </div>

        {/* Resolved & Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mb-1">Resolved (Rate)</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {publicStats.resolved} <span className="text-xs text-slate-400">({publicStats.resolutionRate}%)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Avg: {publicStats.avgResolutionHours} hrs</p>
        </div>
      </div>

      {/* Staff Workload & Performance Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-brand-600" />
          Field Staff Workload & Dispatch Distribution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEPARTMENTS.slice(0, 3).map(dept => {
            const deptCount = complaints.filter(c => c.assignedDepartment === dept.name && c.status !== 'Resolved').length;
            return (
              <div key={dept.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{dept.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                    {deptCount} Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Department Lead: <strong className="text-slate-700 dark:text-slate-300">{dept.lead}</strong>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, deptCount * 25)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complaint Management Table & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Campus Complaints Master Control Table
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Live updates • Assign staff • Override priorities • Track SLA deadlines
            </p>
          </div>

          <button
            onClick={() => exportComplaintsToCSV(filteredComplaints)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered ({filteredComplaints.length})</span>
          </button>
        </div>

        {/* Filters Ribbon */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, room, or title..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Reopened">Reopened</option>
            <option value="OVERDUE">🚨 Overdue Breaches</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Datatable */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Problem & Category</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assigned To</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No complaints matching current filter.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* ID */}
                    <td className="p-3.5 font-mono font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                      {c.id}
                      {c.isOverdue && c.status !== 'Resolved' && (
                        <span className="block text-[9px] font-sans font-bold text-rose-600 uppercase">
                          SLA Breach
                        </span>
                      )}
                    </td>

                    {/* Title & Category */}
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {c.title}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {c.category} • ~{c.affectedCount} affected
                      </span>
                    </td>

                    {/* Location */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {c.building}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Floor {c.floor} • {c.room}
                      </span>
                    </td>

                    {/* Priority Override Dropdown */}
                    <td className="p-3.5 whitespace-nowrap">
                      <select
                        value={c.priority}
                        onChange={(e) => changePriority(c.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border-0 ${
                          c.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          c.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {PRIORITIES.map(p => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        c.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        c.status === 'Reopened' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Assigned */}
                    <td className="p-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {c.assignedStaffName ? (
                        <div>
                          <strong className="block text-slate-900 dark:text-white">{c.assignedStaffName}</strong>
                          <span className="text-[10px] text-slate-400">{c.assignedDepartment}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedComplaintForAssign(c)}
                          className="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold text-[11px]"
                        >
                          Dispatch
                        </button>
                        <button
                          onClick={() => onSelectComplaint(c.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignModal
        isOpen={Boolean(selectedComplaintForAssign)}
        complaint={selectedComplaintForAssign}
        onClose={() => setSelectedComplaintForAssign(null)}
        onAssignSubmit={assignToStaff}
      />
    </div>
  );
}

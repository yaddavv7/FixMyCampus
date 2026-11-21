import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  SlidersHorizontal,
  MapPin,
  Calendar
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { CATEGORIES, CAMPUS_BUILDINGS } from '../data/campusLocations';

export function TrackComplaintsPage({ onSelectComplaint, setActivePage }) {
  const { complaints } = useComplaints();

  const [searchIdQuery, setSearchIdQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Direct ID search result helper
  const exactMatch = searchIdQuery.trim().toUpperCase().startsWith('FC-')
    ? complaints.find(c => c.id.toUpperCase() === searchIdQuery.trim().toUpperCase())
    : null;

  const filtered = complaints.filter(c => {
    // ID or keyword search
    if (searchIdQuery.trim()) {
      const q = searchIdQuery.toLowerCase().trim();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchRoom = c.room.toLowerCase().includes(q);
      const matchBuilding = c.building.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchRoom && !matchBuilding) return false;
    }

    // Category filter
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;

    // Building filter
    if (selectedBuilding !== 'ALL' && c.building !== selectedBuilding) return false;

    // Status filter
    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'OVERDUE') {
        if (!c.isOverdue || c.status === 'Resolved') return false;
      } else if (c.status !== selectedStatus) {
        return false;
      }
    }

    // Priority filter
    if (selectedPriority !== 'ALL' && c.priority !== selectedPriority) return false;

    return true;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold">
          <Search className="w-3.5 h-3.5" />
          <span>Universal Ticket Tracking Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Track Campus Complaints
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Search by Complaint ID (e.g., <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold">FC-2026-0001</code>) or filter by category, location, and resolution status.
        </p>
      </div>

      {/* Prominent Search Bar */}
      <div className="relative">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-lg flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-brand-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchIdQuery}
              onChange={(e) => setSearchIdQuery(e.target.value)}
              placeholder="Enter Complaint ID (e.g. FC-2026-0001) or search by room, keywords..."
              className="w-full pl-12 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>
          {searchIdQuery && (
            <button
              onClick={() => setSearchIdQuery('')}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Exact ID Match Spotlight Card */}
      {exactMatch && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-xl space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <span className="font-mono font-black text-sm bg-white/20 px-3 py-1 rounded-full">
              {exactMatch.id} • EXACT MATCH FOUND
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-brand-700">
              {exactMatch.status}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black">{exactMatch.title}</h3>
            <p className="text-white/80 text-xs mt-1">
              {exactMatch.building} • {exactMatch.room} • Reported {new Date(exactMatch.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => onSelectComplaint(exactMatch.id)}
            className="px-5 py-2.5 rounded-xl bg-white text-brand-700 font-bold text-xs hover:bg-brand-50 shadow-md flex items-center gap-2"
          >
            <span>View Full Visual Timeline & Resolution Notes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Ribbon */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Building Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Building:</span>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Buildings</option>
              {CAMPUS_BUILDINGS.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Reopened">Reopened</option>
              <option value="OVERDUE">🚨 Overdue SLA Breach</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500">
          Showing <strong>{filtered.length}</strong> of {complaints.length} tickets
        </div>
      </div>

      {/* Complaints Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              No matching complaints found
            </h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or resetting filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(c => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              onSelect={onSelectComplaint}
            />
          ))}
        </div>
      )}
    </div>
  );
}

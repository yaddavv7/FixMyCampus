import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  Droplets,
  Sparkles,
  Armchair,
  Wifi,
  FlaskConical,
  HardHat,
  AlertCircle,
  Eye,
  User
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, PRIORITIES } from '../../data/campusLocations';

export function ComplaintCard({ complaint, onSelect, onAssign, onUpdateStatus }) {
  const { upvote } = useComplaints();
  const { user, isAdmin, isStaff } = useAuth();
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Electrical': return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'Plumbing': return <Droplets className="w-3.5 h-3.5 text-blue-500" />;
      case 'Cleanliness': return <Sparkles className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Furniture': return <Armchair className="w-3.5 h-3.5 text-orange-500" />;
      case 'Internet': return <Wifi className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Laboratory': return <FlaskConical className="w-3.5 h-3.5 text-purple-500" />;
      case 'Infrastructure': return <HardHat className="w-3.5 h-3.5 text-rose-500" />;
      default: return <AlertCircle className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60';
      case 'Reopened':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500 text-white';
      case 'High':
        return 'bg-orange-500 text-white';
      case 'Medium':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  const hasUpvoted = complaint.upvoterIds?.includes(user?.id);

  return (
    <>
      <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-brand-500/40 transition-all flex flex-col justify-between relative overflow-hidden">
        {/* Overdue Glow Strip if overdue */}
        {complaint.isOverdue && complaint.status !== 'Resolved' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500"></div>
        )}

        <div>
          {/* Top Bar: ID, Category, Priority, Overdue indicator */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                {complaint.id}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {getCategoryIcon(complaint.category)}
                {complaint.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {complaint.isOverdue && complaint.status !== 'Resolved' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                  OVERDUE
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(complaint.id)}
            className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors mb-2"
          >
            {complaint.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {complaint.description}
          </p>

          {/* Location & Image Preview */}
          <div className="flex items-start justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 mb-3 text-xs">
            <div className="space-y-1 text-slate-600 dark:text-slate-400 min-w-0">
              <div className="flex items-center gap-1 font-medium truncate">
                <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{complaint.building}</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-4.5">
                Floor {complaint.floor} • <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.room}</span>
              </p>
            </div>

            {/* Photo Thumbnail */}
            {complaint.imageUrl && (
              <div
                onClick={() => setIsPhotoOpen(true)}
                className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer hover:opacity-90 relative group"
                title="View attached photograph"
              >
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Status badge, Upvote count, Detail CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(complaint.status)}`}>
              {complaint.status}
            </span>

            {/* Upvote button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                upvote(complaint.id);
              }}
              title="Endorse this issue (+1 Me Too)"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                hasUpvoted
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-brand-600' : ''}`} />
              <span>{complaint.upvotes || 0}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {isAdmin && !complaint.assignedStaffId && complaint.status !== 'Resolved' && onAssign && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAssign(complaint);
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800"
              >
                Assign
              </button>
            )}

            {isStaff && complaint.status !== 'Resolved' && onUpdateStatus && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(complaint);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800"
              >
                Update
              </button>
            )}

            <button
              onClick={() => onSelect(complaint.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="View full details and timeline"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Photo Modal */}
      {isPhotoOpen && (
        <div
          onClick={() => setIsPhotoOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2 shadow-2xl">
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="p-3 text-white flex items-center justify-between text-xs">
              <span className="font-semibold">{complaint.title} ({complaint.id})</span>
              <button
                onClick={() => setIsPhotoOpen(false)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

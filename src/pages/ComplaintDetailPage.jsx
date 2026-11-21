import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ThumbsUp,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  User,
  Wrench,
  Camera,
  RotateCcw,
  Star,
  Send,
  UserCheck,
  Building2,
  Calendar,
  Share2,
  Eye
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { ComplaintTimeline } from '../components/complaints/ComplaintTimeline';
import { FeedbackModal } from '../components/complaints/FeedbackModal';
import { ReopenModal } from '../components/complaints/ReopenModal';
import { AssignModal } from '../components/complaints/AssignModal';
import { PRIORITIES } from '../data/campusLocations';

export function ComplaintDetailPage({ complaintId, onBack, setActivePage }) {
  const { complaints, updateComplaintStatus, changePriority, reopen, submitComplaintFeedback, upvote, assignToStaff } = useComplaints();
  const { user, isAdmin, isStaff } = useAuth();

  const complaint = complaints.find(c => c.id.toUpperCase() === (complaintId || '').trim().toUpperCase());

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isReopenOpen, setIsReopenOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  // Staff resolution form state
  const [resolutionNote, setResolutionNote] = useState('');
  const [completionPhotoPreview, setCompletionPhotoPreview] = useState('');
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [fullPhotoUrl, setFullPhotoUrl] = useState('');

  if (!complaint) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Complaint Not Found</h2>
        <p className="text-xs text-slate-500">The ticket ID "{complaintId}" does not exist in our system.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const hasUpvoted = complaint.upvoterIds?.includes(user?.id);

  // Handle completion photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompletionPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResolveByStaff = (e) => {
    e.preventDefault();
    if (!resolutionNote.trim()) {
      alert('Please add work notes explaining the repair.');
      return;
    }
    updateComplaintStatus(complaint.id, {
      newStatus: 'Resolved',
      note: resolutionNote,
      completionImageUrl: completionPhotoPreview || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    });
    setIsStaffFormOpen(false);
    setResolutionNote('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 text-xs">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Support / Upvote */}
          <button
            onClick={() => upvote(complaint.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              hasUpvoted
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-brand-600' : ''}`} />
            <span>I have this issue too ({complaint.upvotes || 0})</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Overdue Banner if overdue */}
        {complaint.isOverdue && complaint.status !== 'Resolved' && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200">
            <div className="flex items-center gap-2.5 font-bold">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
              <span>SLA BREACH ALERT: This ticket has exceeded its {complaint.slaHours}h service deadline and is flagged OVERDUE.</span>
            </div>
            <span className="text-[10px] uppercase font-black bg-rose-600 text-white px-2 py-0.5 rounded-full">
              Escalated to Dean
            </span>
          </div>
        )}

        {/* Header Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full text-xs">
                {complaint.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                {complaint.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-white ${
                complaint.priority === 'Urgent' ? 'bg-rose-500' :
                complaint.priority === 'High' ? 'bg-orange-500' : 'bg-amber-500'
              }`}>
                {complaint.priority} Priority
              </span>
              <span className={`px-3 py-0.5 rounded-full font-bold ${
                complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                complaint.status === 'Reopened' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
              }`}>
                {complaint.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {complaint.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                {complaint.building} • Floor {complaint.floor} • {complaint.room}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(complaint.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
              <span>•</span>
              <span>Affected: ~{complaint.affectedCount || 1} people</span>
            </div>
          </div>

          {/* Quick Action Buttons for Admin or Staff */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isAdmin && (
              <>
                <button
                  onClick={() => setIsAssignOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Staff</span>
                </button>

                {/* Priority Override */}
                <select
                  value={complaint.priority}
                  onChange={(e) => changePriority(complaint.id, e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  title="Override Priority"
                >
                  {PRIORITIES.map(p => (
                    <option key={p.id} value={p.id}>Priority: {p.label}</option>
                  ))}
                </select>
              </>
            )}

            {isStaff && complaint.status !== 'Resolved' && (
              <button
                onClick={() => setIsStaffFormOpen(!isStaffFormOpen)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Work Completed</span>
              </button>
            )}

            {complaint.status === 'Resolved' && !complaint.feedback && (
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Rate Resolution</span>
              </button>
            )}

            {complaint.status === 'Resolved' && (
              <button
                onClick={() => setIsReopenOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reopen</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm">
          {complaint.description}
        </div>

        {/* Assigned Department & Staff Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Assigned Department</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {complaint.assignedDepartment || 'Pending Administrative Assignment'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Field Technician</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {complaint.assignedStaffName || 'Unassigned (General Wing Pool)'}
              </span>
            </div>
          </div>
        </div>

        {/* Photos Grid: Initial Evidence + Completion Photo */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
            Photographic Evidence
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Initial photo */}
            {complaint.imageUrl && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  Reported Issue Photo (Initial)
                </span>
                <div
                  onClick={() => setFullPhotoUrl(complaint.imageUrl)}
                  className="h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer relative group"
                >
                  <img
                    src={complaint.imageUrl}
                    alt="Problem evidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity">
                    <Eye className="w-5 h-5 mr-1" /> Click to enlarge
                  </div>
                </div>
              </div>
            )}

            {/* Completion photo */}
            {complaint.completionImageUrl && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Work Completed Photo (After Repair)
                </span>
                <div
                  onClick={() => setFullPhotoUrl(complaint.completionImageUrl)}
                  className="h-48 rounded-2xl overflow-hidden border border-emerald-300 dark:border-emerald-800 cursor-pointer relative group"
                >
                  <img
                    src={complaint.completionImageUrl}
                    alt="Completion evidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity">
                    <Eye className="w-5 h-5 mr-1" /> Click to enlarge
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resolution Notes & Student Feedback Cards */}
        {complaint.resolutionNotes && (
          <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 space-y-1">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Technician Resolution Work Notes:
            </span>
            <p className="text-emerald-900 dark:text-emerald-200 text-xs leading-relaxed">
              {complaint.resolutionNotes}
            </p>
          </div>
        )}

        {complaint.feedback && (
          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  Student Verification & Rating
                </span>
                <div className="flex items-center text-amber-500">
                  {[...Array(complaint.feedback.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                complaint.feedback.wasFixed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {complaint.feedback.wasFixed ? 'Problem Confirmed Fixed' : 'Problem NOT Fixed'}
              </span>
            </div>
            <p className="text-amber-900 dark:text-amber-200 italic text-xs">
              "{complaint.feedback.comment}"
            </p>
          </div>
        )}

        {/* Staff Complete Work Form (Expandable) */}
        {isStaffFormOpen && (
          <form onSubmit={handleResolveByStaff} className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-4">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-600" />
              Complete Work Order & Log Work Notes
            </h4>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Technician Work Notes *
              </label>
              <textarea
                rows={3}
                required
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Explain what components were replaced (e.g. replaced fan regulator switch, tested voltage)..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Completion Photo (After repair)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsStaffFormOpen(false)}
                className="px-4 py-2 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Confirm Resolution
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Visual Complaint Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600" />
            Complete Activity History & Visual Timeline
          </h3>
          <span className="text-[11px] text-slate-400">
            {complaint.timeline?.length || 1} events logged
          </span>
        </div>

        <ComplaintTimeline
          timeline={complaint.timeline}
          currentStatus={complaint.status}
        />
      </div>

      {/* Lightbox / Zoom Photo Modal */}
      {fullPhotoUrl && (
        <div
          onClick={() => setFullPhotoUrl('')}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2">
            <img src={fullPhotoUrl} alt="Inspection" className="w-full max-h-[85vh] object-contain rounded-xl" />
            <div className="p-3 text-right">
              <button onClick={() => setFullPhotoUrl('')} className="px-4 py-1.5 bg-white/20 text-white rounded-lg text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        complaint={complaint}
        onSubmitFeedback={submitComplaintFeedback}
        onReopen={() => setIsReopenOpen(true)}
      />

      <ReopenModal
        isOpen={isReopenOpen}
        onClose={() => setIsReopenOpen(false)}
        complaint={complaint}
        onReopenSubmit={reopen}
      />

      <AssignModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        complaint={complaint}
        onAssignSubmit={assignToStaff}
      />
    </div>
  );
}

import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  Upload,
  AlertTriangle,
  User,
  ArrowRight,
  ShieldCheck,
  Star,
  Check
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { ComplaintCard } from '../components/complaints/ComplaintCard';

export function StaffDashboard({ setActivePage, onSelectComplaint }) {
  const { complaints, updateComplaintStatus } = useComplaints();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('ASSIGNED'); // ASSIGNED | IN_PROGRESS | COMPLETED
  const [selectedTaskForResolve, setSelectedTaskForResolve] = useState(null);
  const [workNotes, setWorkNotes] = useState('');
  const [completionPhotoPreview, setCompletionPhotoPreview] = useState('');

  // Filter tasks assigned to current technician (or demo user Marcus Vance)
  const myTasks = complaints.filter(c => {
    if (user?.role === 'staff') {
      return c.assignedStaffId === user.id || c.assignedDepartment?.toLowerCase().includes('electrical') || user.id === 'user_marcus_vance';
    }
    return c.assignedStaffId !== null;
  });

  const assignedTasks = myTasks.filter(c => c.status === 'Assigned');
  const inProgressTasks = myTasks.filter(c => c.status === 'In Progress' || c.status === 'Reopened');
  const completedTasks = myTasks.filter(c => c.status === 'Resolved');

  const filteredTasks = activeTab === 'ASSIGNED'
    ? assignedTasks
    : activeTab === 'IN_PROGRESS'
    ? inProgressTasks
    : completedTasks;

  // Handle starting work (Move from Assigned to In Progress)
  const handleStartWork = (taskId) => {
    updateComplaintStatus(taskId, {
      newStatus: 'In Progress',
      note: `Field technician ${user?.name || 'Marcus Vance'} arrived on site and initiated diagnostics.`
    });
  };

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

  const handleCompleteTask = (e) => {
    e.preventDefault();
    if (!workNotes.trim()) {
      alert('Please enter technician work notes.');
      return;
    }

    updateComplaintStatus(selectedTaskForResolve.id, {
      newStatus: 'Resolved',
      note: workNotes,
      completionImageUrl: completionPhotoPreview || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    });

    setSelectedTaskForResolve(null);
    setWorkNotes('');
    setCompletionPhotoPreview('');
  };

  return (
    <div className="space-y-8 py-6">
      {/* Staff Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5" />
            <span>Campus Facilities & Maintenance Field Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Field Technician: {user?.name || 'Marcus Vance'}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            {user?.department || 'Electrical & Power Systems Wing'} • Staff ID: {user?.staffId || 'MNT-ELEC-04'}. Inspect work orders, update progress, and submit proof-of-work completion photos.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
          <span className="text-[11px] text-white/80 block">Active Workload</span>
          <span className="text-3xl font-black">{assignedTasks.length + inProgressTasks.length}</span>
          <span className="text-[10px] text-emerald-300 block mt-0.5">Tasks In Queue</span>
        </div>
      </div>

      {/* 3 Status Workspace Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('ASSIGNED')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'ASSIGNED'
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 mb-1 font-bold">
            <span>New Work Orders</span>
            <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center">
              {assignedTasks.length}
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{assignedTasks.length}</p>
          <span className="text-[11px] text-slate-400">Needs technician arrival</span>
        </button>

        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 mb-1 font-bold">
            <span>In Progress / Reopened</span>
            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center">
              {inProgressTasks.length}
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{inProgressTasks.length}</p>
          <span className="text-[11px] text-slate-400">Under active repair</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 mb-1 font-bold">
            <span>Completed Repairs</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center">
              {completedTasks.length}
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{completedTasks.length}</p>
          <span className="text-[11px] text-slate-400">Verified & rated by students</span>
        </button>
      </div>

      {/* Task Queue List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
          {activeTab === 'ASSIGNED' ? 'New Work Orders Awaiting Start' :
           activeTab === 'IN_PROGRESS' ? 'Active In-Progress Field Tasks' : 'Completed Maintenance History'}
        </h3>

        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">No tasks in this category</h4>
            <p className="text-xs text-slate-500">Your queue for this category is currently clear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map(task => (
              <div key={task.id} className="flex flex-col space-y-2">
                <ComplaintCard
                  complaint={task}
                  onSelect={onSelectComplaint}
                />

                {/* Staff Quick Action Bar */}
                {task.status === 'Assigned' && (
                  <button
                    onClick={() => handleStartWork(task.id)}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Start Work (Move to In Progress)</span>
                  </button>
                )}

                {(task.status === 'In Progress' || task.status === 'Reopened') && (
                  <button
                    onClick={() => setSelectedTaskForResolve(task)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Work & Upload Photo</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Staff Completion Modal */}
      {selectedTaskForResolve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Mark Repair Completed: {selectedTaskForResolve.id}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedTaskForResolve.building} • {selectedTaskForResolve.room}
                </p>
              </div>
              <button onClick={() => setSelectedTaskForResolve(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteTask} className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Resolution Notes * (Required)
                </label>
                <textarea
                  rows={3}
                  required
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  placeholder="Detail work performed: e.g. replaced defective fan regulator, checked wiring insulation, tested rotation."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Upload Completion Photograph (After Repair)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs"
                />
                {completionPhotoPreview && (
                  <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-200">
                    <img src={completionPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForResolve(null)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm & Close Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

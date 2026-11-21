import React, { useState } from 'react';
import { UserCheck, X, Briefcase, User, Send } from 'lucide-react';
import { DEPARTMENTS } from '../../data/campusLocations';
import { DEMO_USERS } from '../../data/demoUsers';

export function AssignModal({ isOpen, onClose, complaint, onAssignSubmit }) {
  const [department, setDepartment] = useState(DEPARTMENTS[0].name);
  const [staffId, setStaffId] = useState('user_marcus_vance');

  if (!isOpen || !complaint) return null;

  const staffMembers = DEMO_USERS.filter(u => u.role === 'staff');

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedStaff = DEMO_USERS.find(u => u.id === staffId);
    onAssignSubmit(complaint.id, {
      department,
      staffId: selectedStaff?.id,
      staffName: selectedStaff?.name
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Dispatch Work Order ({complaint.id})
              </h3>
              <p className="text-xs text-slate-500">{complaint.building} • {complaint.room}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-brand-500" />
              Target Maintenance Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.name}>{d.name} (Lead: {d.lead})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-500" />
              Assign Field Technician / Specialist
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {staffMembers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department} • Active Tasks: {s.activeTasksCount || 3})
                </option>
              ))}
              <option value="">-- General Department Pool (No individual) --</option>
            </select>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
            <strong>Work Order Dispatch Note:</strong> Assigning sends a push notification to both the field technician and the student reporter.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

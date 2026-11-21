import React from 'react';
import { X, CheckCheck, Bell, AlertTriangle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';

export function NotificationModal({ isOpen, onClose, onSelectComplaint }) {
  const { notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead } = useComplaints();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'escalation':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'resolved':
      case 'resolution':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden mt-14 sm:mt-16 mr-0 sm:mr-4">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                Notifications
                {unreadNotificationsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {unreadNotificationsCount} new
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Live complaint alerts & SLA escalations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="p-1.5 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 text-xs flex items-center gap-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Read all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No notifications yet. You're all caught up!
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.complaintId && onSelectComplaint) {
                    onSelectComplaint(notif.complaintId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                  notif.read
                    ? 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 opacity-75'
                    : 'border-brand-200/80 dark:border-brand-900/50 bg-brand-50/40 dark:bg-brand-950/20 shadow-xs'
                } hover:border-brand-400 hover:shadow-sm`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {notif.complaintId && (
                        <span className="font-mono text-brand-600 dark:text-brand-400 flex items-center gap-0.5 hover:underline">
                          {notif.complaintId} <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

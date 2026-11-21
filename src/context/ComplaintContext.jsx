import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  getStoredComplaints,
  createComplaint as storageCreateComplaint,
  assignComplaint as storageAssignComplaint,
  updateStatus as storageUpdateStatus,
  reopenComplaint as storageReopenComplaint,
  submitFeedback as storageSubmitFeedback,
  upvoteComplaint as storageUpvoteComplaint,
  getStoredNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  checkAndTriggerSlaEscalations,
  resetToDemoData,
  updateComplaint
} from '../services/storage';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

const ComplaintContext = createContext();

export function ComplaintProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [complaints, setComplaints] = useState(() => getStoredComplaints());
  const [notifications, setNotifications] = useState(() => getStoredNotifications());

  // Periodically check for SLA escalations (every 30 seconds)
  useEffect(() => {
    const runSlaCheck = () => {
      const updated = checkAndTriggerSlaEscalations();
      setComplaints(updated);
      setNotifications(getStoredNotifications());
    };

    runSlaCheck();
    const interval = setInterval(runSlaCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync notifications on mount and changes
  const refreshData = useCallback(() => {
    setComplaints(getStoredComplaints());
    setNotifications(getStoredNotifications());
  }, []);

  // Filtered notifications for active user
  const userNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter(n => {
      const matchesRole = !n.targetRole || n.targetRole === user.role;
      const matchesUser = !n.targetUserId || n.targetUserId === user.id;
      return matchesRole && matchesUser;
    });
  }, [notifications, user]);

  const unreadCount = useMemo(() => {
    return userNotifications.filter(n => !n.read).length;
  }, [userNotifications]);

  // SMART DUPLICATE DETECTION
  // Checks if similar unresolved issues already exist in the same building & room or same category
  const findDuplicates = useCallback((building, room, category, title = '') => {
    if (!building || !room) return [];

    const normBuilding = building.trim().toLowerCase();
    const normRoom = room.trim().toLowerCase();
    const normCategory = (category || '').trim().toLowerCase();
    const normTitle = (title || '').trim().toLowerCase();

    return complaints.filter(c => {
      // Must be an active unresolved issue
      if (c.status === 'Resolved') return false;

      const sameBuilding = c.building.toLowerCase() === normBuilding;
      const sameRoom = c.room.toLowerCase() === normRoom;
      const sameCategory = normCategory && c.category.toLowerCase() === normCategory;

      // Match conditions:
      // 1. Exact same room in same building
      // 2. Or same building, category, and matching title keywords
      if (sameBuilding && sameRoom) {
        return true;
      }
      if (sameBuilding && sameCategory && normTitle.length > 5) {
        const titleWords = normTitle.split(/\s+/).filter(w => w.length > 3);
        const matchCount = titleWords.filter(w => c.title.toLowerCase().includes(w)).length;
        if (matchCount >= 2) return true;
      }

      return false;
    });
  }, [complaints]);

  // Submit Complaint
  const addComplaint = useCallback((formData) => {
    const created = storageCreateComplaint(formData);
    refreshData();

    // Trigger celebration confetti for successful report submission!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {}

    addToast({
      title: 'Complaint Registered!',
      message: `Your ticket has been logged with ID ${created.id}.`,
      type: 'success'
    });

    return created;
  }, [refreshData, addToast]);

  // Update Status (e.g. In Progress, Resolved)
  const updateComplaintStatus = useCallback((id, { newStatus, note, completionImageUrl }) => {
    const updated = storageUpdateStatus(id, {
      newStatus,
      note,
      actorName: user?.name || 'Staff Member',
      actorRole: user?.role || 'staff',
      completionImageUrl
    });
    refreshData();

    if (newStatus === 'Resolved') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    addToast({
      title: `Status: ${newStatus}`,
      message: `Complaint ${id} has been moved to ${newStatus}.`,
      type: newStatus === 'Resolved' ? 'success' : 'info'
    });

    return updated;
  }, [user, refreshData, addToast]);

  // Assign Complaint (Admin)
  const assignToStaff = useCallback((id, { department, staffId, staffName }) => {
    const updated = storageAssignComplaint(id, {
      department,
      staffId,
      staffName,
      adminName: user?.name || 'Dean Robert Sterling'
    });
    refreshData();

    addToast({
      title: 'Work Order Assigned',
      message: `${id} assigned to ${department} (${staffName || 'Staff Member'}).`,
      type: 'success'
    });

    return updated;
  }, [user, refreshData, addToast]);

  // Override Priority (Admin)
  const changePriority = useCallback((id, newPriority) => {
    const updated = updateComplaint(id, { priority: newPriority });
    refreshData();

    addToast({
      title: 'Priority Updated',
      message: `${id} priority changed to ${newPriority}.`,
      type: 'info'
    });

    return updated;
  }, [refreshData, addToast]);

  // Reopen Complaint
  const reopen = useCallback((id, reason) => {
    const updated = storageReopenComplaint(id, {
      reason,
      actorName: user?.name || 'Student Reporter',
      actorRole: user?.role || 'student'
    });
    refreshData();

    addToast({
      title: 'Complaint Reopened',
      message: `Complaint ${id} has been reopened for follow-up inspection.`,
      type: 'warning'
    });

    return updated;
  }, [user, refreshData, addToast]);

  // Submit Feedback
  const submitComplaintFeedback = useCallback((id, { rating, comment, wasFixed }) => {
    const updated = storageSubmitFeedback(id, {
      rating,
      comment,
      wasFixed,
      studentName: user?.name || 'Alex Chen'
    });
    refreshData();

    if (wasFixed) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }

    addToast({
      title: 'Feedback Submitted!',
      message: 'Thank you for helping keep our campus safe and operational.',
      type: 'success'
    });

    return updated;
  }, [user, refreshData, addToast]);

  // Upvote / "I have this issue too"
  const upvote = useCallback((id) => {
    if (!user) {
      addToast({ title: 'Authentication Required', message: 'Please log in to upvote complaints.', type: 'warning' });
      return;
    }
    const updated = storageUpvoteComplaint(id, user.id);
    refreshData();

    addToast({
      title: 'Issue Supported (+1)',
      message: `You endorsed ${id}. High-demand issues receive elevated priority.`,
      type: 'info'
    });
    return updated;
  }, [user, refreshData, addToast]);

  // Notifications read handlers
  const markRead = useCallback((id) => {
    markNotificationRead(id);
    setNotifications(getStoredNotifications());
  }, []);

  const markAllRead = useCallback(() => {
    if (!user) return;
    markAllNotificationsRead(user.role, user.id);
    setNotifications(getStoredNotifications());
    addToast({ title: 'All Caught Up', message: 'Notifications marked as read.', type: 'info' });
  }, [user, addToast]);

  // Hackathon Presentation Helpers
  const simulateSlaEscalation = useCallback(() => {
    // Find an active complaint and turn it overdue immediately
    const active = complaints.find(c => c.status !== 'Resolved' && !c.isOverdue);
    if (active) {
      updateComplaint(active.id, {
        isOverdue: true,
        escalatedAt: new Date().toISOString()
      });
      refreshData();

      addToast({
        title: '🚨 SLA Escalation Triggered',
        message: `${active.id} at ${active.room} simulated overdue. Alert sent to Admin!`,
        type: 'error'
      });
    } else {
      addToast({
        title: 'Simulation Notice',
        message: 'All current active issues are already escalated or resolved.',
        type: 'info'
      });
    }
  }, [complaints, refreshData, addToast]);

  const resetAllDemoData = useCallback(() => {
    resetToDemoData();
    refreshData();
    addToast({
      title: 'Demo Environment Reset',
      message: 'Initial 10 complaints and default state restored.',
      type: 'info'
    });
  }, [refreshData, addToast]);

  // Public Analytics Aggregation (zero PII)
  const publicStats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
    const overdue = complaints.filter(c => c.isOverdue && c.status !== 'Resolved').length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Average resolution time in hours
    const resolvedItems = complaints.filter(c => c.status === 'Resolved');
    let totalHours = 0;
    resolvedItems.forEach(c => {
      const start = new Date(c.createdAt).getTime();
      const end = new Date(c.updatedAt).getTime();
      totalHours += Math.max(1, (end - start) / (3600 * 1000));
    });
    const avgResolutionHours = resolvedItems.length > 0
      ? (totalHours / resolvedItems.length).toFixed(1)
      : '16.5';

    // Category breakdown
    const categoryCounts = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // Building breakdown
    const buildingCounts = {};
    complaints.forEach(c => {
      buildingCounts[c.building] = (buildingCounts[c.building] || 0) + 1;
    });

    return {
      total,
      resolved,
      pending,
      inProgress,
      overdue,
      resolutionRate: rate,
      avgResolutionHours,
      categoryCounts,
      buildingCounts
    };
  }, [complaints]);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        notifications: userNotifications,
        unreadNotificationsCount: unreadCount,
        publicStats,
        addComplaint,
        updateComplaintStatus,
        assignToStaff,
        changePriority,
        reopen,
        submitComplaintFeedback,
        upvote,
        findDuplicates,
        markNotificationRead: markRead,
        markAllNotificationsRead: markAllRead,
        simulateSlaEscalation,
        resetAllDemoData,
        refreshData
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) throw new Error('useComplaints must be used within ComplaintProvider');
  return context;
}

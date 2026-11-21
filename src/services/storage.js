// LocalStorage Persistent Engine for FixMyCampus (100% interactive Demo Mode)
import { INITIAL_COMPLAINTS } from '../data/initialComplaints';
import { DEMO_USERS } from '../data/demoUsers';

const STORAGE_KEYS = {
  COMPLAINTS: 'fmc_complaints_v1',
  NOTIFICATIONS: 'fmc_notifications_v1',
  CURRENT_USER: 'fmc_current_user_v1',
  CUSTOM_USERS: 'fmc_custom_users_v1',
  FIREBASE_CONFIG: 'fmc_firebase_config_v1',
  COUNTER: 'fmc_complaint_counter_v1'
};

// Initialize initial storage if empty
export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.COUNTER, '11');
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0])); // default: Alex Chen (Student)
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    const initialNotifications = [
      {
        id: 'notif_1',
        complaintId: 'FC-2026-0001',
        title: 'Technician on Site',
        message: 'Marcus Vance started work on your complaint (FC-2026-0001) in Room 203.',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        read: false,
        targetRole: 'student',
        targetUserId: 'user_alex_chen',
        type: 'status_update'
      },
      {
        id: 'notif_2',
        complaintId: 'FC-2026-0001',
        title: '⚠️ SLA Breach Escalation',
        message: 'Complaint FC-2026-0001 (Electrical) has exceeded 12-hour resolution SLA and is marked OVERDUE.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        read: false,
        targetRole: 'admin',
        type: 'escalation'
      },
      {
        id: 'notif_3',
        complaintId: 'FC-2026-0007',
        title: 'Task Resolved & Rated',
        message: 'Restroom 102 exhaust repair completed with a 5-star student rating!',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        read: true,
        targetRole: 'staff',
        targetUserId: 'user_marcus_vance',
        type: 'resolution'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
}

// Generate sequential unique ID: FC-2026-0001 format
export function generateComplaintId() {
  let counter = parseInt(localStorage.getItem(STORAGE_KEYS.COUNTER) || '11', 10);
  const year = new Date().getFullYear();
  const padded = String(counter).padStart(4, '0');
  localStorage.setItem(STORAGE_KEYS.COUNTER, String(counter + 1));
  return `FC-${year}-${padded}`;
}

// Complaints CRUD
export function getStoredComplaints() {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return raw ? JSON.parse(raw) : INITIAL_COMPLAINTS;
  } catch (e) {
    console.error('Error parsing stored complaints', e);
    return INITIAL_COMPLAINTS;
  }
}

export function saveStoredComplaints(complaints) {
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  return complaints;
}

export function getComplaintById(id) {
  const all = getStoredComplaints();
  return all.find(c => c.id.toUpperCase() === id.trim().toUpperCase()) || null;
}

export function createComplaint(complaintData) {
  const all = getStoredComplaints();
  const id = generateComplaintId();
  const now = new Date().toISOString();

  const newComplaint = {
    id,
    title: complaintData.title,
    description: complaintData.description,
    category: complaintData.category,
    building: complaintData.building,
    buildingCode: complaintData.buildingCode || 'CAMPUS',
    floor: parseInt(complaintData.floor || '1', 10),
    room: complaintData.room,
    priority: complaintData.priority || 'Medium',
    status: 'Submitted',
    isAnonymous: Boolean(complaintData.isAnonymous),
    reporterId: complaintData.isAnonymous ? 'user_anonymous' : complaintData.reporterId,
    reporterName: complaintData.isAnonymous ? 'Anonymous Reporter' : complaintData.reporterName,
    reporterEmail: complaintData.isAnonymous ? 'anonymous@fixmycampus.local' : complaintData.reporterEmail,
    reporterRole: complaintData.reporterRole || 'student',
    affectedCount: parseInt(complaintData.affectedCount || '1', 10),
    assignedDepartment: null,
    assignedStaffId: null,
    assignedStaffName: null,
    imageUrl: complaintData.imageUrl || '',
    createdAt: now,
    updatedAt: now,
    slaHours: complaintData.slaHours || 24,
    isOverdue: false,
    upvotes: 1,
    upvoterIds: complaintData.isAnonymous ? [] : [complaintData.reporterId],
    timeline: [
      {
        id: `t_${Date.now()}`,
        status: 'Submitted',
        title: complaintData.isAnonymous ? 'Anonymous Complaint Submitted' : 'Complaint Submitted',
        actor: complaintData.isAnonymous ? 'Anonymous Student' : complaintData.reporterName,
        role: complaintData.reporterRole || 'student',
        note: complaintData.description.slice(0, 100) + '...',
        timestamp: now
      }
    ],
    resolutionNotes: '',
    completionImageUrl: '',
    feedback: null
  };

  const updated = [newComplaint, ...all];
  saveStoredComplaints(updated);

  // Trigger admin notification
  addNotification({
    complaintId: id,
    title: 'New Complaint Registered',
    message: `${newComplaint.category} issue reported at ${newComplaint.building} (${newComplaint.room}): "${newComplaint.title}"`,
    targetRole: 'admin',
    type: 'new_complaint'
  });

  return newComplaint;
}

export function updateComplaint(id, updates) {
  const all = getStoredComplaints();
  const index = all.findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = all[index];
  const updatedComplaint = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  all[index] = updatedComplaint;
  saveStoredComplaints(all);
  return updatedComplaint;
}

export function assignComplaint(id, { department, staffId, staffName, adminName }) {
  const all = getStoredComplaints();
  const index = all.findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = all[index];
  const now = new Date().toISOString();

  const timelineEntry = {
    id: `t_${Date.now()}`,
    status: 'Assigned',
    title: 'Work Order Dispatched',
    actor: adminName || 'Campus Administration',
    role: 'admin',
    note: `Assigned to ${department}${staffName ? ` (${staffName})` : ''}`,
    timestamp: now
  };

  const updatedComplaint = {
    ...current,
    status: 'Assigned',
    assignedDepartment: department,
    assignedStaffId: staffId || null,
    assignedStaffName: staffName || null,
    updatedAt: now,
    timeline: [...current.timeline, timelineEntry]
  };

  all[index] = updatedComplaint;
  saveStoredComplaints(all);

  // Notify student
  if (!current.isAnonymous && current.reporterId) {
    addNotification({
      complaintId: id,
      title: 'Complaint Assigned',
      message: `Your complaint (${id}) has been assigned to ${department}.`,
      targetUserId: current.reporterId,
      targetRole: 'student',
      type: 'assigned'
    });
  }

  // Notify staff if assigned to specific person
  if (staffId) {
    addNotification({
      complaintId: id,
      title: 'New Work Order Assigned to You',
      message: `You were assigned: ${current.title} at ${current.building} (${current.room}).`,
      targetUserId: staffId,
      targetRole: 'staff',
      type: 'assigned'
    });
  }

  return updatedComplaint;
}

export function updateStatus(id, { newStatus, note, actorName, actorRole, completionImageUrl }) {
  const all = getStoredComplaints();
  const index = all.findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = all[index];
  const now = new Date().toISOString();

  const timelineEntry = {
    id: `t_${Date.now()}`,
    status: newStatus,
    title: `Status updated to ${newStatus}`,
    actor: actorName,
    role: actorRole,
    note: note || `Issue moved to ${newStatus}.`,
    timestamp: now
  };

  const updates = {
    status: newStatus,
    updatedAt: now,
    timeline: [...current.timeline, timelineEntry]
  };

  if (newStatus === 'Resolved') {
    if (note) updates.resolutionNotes = note;
    if (completionImageUrl) updates.completionImageUrl = completionImageUrl;
  }

  const updatedComplaint = {
    ...current,
    ...updates
  };

  all[index] = updatedComplaint;
  saveStoredComplaints(all);

  // Notify reporter
  if (!current.isAnonymous && current.reporterId) {
    addNotification({
      complaintId: id,
      title: newStatus === 'Resolved' ? '✅ Complaint Resolved!' : `Status Update: ${newStatus}`,
      message: newStatus === 'Resolved' 
        ? `Your issue at ${current.building} has been marked as resolved. Please provide your feedback!`
        : `Your complaint (${id}) is now ${newStatus}. Note: ${note || 'Technician on duty.'}`,
      targetUserId: current.reporterId,
      targetRole: 'student',
      type: newStatus === 'Resolved' ? 'resolved' : 'status_update'
    });
  }

  return updatedComplaint;
}

export function reopenComplaint(id, { reason, actorName, actorRole }) {
  const all = getStoredComplaints();
  const index = all.findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = all[index];
  const now = new Date().toISOString();

  const timelineEntry = {
    id: `t_${Date.now()}`,
    status: 'Reopened',
    title: 'Complaint Reopened',
    actor: actorName,
    role: actorRole,
    note: reason,
    timestamp: now
  };

  const updatedComplaint = {
    ...current,
    status: 'Reopened',
    updatedAt: now,
    timeline: [...current.timeline, timelineEntry]
  };

  all[index] = updatedComplaint;
  saveStoredComplaints(all);

  // Alert admin and assigned staff
  addNotification({
    complaintId: id,
    title: '⚠️ Complaint Reopened by Student',
    message: `${id} (${current.room}): "${reason}"`,
    targetRole: 'admin',
    type: 'reopened'
  });

  if (current.assignedStaffId) {
    addNotification({
      complaintId: id,
      title: 'Complaint Reopened for Re-work',
      message: `${id} was reopened: ${reason}`,
      targetUserId: current.assignedStaffId,
      targetRole: 'staff',
      type: 'reopened'
    });
  }

  return updatedComplaint;
}

export function submitFeedback(id, { rating, comment, wasFixed, studentName }) {
  const all = getStoredComplaints();
  const index = all.findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = all[index];
  const now = new Date().toISOString();

  const feedbackObj = {
    rating: parseInt(rating, 10),
    comment,
    wasFixed: Boolean(wasFixed),
    studentName: studentName || 'Student',
    submittedAt: now
  };

  const updatedComplaint = {
    ...current,
    feedback: feedbackObj,
    updatedAt: now
  };

  all[index] = updatedComplaint;
  saveStoredComplaints(all);

  // If was not fixed, offer notification
  if (!wasFixed) {
    addNotification({
      complaintId: id,
      title: 'Negative Feedback on Resolved Issue',
      message: `Student rated ${rating}★ on ${id} stating problem was NOT fixed: "${comment}"`,
      targetRole: 'admin',
      type: 'negative_feedback'
    });
  }

  return updatedComplaint;
}

export function upvoteComplaint(id, userId) {
  const all = getStoredComplaints();
  const index = all.findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = all[index];
  const upvoterIds = current.upvoterIds || [];
  const alreadyUpvoted = upvoterIds.includes(userId);

  const updatedUpvoterIds = alreadyUpvoted
    ? upvoterIds.filter(uid => uid !== userId)
    : [...upvoterIds, userId];

  const updated = {
    ...current,
    upvotes: updatedUpvoterIds.length,
    upvoterIds: updatedUpvoterIds
  };

  all[index] = updated;
  saveStoredComplaints(all);
  return updated;
}

// Notifications API
export function getStoredNotifications() {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredNotifications(notifs) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  return notifs;
}

export function addNotification(data) {
  const all = getStoredNotifications();
  const newNotif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    read: false,
    ...data
  };
  const updated = [newNotif, ...all].slice(0, 50); // keep last 50
  saveStoredNotifications(updated);
  return newNotif;
}

export function markNotificationRead(id) {
  const all = getStoredNotifications();
  const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
  saveStoredNotifications(updated);
  return updated;
}

export function markAllNotificationsRead(userRole, userId) {
  const all = getStoredNotifications();
  const updated = all.map(n => {
    const matchesRole = !n.targetRole || n.targetRole === userRole;
    const matchesUser = !n.targetUserId || n.targetUserId === userId;
    if (matchesRole && matchesUser) {
      return { ...n, read: true };
    }
    return n;
  });
  saveStoredNotifications(updated);
  return updated;
}

// Automatic SLA Escalation Checker
export function checkAndTriggerSlaEscalations() {
  const all = getStoredComplaints();
  let hasChanges = false;
  const now = Date.now();

  const updated = all.map(c => {
    if (c.status === 'Resolved') return c;

    const createdTime = new Date(c.createdAt).getTime();
    const elapsedHours = (now - createdTime) / (3600 * 1000);
    const slaLimit = c.slaHours || 24;

    if (elapsedHours > slaLimit && !c.isOverdue) {
      hasChanges = true;
      // Trigger notification once
      addNotification({
        complaintId: c.id,
        title: `🚨 Escalation Alert: ${c.id} Overdue`,
        message: `${c.category} complaint in ${c.building} (${c.room}) has breached its ${slaLimit}h SLA limit.`,
        targetRole: 'admin',
        type: 'escalation'
      });

      return {
        ...c,
        isOverdue: true,
        escalatedAt: new Date().toISOString()
      };
    }
    return c;
  });

  if (hasChanges) {
    saveStoredComplaints(updated);
  }
  return updated;
}

// Reset data to default initial seed
export function resetToDemoData() {
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  localStorage.setItem(STORAGE_KEYS.COUNTER, '11');
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  initStorage();
  return INITIAL_COMPLAINTS;
}

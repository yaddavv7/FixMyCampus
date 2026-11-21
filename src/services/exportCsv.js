// Export complaints data to CSV for Administrators

export function exportComplaintsToCSV(complaints) {
  if (!complaints || complaints.length === 0) {
    alert('No complaints to export.');
    return;
  }

  const headers = [
    'Complaint ID',
    'Title',
    'Category',
    'Building',
    'Floor',
    'Room',
    'Priority',
    'Status',
    'Is Overdue',
    'Reporter Name',
    'Reporter Email',
    'Reporter Role',
    'Assigned Department',
    'Assigned Staff',
    'Created At',
    'Updated At',
    'Upvotes',
    'Feedback Rating',
    'Fixed Confirmed'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = complaints.map(c => [
    escapeCSV(c.id),
    escapeCSV(c.title),
    escapeCSV(c.category),
    escapeCSV(c.building),
    escapeCSV(c.floor),
    escapeCSV(c.room),
    escapeCSV(c.priority),
    escapeCSV(c.status),
    escapeCSV(c.isOverdue ? 'YES' : 'NO'),
    escapeCSV(c.isAnonymous ? 'Anonymous' : c.reporterName),
    escapeCSV(c.isAnonymous ? 'N/A' : c.reporterEmail),
    escapeCSV(c.reporterRole),
    escapeCSV(c.assignedDepartment || 'Unassigned'),
    escapeCSV(c.assignedStaffName || 'Unassigned'),
    escapeCSV(new Date(c.createdAt).toLocaleString()),
    escapeCSV(new Date(c.updatedAt).toLocaleString()),
    escapeCSV(c.upvotes || 0),
    escapeCSV(c.feedback ? `${c.feedback.rating} / 5` : 'N/A'),
    escapeCSV(c.feedback ? (c.feedback.wasFixed ? 'YES' : 'NO') : 'N/A')
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FixMyCampus_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

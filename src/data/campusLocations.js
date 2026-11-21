// Campus Locations and infrastructure database
export const CAMPUS_BUILDINGS = [
  {
    id: 'ramanujan',
    name: 'Ramanujan Science Block',
    code: 'RSB',
    floors: [1, 2, 3, 4],
    rooms: ['Room 101', 'Room 108', 'Room 203', 'Room 204', 'Physics Lab 301', 'Chemistry Lab 302', 'Seminar Hall RSB'],
    coordinates: { x: 22, y: 35 }, // percentage on map
    icon: 'Atom',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'turing',
    name: 'Turing Computer Center',
    code: 'TCC',
    floors: [1, 2, 3],
    rooms: ['Lab 1A (Systems)', 'Lab 1B (Networks)', 'Lab 2A (AI & ML)', 'Lab 2B (Web Dev)', 'Lab 3A (Cloud)', 'Lab 3B (Hardware)', 'Server Room TCC'],
    coordinates: { x: 48, y: 25 },
    icon: 'Cpu',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'library',
    name: 'Central Library & Media Hub',
    code: 'CLB',
    floors: [1, 2, 3],
    rooms: ['Ground Floor Reading Room', 'Digital Archive 102', 'Corridor 2nd Floor', 'Reference Section 201', 'Discussion Pod 3', 'E-Library Lab'],
    coordinates: { x: 75, y: 30 },
    icon: 'BookOpen',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'apj_auditorium',
    name: 'APJ Abdul Kalam Auditorium',
    code: 'AKA',
    floors: [1, 2],
    rooms: ['Main Stage & AV Room', 'LH-01 (Lecture Hall 1)', 'LH-04 (Lecture Hall 4)', 'VIP Lounge', 'Balcony Seating A'],
    coordinates: { x: 30, y: 68 },
    icon: 'Tv',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'sarabhai',
    name: 'Vikram Sarabhai Engineering Block',
    code: 'VSE',
    floors: [1, 2, 3, 4, 5],
    rooms: ['CAD/CAM Lab 105', 'Circuit Design Lab 202', 'Lab 402 (Robotics & IoT)', 'Faculty Cabins 4B', 'High-Voltage Testing Cell'],
    coordinates: { x: 62, y: 65 },
    icon: 'Wrench',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'mechanical',
    name: 'Mechanical Workshops & Powerhouse',
    code: 'MWP',
    floors: [1, 2],
    rooms: ['Foundry & Welding Bay', 'CNC Machining Center', 'Near Staircase B Water Cooler', 'Hydraulics Workshop 104'],
    coordinates: { x: 82, y: 72 },
    icon: 'Cog',
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 'activity_center',
    name: 'Student Activity Center (SAC)',
    code: 'SAC',
    floors: [1, 2],
    rooms: ['Indoor Sports Arena', 'Cafeteria Main Hall', 'Washroom 102 (West Wing)', 'Robotics Club Hub', 'Music Studio 204'],
    coordinates: { x: 18, y: 82 },
    icon: 'Users',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'admin_complex',
    name: 'Main Administrative Complex',
    code: 'MAC',
    floors: [1, 2, 3],
    rooms: ['Dean Office Suite', 'Registrar Hall 101', 'Accounts Section 105', 'Exit Gate 3 & Foyer', 'Senate Conference Room'],
    coordinates: { x: 50, y: 88 },
    icon: 'Building2',
    color: 'from-slate-600 to-slate-800'
  }
];

export const CATEGORIES = [
  { id: 'Electrical', label: 'Electrical', icon: 'Zap', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50', defaultSlaHours: 12 },
  { id: 'Plumbing', label: 'Plumbing', icon: 'Droplets', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50', defaultSlaHours: 24 },
  { id: 'Cleanliness', label: 'Cleanliness', icon: 'Sparkles', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50', defaultSlaHours: 12 },
  { id: 'Furniture', label: 'Furniture', icon: 'Armchair', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/50', defaultSlaHours: 48 },
  { id: 'Internet', label: 'Internet & Wi-Fi', icon: 'Wifi', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/50', defaultSlaHours: 12 },
  { id: 'Laboratory', label: 'Laboratory Equipment', icon: 'FlaskConical', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50', defaultSlaHours: 36 },
  { id: 'Infrastructure', label: 'Infrastructure', icon: 'HardHat', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50', defaultSlaHours: 48 },
  { id: 'Other', label: 'Other Issues', icon: 'AlertCircle', color: 'text-slate-500 bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/50', defaultSlaHours: 48 },
];

export const PRIORITIES = [
  { id: 'Urgent', label: 'Urgent', color: 'bg-rose-500 text-white', border: 'border-rose-500', maxHours: 12 },
  { id: 'High', label: 'High', color: 'bg-orange-500 text-white', border: 'border-orange-500', maxHours: 24 },
  { id: 'Medium', label: 'Medium', color: 'bg-amber-500 text-white', border: 'border-amber-500', maxHours: 48 },
  { id: 'Low', label: 'Low', color: 'bg-emerald-500 text-white', border: 'border-emerald-500', maxHours: 72 },
];

export const STATUS_STEPS = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
];

export const DEPARTMENTS = [
  { id: 'electrical_wing', name: 'Electrical & Power Systems Wing', lead: 'Marcus Vance' },
  { id: 'plumbing_sanitation', name: 'Plumbing & Water Management', lead: 'David K. Miller' },
  { id: 'civil_infra', name: 'Civil Works & Carpentry', lead: 'Carlos Santana' },
  { id: 'it_network', name: 'IT Infrastructure & Campus Networks', lead: 'Priya Narang' },
  { id: 'lab_tech', name: 'Scientific Instrument & Lab Tech', lead: 'Dr. Anand Kumar' },
  { id: 'housekeeping', name: 'Sanitation & Campus Cleanliness', lead: 'Lakshmi Nair' },
];

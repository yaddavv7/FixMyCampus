// Predefined Hackathon Demo Accounts
export const DEMO_USERS = [
  {
    id: 'user_alex_chen',
    name: 'Alex Chen',
    email: 'alex.chen@campus.edu',
    password: 'password123',
    role: 'student',
    studentId: 'STU-2024-8842',
    department: 'Computer Science & Engineering',
    year: 'Year 3, Semester 6',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 392-1084',
    badge: 'Student Council Rep',
    bio: 'Passionate about coding, AI club president, and campus sustainability enthusiast.'
  },
  {
    id: 'user_sarah_sharma',
    name: 'Dr. Sarah Sharma',
    email: 'sarah.sharma@campus.edu',
    password: 'password123',
    role: 'faculty',
    staffId: 'FAC-ENG-104',
    department: 'Electronics & Communication',
    title: 'Associate Professor & Lab In-Charge',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 782-9901',
    badge: 'Faculty Senate Member',
    bio: 'Oversees Advanced Robotics & IoT Research Lab. Focused on hardware safety and high-tech campus infrastructure.'
  },
  {
    id: 'user_marcus_vance',
    name: 'Marcus Vance',
    email: 'marcus.vance@facilities.campus.edu',
    password: 'password123',
    role: 'staff',
    staffId: 'MNT-ELEC-04',
    department: 'Electrical & Power Systems Wing',
    title: 'Senior Campus Electrician & Field Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 441-2099',
    badge: 'Certified Master Electrician',
    activeTasksCount: 3,
    bio: '12 years maintaining campus high-voltage systems, substations, classroom ventilation and solar arrays.'
  },
  {
    id: 'user_robert_sterling',
    name: 'Dean Robert Sterling',
    email: 'dean.sterling@campus.edu',
    password: 'password123',
    role: 'admin',
    staffId: 'ADM-DIR-001',
    department: 'Office of Campus Operations & Infrastructure',
    title: 'Director & Campus Administrative Dean',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 902-3310',
    badge: 'Executive Admin (Level 4)',
    bio: 'Directs college capital projects, maintenance budgets, facilities safety inspections, and institutional SLAs.'
  }
];

export const ROLE_CONFIG = {
  student: {
    label: 'Student',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    homePath: '/student/dashboard',
    canReport: true,
    canAssign: false,
    canResolve: false,
  },
  faculty: {
    label: 'Faculty Member',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    homePath: '/faculty/dashboard',
    canReport: true,
    canAssign: false,
    canResolve: false,
  },
  staff: {
    label: 'Maintenance Staff',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    homePath: '/staff/dashboard',
    canReport: false,
    canAssign: false,
    canResolve: true,
  },
  admin: {
    label: 'Administrator',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    homePath: '/admin/dashboard',
    canReport: true,
    canAssign: true,
    canResolve: true,
  }
};

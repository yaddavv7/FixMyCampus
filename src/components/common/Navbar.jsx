import React, { useState } from 'react';
import {
  Wrench,
  Bell,
  Menu,
  X,
  PlusCircle,
  Search,
  MapPin,
  QrCode,
  BarChart3,
  User,
  LogOut,
  Shield,
  Layers,
  ChevronDown,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { ThemeToggle } from './ThemeToggle';
import { NotificationModal } from './NotificationModal';

export function Navbar({ activePage, setActivePage, onOpenFirebaseModal, onSelectComplaint }) {
  const { user, role, logout } = useAuth();
  const { unreadNotificationsCount } = useComplaints();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getDashboardPath = () => {
    switch (role) {
      case 'admin': return 'admin-dashboard';
      case 'staff': return 'staff-dashboard';
      case 'faculty': return 'faculty-dashboard';
      default: return 'student-dashboard';
    }
  };

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: getDashboardPath(), label: 'Dashboard' },
    { id: 'track', label: 'Track Issues' },
    { id: 'heatmap', label: 'Heatmap' },
    { id: 'qr', label: 'QR Scan' },
    { id: 'transparency', label: 'Transparency' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                Report It. Track It. Fix It.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Mode Badge */}
            <button
              onClick={onOpenFirebaseModal}
              title="Click to view Backend & Firebase configuration"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
            >
              <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Demo Mode</span>
            </button>

            {/* Quick Report Button */}
            {(role === 'student' || role === 'faculty' || role === 'admin' || !user) && (
              <button
                onClick={() => setActivePage('report')}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/20 hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Report a Problem</span>
                <span className="sm:hidden">Report</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(true)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/60 transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-500/30"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    onClick={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs animate-fade-in"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 capitalize">
                        {user.role} Account
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => setActivePage(getDashboardPath())}
                        className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2"
                      >
                        <Layers className="w-4 h-4 text-brand-500" />
                        <span>Go to {user.role.toUpperCase()} Dashboard</span>
                      </button>
                      <button
                        onClick={() => setActivePage('profile')}
                        className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile & Settings</span>
                      </button>
                      <button
                        onClick={onOpenFirebaseModal}
                        className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2"
                      >
                        <Database className="w-4 h-4 text-cyan-500" />
                        <span>Backend Config</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setActivePage('login');
                        }}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('login')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => setActivePage('register')}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] px-4 pt-3 pb-6 space-y-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  activePage === link.id
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  onOpenFirebaseModal();
                  setIsMobileMenuOpen(false);
                }}
                className="text-slate-500 flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                Backend Status (Demo Mode)
              </button>
              <button
                onClick={() => {
                  setActivePage('about');
                  setIsMobileMenuOpen(false);
                }}
                className="text-brand-600 font-semibold"
              >
                About Platform
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Slide-over Notifications */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onSelectComplaint={onSelectComplaint}
      />
    </>
  );
}

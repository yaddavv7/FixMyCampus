import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoBar } from './components/common/DemoBar';
import { FirebaseConfigModal } from './components/common/FirebaseConfigModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { TrackComplaintsPage } from './pages/TrackComplaintsPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { PublicTransparencyPage } from './pages/PublicTransparencyPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Components
import { CampusHeatmap } from './components/maps/CampusHeatmap';
import { QRCodeGenerator } from './components/qr/QRCodeGenerator';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

function MainApp() {
  const { user, role } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Pre-fill state for QR code reporting
  const [qrPrefill, setQrPrefill] = useState({ building: '', room: '' });

  // Handle URL hash changes on load and popstate
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const [path, queryStr] = hash.split('?');
      const params = new URLSearchParams(queryStr || '');

      if (path === 'report') {
        const b = params.get('building') || '';
        const r = params.get('room') || '';
        if (b || r) {
          setQrPrefill({ building: decodeURIComponent(b), room: decodeURIComponent(r) });
        }
        setActivePage('report');
      } else if (path === 'detail') {
        const id = params.get('id');
        if (id) {
          setSelectedComplaintId(decodeURIComponent(id));
          setActivePage('detail');
        }
      } else if (path) {
        setActivePage(path);
      }
    };

    handleHash();
    window.addEventListener('popstate', handleHash);
    return () => window.removeEventListener('popstate', handleHash);
  }, []);

  // Update hash when activePage or selectedComplaintId changes
  const navigateTo = (page, params = {}) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'detail' && params.id) {
      setSelectedComplaintId(params.id);
      window.location.hash = `detail?id=${params.id}`;
    } else if (page === 'report' && (params.building || params.room)) {
      setQrPrefill({ building: params.building || '', room: params.room || '' });
      window.location.hash = `report?building=${encodeURIComponent(params.building || '')}&room=${encodeURIComponent(params.room || '')}`;
    } else {
      window.location.hash = page;
    }
  };

  const handleSelectComplaint = (id) => {
    navigateTo('detail', { id });
  };

  const handleScanNavigate = (building, room) => {
    navigateTo('report', { building, room });
  };

  const handleReportSuccess = (newId) => {
    navigateTo('detail', { id: newId });
  };

  // Render active page component
  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return (
          <LandingPage
            setActivePage={navigateTo}
            onSelectComplaint={handleSelectComplaint}
          />
        );

      case 'student-dashboard':
        return (
          <StudentDashboard
            setActivePage={navigateTo}
            onSelectComplaint={handleSelectComplaint}
          />
        );

      case 'faculty-dashboard':
        return (
          <FacultyDashboard
            setActivePage={navigateTo}
            onSelectComplaint={handleSelectComplaint}
          />
        );

      case 'staff-dashboard':
        return (
          <StaffDashboard
            setActivePage={navigateTo}
            onSelectComplaint={handleSelectComplaint}
          />
        );

      case 'admin-dashboard':
        return (
          <AdminDashboard
            setActivePage={navigateTo}
            onSelectComplaint={handleSelectComplaint}
          />
        );

      case 'report':
        return (
          <ReportProblemPage
            initialBuilding={qrPrefill.building}
            initialRoom={qrPrefill.room}
            onReportSuccess={handleReportSuccess}
            onSelectComplaint={handleSelectComplaint}
          />
        );

      case 'track':
        return (
          <TrackComplaintsPage
            onSelectComplaint={handleSelectComplaint}
            setActivePage={navigateTo}
          />
        );

      case 'detail':
        return (
          <ComplaintDetailPage
            complaintId={selectedComplaintId}
            onBack={() => {
              if (role === 'admin') navigateTo('admin-dashboard');
              else if (role === 'staff') navigateTo('staff-dashboard');
              else if (role === 'faculty') navigateTo('faculty-dashboard');
              else navigateTo('student-dashboard');
            }}
            setActivePage={navigateTo}
          />
        );

      case 'heatmap':
        return (
          <div className="py-6 space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Campus Facilities Heatmap
              </h1>
              <p className="text-xs text-slate-500">
                Live spatial tracking of unresolved campus problems and critical severity zones.
              </p>
            </div>
            <CampusHeatmap
              onSelectComplaint={handleSelectComplaint}
              onReportInBuilding={(bName) => navigateTo('report', { building: bName })}
            />
          </div>
        );

      case 'qr':
        return (
          <div className="py-6 space-y-6">
            <QRCodeGenerator
              onScanNavigate={handleScanNavigate}
            />
          </div>
        );

      case 'transparency':
        return (
          <PublicTransparencyPage
            setActivePage={navigateTo}
            onSelectComplaint={handleSelectComplaint}
          />
        );

      case 'profile':
        return (
          <ProfilePage
            onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          />
        );

      case 'about':
        return (
          <AboutPage
            onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          />
        );

      case 'login':
        return <LoginPage setActivePage={navigateTo} />;

      case 'register':
        return <RegisterPage setActivePage={navigateTo} />;

      default:
        return <NotFoundPage setActivePage={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={navigateTo}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onSelectComplaint={handleSelectComplaint}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={navigateTo}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
      />

      {/* Persistent Floating Hackathon Presentation Controller */}
      <DemoBar
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
      />

      {/* Firebase Backend Architecture Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ComplaintProvider>
            <MainApp />
          </ComplaintProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

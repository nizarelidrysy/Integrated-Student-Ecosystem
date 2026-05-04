import React from 'react';
import { Calendar, Bell, FileText, UserCheck, ShieldAlert, GraduationCap, LayoutDashboard, FileArchive } from 'lucide-react';

function Sidebar({ currentRole, currentPlatform, activeTab, setActiveTab }) {
  const getNavItems = () => {
    if (currentPlatform === 'community') {
      if (currentRole === 'admin') {
        return [
          { id: 'profile', label: 'Profile', icon: <UserCheck className="nav-icon" /> },
          { id: 'announcements', label: 'Announcements', icon: <Bell className="nav-icon" /> },
          { id: 'directory', label: 'Users Directory', icon: <GraduationCap className="nav-icon" /> },
        ];
      }
      return [
        { id: 'profile', label: 'Profile', icon: <UserCheck className="nav-icon" /> },
        { id: 'offers', label: 'Offers', icon: <LayoutDashboard className="nav-icon" /> },
        { id: 'materials', label: 'Materials', icon: <FileText className="nav-icon" /> },
        { id: 'announcements', label: 'Announcements', icon: <Bell className="nav-icon" /> },
        { id: 'cv_analyzer', label: 'CV Analyzer', icon: <FileArchive className="nav-icon" /> },
      ];
    }

    // Default portal items
    switch(currentRole) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="nav-icon" /> },
          { id: 'calendar', label: 'Calendar', icon: <Calendar className="nav-icon" /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell className="nav-icon" /> },
          { id: 'grades', label: 'Report Cards', icon: <GraduationCap className="nav-icon" /> },
          { id: 'absences', label: 'Absences', icon: <UserCheck className="nav-icon" /> },
          { id: 'documents', label: 'Admin Documents', icon: <FileText className="nav-icon" /> },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="nav-icon" /> },
          { id: 'calendar', label: 'Manage Calendar', icon: <Calendar className="nav-icon" /> },
          { id: 'notifications', label: 'Send Notifications', icon: <Bell className="nav-icon" /> },
          { id: 'grades', label: 'Manage Grades', icon: <FileArchive className="nav-icon" /> },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="nav-icon" /> },
          { id: 'calendar', label: 'Manage Calendar', icon: <Calendar className="nav-icon" /> },
          { id: 'notifications', label: 'Global Notifications', icon: <Bell className="nav-icon" /> },
          { id: 'students', label: 'Manage Students', icon: <GraduationCap className="nav-icon" /> },
          { id: 'validations', label: 'Validations', icon: <ShieldAlert className="nav-icon" /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const userName = currentRole === 'student' ? 'Nizar EL IDRYSY' : currentRole === 'teacher' ? 'Hajar CHABLI' : 'Amjad AHRRAR';
  const platformLabel = currentPlatform === 'community' ? 'Community' : 'Student Portal';

  return (
    <div className="sidebar">
      <div style={{padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem'}}>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem'}}>
          {currentRole} · {platformLabel}
        </div>
        <div style={{fontWeight: 600, fontSize: '1rem'}}>
          {userName}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>

      {/* Credits & Copyright */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderTop: '1px solid var(--border)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
      }}>
        <p style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-main)' }}>PFA <span style={{fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-main)' }}>EMSIGHT</span></p>
        <p style={{ marginBottom: '0.5rem' }}>
          Made by : <a href="https://www.linkedin.com/in/nizarelidrysy/" target="_blank" rel="noopener noreferrer">Nizar EL IDRYSY</a>, Nizar BTIRA,<br />
          Amjad AHRRAR, Hajar CHABLI,<br />
          Owais BAKKALI.
        </p>
        <p style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', fontSize: '0.68rem' }}>
          EMSIGHT © 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Sidebar;

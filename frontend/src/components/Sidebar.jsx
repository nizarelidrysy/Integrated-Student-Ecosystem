import React from 'react';
import { Calendar, Bell, FileText, UserCheck, ShieldAlert, GraduationCap, LayoutDashboard, FileArchive } from 'lucide-react';

function Sidebar({ currentRole, activeTab, setActiveTab }) {
  const getNavItems = () => {
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
          { id: 'notifications', label: 'Global Notifications', icon: <Bell className="nav-icon" /> },
          { id: 'students', label: 'Manage Students', icon: <GraduationCap className="nav-icon" /> },
          { id: 'validations', label: 'Validations', icon: <ShieldAlert className="nav-icon" /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="sidebar">
      <div style={{padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem'}}>
        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>
          {currentRole} Dashboard
        </div>
        <div style={{fontWeight: 600, fontSize: '1.1rem'}}>
          {currentRole === 'student' ? 'Nizar El Idrysy' : currentRole === 'teacher' ? 'Hajar Chabli' : 'Amjad Ahrrar'}
        </div>
      </div>
      
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
  );
}

export default Sidebar;

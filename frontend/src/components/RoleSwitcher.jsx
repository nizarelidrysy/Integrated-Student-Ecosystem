import React from 'react';
import logo from '../assets/logo.png';

function RoleSwitcher({ currentRole, setRole }) {
  return (
    <div className="demo-topbar">
      <div className="demo-brand">
        <img src={logo} alt="EMSIGHT Logo" style={{ height: '64px', marginRight: '0.75rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.2px', color: 'var(--text-main)' }}>EMSIGHT</span>
          <span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.4px' }}>STUDENT PORTAL</span>
        </div>
      </div>
      <div className="role-switcher">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '10px' }}>View as:</span>
        <button className={`role-btn ${currentRole === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>Student</button>
        <button className={`role-btn ${currentRole === 'teacher' ? 'active' : ''}`} onClick={() => setRole('teacher')}>Teacher</button>
        <button className={`role-btn ${currentRole === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</button>
      </div>
    </div>
  );
}

export default RoleSwitcher;

import React from 'react';
import logo from '../assets/logo.png';

function RoleSwitcher({ currentRole, setRole }) {
  return (
    <div className="demo-topbar">
      <div className="demo-brand">
        <img src={logo} alt="EMSIGHT Logo" style={{ height: '44px', marginRight: '0.5rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px', color: 'var(--text-main)' }}>EMSIGHT</span>
          <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Student Portal</span>
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

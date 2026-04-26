import React from 'react';
import logo from '../assets/logo.png';

function RoleSwitcher({ currentRole, setRole }) {
  return (
    <div className="demo-topbar">
      <div className="demo-brand">
        <img src={logo} alt="EMSIGHT Logo" style={{height: '32px'}} /> <span style={{fontWeight: 300, fontSize: '0.9rem', color: 'var(--text-muted)'}}>Student Portal</span>
      </div>
      <div className="role-switcher">
        <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '10px'}}>View as:</span>
        <button 
          className={`role-btn ${currentRole === 'student' ? 'active' : ''}`}
          onClick={() => setRole('student')}
        >
          Student
        </button>
        <button 
          className={`role-btn ${currentRole === 'teacher' ? 'active' : ''}`}
          onClick={() => setRole('teacher')}
        >
          Teacher
        </button>
        <button 
          className={`role-btn ${currentRole === 'admin' ? 'active' : ''}`}
          onClick={() => setRole('admin')}
        >
          Admin
        </button>
      </div>
    </div>
  );
}

export default RoleSwitcher;

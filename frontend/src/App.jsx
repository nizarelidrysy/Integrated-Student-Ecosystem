import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import PlatformSelection from './pages/PlatformSelection';
import EmsiSharePlaceholder from './pages/EmsiSharePlaceholder';
import CommunityStudentDashboard from './pages/CommunityStudentDashboard';
import CommunityAdminDashboard from './pages/CommunityAdminDashboard';
import ChatWidget from './components/ChatWidget';
import api from './api';

function App() {
  const [currentRole, setCurrentRole] = useState(null);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [demoData, setDemoData] = useState(null);
  const [landingKey, setLandingKey] = useState(0);

  useEffect(() => {
    // Fetch initial demo data to verify connection
    api.get('/accounts/users/demo_users/')
      .then(res => {
        setDemoData(res.data);
      })
      .catch(err => console.error("Error fetching demo users", err));
  }, []);

  const handleBackToRoleSelection = () => {
    setCurrentRole(null);
    setCurrentPlatform(null);
    setLandingKey(k => k + 1); // remount to retrigger landing animations
  };

  const handleBackToPlatformSelection = () => {
    setCurrentPlatform(null);
  };

  // When entering community, start on profile
  const handleSetPlatform = (platform) => {
    if (platform === 'community') setActiveTab('profile');
    else setActiveTab('dashboard');
    setCurrentPlatform(platform);
  };

  // If no role is selected, show Landing Page
  if (!currentRole) {
    return <div key={landingKey} className="animate-fade-in"><LandingPage onSelectRole={setCurrentRole} /></div>;
  }

  // If role is selected but platform is not, show Platform Selection
  if (!currentPlatform) {
    return <PlatformSelection 
      currentRole={currentRole} 
      onSelectPlatform={handleSetPlatform} 
      onBack={handleBackToRoleSelection}
    />;
  }

  // Render content based on platform and role
  const renderPlatformContent = () => {
    if (currentPlatform === 'portal') {
      switch (currentRole) {
        case 'student':
          return <StudentDashboard activeTab={activeTab} demoUser={demoData?.student} />;
        case 'teacher':
          return <TeacherDashboard activeTab={activeTab} demoUser={demoData?.teacher} />;
        case 'admin':
          return <AdminDashboard activeTab={activeTab} demoUser={demoData?.admin} />;
        default:
          return <div>Invalid Role</div>;
      }
    } 
    
    if (currentPlatform === 'community') {
      if (currentRole === 'teacher') {
        return <div>Access Denied. Teachers cannot access the community.</div>;
      }
      if (currentRole === 'admin') {
        return <CommunityAdminDashboard demoUser={demoData?.admin} activeTab={activeTab} />;
      }
      return <CommunityStudentDashboard demoUser={demoData?.student} activeTab={activeTab} />;
    }

    if (currentPlatform === 'share') {
      return <EmsiSharePlaceholder />;
    }

    return <div>Invalid Platform</div>;
  };

  return (
    <div className="app-container">
      <div className="demo-topbar">
        <div
          className="demo-brand"
          style={{display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer'}}
          onClick={handleBackToRoleSelection}
          title="Return to login screen"
        >
          <img src="/src/assets/logo.png" alt="EMSIGHT" style={{height: '55px', transition: 'transform 0.2s'}} />
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <span style={{fontWeight: 800, fontSize: '1.4rem', lineHeight: '1.2', color: '#1a1a1a'}}>EMSIGHT</span>
            <span style={{fontWeight: 600, fontSize: '0.85rem', color: '#6b7280', letterSpacing: '0.5px'}}>
              {currentPlatform === 'community' ? 'COMMUNITY' : 'STUDENT PORTAL'}
            </span>
          </div>
        </div>
      </div>

      {(currentPlatform === 'portal' || currentPlatform === 'community') && (
        <Sidebar currentRole={currentRole} currentPlatform={currentPlatform} activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      
      {currentPlatform !== 'role_select' && (
        <div className="main-content">
          <button className="back-nav-btn" onClick={handleBackToPlatformSelection}>
            &larr; Switch Platform
          </button>
          <div className="animate-fade-in" key={`${currentRole}-${currentPlatform}-${activeTab}`}>
            {renderPlatformContent()}
          </div>
        </div>
      )}
      
      {currentPlatform === 'community' && (
        <ChatWidget demoUser={currentRole === 'admin' ? demoData?.admin : demoData?.student} />
      )}
    </div>
  );
}

export default App;

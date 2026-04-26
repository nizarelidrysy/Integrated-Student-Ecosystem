import React, { useState, useEffect } from 'react';
import RoleSwitcher from './components/RoleSwitcher';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import api from './api';

function App() {
  const [currentRole, setCurrentRole] = useState('student');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [demoData, setDemoData] = useState(null);

  useEffect(() => {
    // Reset tab when role changes
    setActiveTab('dashboard');
  }, [currentRole]);

  useEffect(() => {
    // Fetch initial demo data to verify connection
    api.get('/accounts/users/demo_users/')
      .then(res => {
        setDemoData(res.data);
      })
      .catch(err => console.error("Error fetching demo users", err));
  }, []);

  const renderContent = () => {
    switch (currentRole) {
      case 'student':
        return <StudentDashboard activeTab={activeTab} demoUser={demoData?.student} />;
      case 'teacher':
        return <TeacherDashboard activeTab={activeTab} demoUser={demoData?.teacher} />;
      case 'admin':
        return <AdminDashboard activeTab={activeTab} demoUser={demoData?.admin} />;
      default:
        return <div>Select a role</div>;
    }
  };

  return (
    <div className="app-container">
      <RoleSwitcher currentRole={currentRole} setRole={setCurrentRole} />
      <Sidebar currentRole={currentRole} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <div className="animate-fade-in" key={`${currentRole}-${activeTab}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;

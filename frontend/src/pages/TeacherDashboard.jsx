import React, { useState, useEffect } from 'react';
import api from '../api';

function TeacherDashboard({ activeTab, demoUser }) {
  const [calendar, setCalendar] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [reportCards, setReportCards] = useState([]);
  
  // Forms
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start_time: '', end_time: '', event_type: 'Cours' });
  const [newNotif, setNewNotif] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/portal/calendar/').then(res => setCalendar(res.data));
    api.get('/portal/notifications/').then(res => setNotifications(res.data));
    api.get('/portal/absences/').then(res => setAbsences(res.data));
    api.get('/portal/report-cards/').then(res => setReportCards(res.data));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!demoUser) return;
    
    api.post('/portal/calendar/', {
      ...newEvent,
      created_by: demoUser.id
    }).then(() => {
      setNewEvent({ title: '', description: '', start_time: '', end_time: '', event_type: 'Cours' });
      fetchData();
    });
  };

  const handleSendNotif = (e) => {
    e.preventDefault();
    if (!demoUser) return;

    api.post('/portal/notifications/', {
      ...newNotif,
      sender: demoUser.id,
      recipients: [1] // demo hack: sending to student with ID 1
    }).then(() => {
      setNewNotif({ title: '', content: '' });
      fetchData();
    });
  };

  const renderOverview = () => (
    <div className="grid-cards">
      <div className="glass-panel" style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
        <div style={{width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hajar&style=circle&mouth=smile,default&eyebrows=default&eyes=default" alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div>
          <h3 style={{marginBottom: '0.5rem'}}>Teacher Profile</h3>
          {demoUser && demoUser.teacher_profile ? (
            <div>
              <p><strong>Name:</strong> {demoUser.first_name} {demoUser.last_name}</p>
              <p><strong>Matricule:</strong> <span className="badge badge-info">{demoUser.matricule}</span></p>
              <p><strong>Department:</strong> {demoUser.teacher_profile.departement}</p>
              <p><strong>Subject:</strong> {demoUser.teacher_profile.matiere}</p>
            </div>
          ) : <p>Loading...</p>}
        </div>
      </div>
      <div className="glass-panel">
        <h3 style={{marginBottom: '1rem'}}>Quick Actions</h3>
        <button className="btn btn-primary" style={{width: '100%', marginBottom: '0.5rem'}} onClick={() => document.getElementById('notif-tab')?.click()}>Send Announcement</button>
      </div>
    </div>
  );

  const renderCalendar = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
      <div className="grid-cards">
        <div className="glass-panel">
          <h2>Add Calendar Event</h2>
          <form onSubmit={handleAddEvent} style={{marginTop: '1.5rem'}}>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input type="text" className="input-field" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
            </div>
            <div className="input-group">
              <label className="input-label">Type</label>
              <select className="input-field" value={newEvent.event_type} onChange={e => setNewEvent({...newEvent, event_type: e.target.value})}>
                <option value="Cours">Cours</option>
                <option value="TD">TD</option>
                <option value="TP">TP</option>
                <option value="Examen">Examen</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Start Time</label>
              <input type="datetime-local" className="input-field" value={newEvent.start_time} onChange={e => setNewEvent({...newEvent, start_time: e.target.value})} required />
            </div>
            <div className="input-group">
              <label className="input-label">End Time</label>
              <input type="datetime-local" className="input-field" value={newEvent.end_time} onChange={e => setNewEvent({...newEvent, end_time: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary">Add Event</button>
          </form>
        </div>

        <div className="glass-panel">
          <h2>My Weekly Schedule</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginTop: '1.5rem'}}>
            {days.map((day, idx) => (
              <div key={day} style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', background: 'rgba(0,0,0,0.2)'}}>
                <h3 style={{borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', textAlign: 'center'}}>{day}</h3>
                {/* Simulate subjects filling the calendar */}
                {idx === 0 && <div style={{padding: '0.5rem', background: 'rgba(79, 70, 229, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>08:30 - 10:30</strong><br/>Algorithmique</div>}
                {idx === 1 && <div style={{padding: '0.5rem', background: 'rgba(245, 158, 11, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>08:30 - 12:45</strong><br/>Base de Données</div>}
                {idx === 4 && <div style={{padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>10:45 - 12:45</strong><br/>Projet</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="grid-cards">
      <div className="glass-panel">
        <h2>Send Notification</h2>
        <form onSubmit={handleSendNotif} style={{marginTop: '1.5rem'}}>
          <div className="input-group">
            <label className="input-label">Title</label>
            <input type="text" className="input-field" value={newNotif.title} onChange={e => setNewNotif({...newNotif, title: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Content</label>
            <textarea className="input-field" rows={4} value={newNotif.content} onChange={e => setNewNotif({...newNotif, content: e.target.value})} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Send to Students</button>
        </form>
      </div>

      <div className="glass-panel">
        <h2>Sent History</h2>
        <div style={{marginTop: '1.5rem'}}>
          {notifications.filter(n => demoUser && n.sender === demoUser.id).map(n => (
            <div key={n.id} style={{padding: '1rem', borderBottom: '1px solid var(--border)'}}>
              <h4>{n.title}</h4>
              <p style={{margin: '0.5rem 0', fontSize: '0.9rem'}}>{n.content}</p>
              <small style={{color: 'var(--text-muted)'}}>{new Date(n.date_envoi).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGrades = () => (
    <div className="glass-panel">
      <h2>Manage Grades (Overview)</h2>
      <div className="table-container" style={{marginTop: '1.5rem'}}>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Avg</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reportCards.map(rc => (
              <tr key={rc.id}>
                <td>Student #{rc.student}</td>
                <td>{rc.academic_year}</td>
                <td>{rc.semester}</td>
                <td>{rc.general_average}</td>
                <td><button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', fontSize: '0.75rem'}}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  switch(activeTab) {
    case 'calendar': return renderCalendar();
    case 'notifications': return renderNotifications();
    case 'grades': return renderGrades();
    default: return renderOverview();
  }
}

export default TeacherDashboard;

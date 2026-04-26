import React, { useState, useEffect } from 'react';
import api from '../api';

function TeacherDashboard({ activeTab, demoUser }) {
  const [calendar, setCalendar] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [reportCards, setReportCards] = useState([]);
  const [students, setStudents] = useState([]);

  // Forms
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start_time: '', end_time: '', event_type: 'Cours' });
  const [newNotif, setNewNotif] = useState({ title: '', content: '' });
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [eventSuccess, setEventSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/portal/calendar/').then(res => setCalendar(res.data));
    api.get('/portal/notifications/').then(res => setNotifications(res.data));
    api.get('/portal/absences/').then(res => setAbsences(res.data));
    api.get('/portal/report-cards/').then(res => setReportCards(res.data));
    api.get('/accounts/users/').then(res => {
      setStudents(res.data.filter(u => u.role === 'student'));
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!demoUser) return;

    api.post('/portal/calendar/', {
      ...newEvent,
      created_by: demoUser.id
    }).then(() => {
      setNewEvent({ title: '', description: '', start_time: '', end_time: '', event_type: 'Cours' });
      setEventSuccess(true);
      setTimeout(() => setEventSuccess(false), 3000);
      fetchData();
    });
  };

  const handleSendNotif = (e) => {
    e.preventDefault();
    if (!demoUser) return;

    const recipientIds = students.map(s => s.id);
    if (recipientIds.length === 0) {
      alert('No students found to notify.');
      return;
    }

    api.post('/portal/notifications/', {
      ...newNotif,
      type_notif: 'Info',
      sender: demoUser.id,
      recipients: recipientIds
    }).then(() => {
      setNewNotif({ title: '', content: '' });
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
      fetchData();
    }).catch(err => {
      console.error('Error sending notification:', err);
    });
  };

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Profile Card - Spacious */}
      <div className="glass-panel">
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            backgroundColor: 'rgba(16,185,129,0.1)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid rgba(16,185,129,0.3)', flexShrink: 0
          }}>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hajar&style=circle&mouth=smile,default&eyebrows=default&eyes=default"
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ marginBottom: '0.25rem' }}>
              {demoUser ? `${demoUser.first_name} ${demoUser.last_name}` : 'Teacher Profile'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Teacher</p>
            {demoUser && demoUser.teacher_profile ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.875rem 1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Matricule</p>
                  <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{demoUser.matricule}</p>
                </div>
                <div style={{ padding: '0.875rem 1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</p>
                  <p style={{ fontWeight: 600 }}>{demoUser.teacher_profile.departement}</p>
                </div>
                <div style={{ padding: '0.875rem 1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</p>
                  <p style={{ fontWeight: 600 }}>{demoUser.teacher_profile.matiere}</p>
                </div>
                <div style={{ padding: '0.875rem 1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{demoUser.email}</p>
                </div>
              </div>
            ) : <p>Loading...</p>}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{students.length}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Students</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>{calendar.length}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Events Scheduled</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>
            {notifications.filter(n => demoUser && n.sender === demoUser.id).length}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Notifications Sent</p>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayColors = [
      'rgba(79, 70, 229, 0.15)',
      'rgba(245, 158, 11, 0.15)',
      'rgba(239, 68, 68, 0.15)',
      'rgba(16, 185, 129, 0.15)',
      'rgba(59, 130, 246, 0.15)',
    ];
    const dayBorders = ['#4F46E5', '#F59E0B', '#EF4444', '#10B981', '#3B82F6'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Weekly Schedule */}
        <div className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem' }}>📅 My Weekly Schedule</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {days.map((day, idx) => (
              <div key={day} style={{
                border: `1px solid ${dayBorders[idx]}30`,
                borderTop: `3px solid ${dayBorders[idx]}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                background: dayColors[idx],
                minHeight: '150px'
              }}>
                <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: dayBorders[idx], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{day}</h4>
                {idx === 0 && <div style={{ padding: '0.5rem', background: 'white', marginBottom: '0.5rem', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `3px solid #4F46E5` }}><p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4F46E5' }}>08:30 – 10:30</p><p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Algorithmique</p></div>}
                {idx === 1 && <div style={{ padding: '0.5rem', background: 'white', marginBottom: '0.5rem', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `3px solid #F59E0B` }}><p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>08:30 – 12:45</p><p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Base de Données</p></div>}
                {idx === 2 && <div style={{ padding: '0.5rem', background: 'white', marginBottom: '0.5rem', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `3px solid #EF4444` }}><p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EF4444' }}>14:00 – 18:00</p><p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Réseaux</p></div>}
                {idx === 4 && <div style={{ padding: '0.5rem', background: 'white', marginBottom: '0.5rem', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `3px solid #3B82F6` }}><p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6' }}>10:45 – 12:45</p><p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Projet Tutoré</p></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events from DB */}
        <div className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem' }}>📋 Scheduled Events</h2>
          {calendar.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No events scheduled.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {calendar.map(ev => (
                <div key={ev.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem', background: 'var(--background)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
                    background: ev.event_type === 'Examen' ? 'rgba(239,68,68,0.1)' : ev.event_type === 'TD' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0
                  }}>
                    {ev.event_type === 'Examen' ? '📝' : ev.event_type === 'TD' ? '🔬' : '📚'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>{ev.title}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{ev.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{new Date(ev.start_time).toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(ev.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} – {new Date(ev.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem', fontWeight: 700,
                    background: ev.event_type === 'Examen' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                    color: ev.event_type === 'Examen' ? '#EF4444' : '#10B981',
                    flexShrink: 0
                  }}>{ev.event_type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Event Form — below everything */}
        <div className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem' }}>➕ Add Calendar Event</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Events you add here will appear in students' calendars automatically.
          </p>
          {eventSuccess && (
            <div style={{ padding: '0.875rem', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 500 }}>
              ✅ Event added successfully! Students can now see it in their calendar.
            </div>
          )}
          <form onSubmit={handleAddEvent}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Event Title</label>
                <input type="text" className="input-field" placeholder="e.g. Examen Final Algorithmique" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Description (optional)</label>
                <input type="text" className="input-field" placeholder="e.g. Salle 301 - Documents autorisés" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Event Type</label>
                <select className="input-field" value={newEvent.event_type} onChange={e => setNewEvent({ ...newEvent, event_type: e.target.value })}>
                  <option value="Cours">Cours</option>
                  <option value="TD">TD</option>
                  <option value="TP">TP</option>
                  <option value="Examen">Examen</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Start Time</label>
                <input type="datetime-local" className="input-field" value={newEvent.start_time} onChange={e => setNewEvent({ ...newEvent, start_time: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">End Time</label>
                <input type="datetime-local" className="input-field" value={newEvent.end_time} onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>📅 Add to Student Calendar</button>
          </form>
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    const sentByMe = notifications.filter(n => demoUser && n.sender === demoUser.id);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel">
          <h2 style={{ marginBottom: '0.5rem' }}>📢 Send Notification to Students</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Your message will be sent to all {students.length} enrolled student(s).
          </p>
          {notifSuccess && (
            <div style={{ padding: '0.875rem', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 500 }}>
              ✅ Notification sent successfully to {students.length} student(s)!
            </div>
          )}
          <form onSubmit={handleSendNotif}>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input type="text" className="input-field" placeholder="e.g. Rappel de cours demain" value={newNotif.title} onChange={e => setNewNotif({ ...newNotif, title: e.target.value })} required />
            </div>
            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea className="input-field" rows={4} placeholder="Write your message here..." value={newNotif.content} onChange={e => setNewNotif({ ...newNotif, content: e.target.value })} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">🔔 Send to All Students</button>
          </form>
        </div>

        <div className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem' }}>📬 Sent History</h2>
          {sentByMe.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No notifications sent yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sentByMe.map(n => (
                <div key={n.id} style={{ padding: '1rem 1.25rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <h4 style={{ marginBottom: '0.35rem' }}>{n.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{n.content}</p>
                    </div>
                    <small style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                      {new Date(n.date_envoi).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGrades = () => (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1.5rem' }}>📊 Manage Grades (Overview)</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Average</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reportCards.map(rc => (
              <tr key={rc.id}>
                <td>Student #{rc.student}</td>
                <td>{rc.academic_year}</td>
                <td>{rc.semester}</td>
                <td><span style={{ color: rc.general_average >= 10 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{rc.general_average}</span></td>
                <td><button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'calendar': return renderCalendar();
    case 'notifications': return renderNotifications();
    case 'grades': return renderGrades();
    default: return renderOverview();
  }
}

export default TeacherDashboard;

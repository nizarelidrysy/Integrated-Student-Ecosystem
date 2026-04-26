import React, { useState, useEffect } from 'react';
import api from '../api';

function AdminDashboard({ activeTab, demoUser }) {
  const [notifications, setNotifications] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [newNotif, setNewNotif] = useState({ title: '', content: '' });
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    api.get('/portal/notifications/').then(res => setNotifications(res.data));
    api.get('/portal/absences/').then(res => setAbsences(res.data));
    api.get('/portal/document-requests/').then(res => setDocumentRequests(res.data));
    api.get('/accounts/users/').then(res => setStudents(res.data.filter(u => u.role === 'student')));
  };

  const handleSendNotif = (e) => {
    e.preventDefault();
    if (!demoUser) return;
    const recipientIds = students.map(s => s.id);
    if (recipientIds.length === 0) { alert('No students found.'); return; }

    api.post('/portal/notifications/', {
      ...newNotif,
      type_notif: 'Urgent',
      sender: demoUser.id,
      recipients: recipientIds
    }).then(() => {
      setNewNotif({ title: '', content: '' });
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
      fetchData();
    }).catch(err => console.error('Notification error:', err));
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      api.delete(`/accounts/users/${id}/`).then(() => fetchData());
    }
  };

  const handleValidation = (type, id, status) => {
    const endpoint = type === 'absence' ? `/portal/absences/${id}/` : `/portal/document-requests/${id}/`;
    const payload = type === 'absence' ? { justification_status: status } : { status };
    api.patch(endpoint, payload).then(() => fetchData());
  };

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel">
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(16,185,129,0.3)', flexShrink: 0 }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amjad&style=circle&mouth=smile,default&eyebrows=default&eyes=default" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ marginBottom: '0.25rem' }}>
              {demoUser ? `${demoUser.first_name} ${demoUser.last_name}` : 'Admin Control Center'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Administrator</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Matricule', value: demoUser?.matricule, highlight: true },
                { label: 'Service', value: demoUser?.admin_profile?.service },
                { label: 'Email', value: demoUser?.email },
              ].map(({ label, value, highlight }) => (
                <div key={label} style={{ padding: '0.875rem 1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <p style={{ fontWeight: 600, color: highlight ? 'var(--primary)' : 'inherit', fontSize: '0.9rem' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{students.length}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Students</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{documentRequests.filter(r => r.status === 'Pending').length}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Docs Pending</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{absences.filter(a => a.justification_status === 'Pending').length}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Absences Pending</p>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => {
    const sentByMe = notifications.filter(n => demoUser && n.sender === demoUser.id);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel">
          <h2 style={{ marginBottom: '0.5rem' }}>📢 Global Announcement</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Broadcast to all {students.length} enrolled student(s).
          </p>
          {notifSuccess && (
            <div style={{ padding: '0.875rem', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 500 }}>
              ✅ Announcement sent to {students.length} student(s) successfully!
            </div>
          )}
          <form onSubmit={handleSendNotif}>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input type="text" className="input-field" placeholder="e.g. Fermeture exceptionnelle" value={newNotif.title} onChange={e => setNewNotif({ ...newNotif, title: e.target.value })} required />
            </div>
            <div className="input-group">
              <label className="input-label">Content</label>
              <textarea className="input-field" rows={4} placeholder="Write your announcement here..." value={newNotif.content} onChange={e => setNewNotif({ ...newNotif, content: e.target.value })} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">🔔 Broadcast to All Students</button>
          </form>
        </div>

        <div className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem' }}>📬 Sent Announcements</h2>
          {sentByMe.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No announcements sent yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sentByMe.map(n => (
                <div key={n.id} style={{ padding: '1rem 1.25rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', borderLeft: '3px solid var(--secondary)' }}>
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

  const renderStudents = () => (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1.5rem' }}>👥 Student Directory</h2>
      <div className="table-container">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Major</th><th>Year</th><th>Actions</th></tr></thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.student_profile?.numero_etudiant}</td>
                <td>{s.first_name} {s.last_name}</td>
                <td>{s.student_profile?.filiere}</td>
                <td>{s.student_profile?.annee_etude}</td>
                <td><button className="btn btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDeleteStudent(s.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderValidations = () => (
    <div className="grid-cards">
      <div className="glass-panel">
        <h2 style={{ marginBottom: '1.5rem' }}>📋 Absence Justifications</h2>
        {absences.filter(a => a.justification_status === 'Pending' && a.justification_text).map(a => (
          <div key={a.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <p><strong>Student:</strong> {a.student_details?.first_name} {a.student_details?.last_name}</p>
            <p><strong>Date:</strong> {a.date_seance} | <strong>Subject:</strong> {a.subject}</p>
            <p style={{ margin: '0.5rem 0', padding: '0.5rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>"{a.justification_text}"</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-success" style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleValidation('absence', a.id, 'Validated')}>Approve</button>
              <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleValidation('absence', a.id, 'Rejected')}>Reject</button>
            </div>
          </div>
        ))}
        {absences.filter(a => a.justification_status === 'Pending' && a.justification_text).length === 0 && <p style={{ color: 'var(--text-muted)' }}>No pending justifications.</p>}
      </div>
      <div className="glass-panel">
        <h2 style={{ marginBottom: '1.5rem' }}>📄 Document Requests</h2>
        {documentRequests.filter(r => r.status === 'Pending').map(req => (
          <div key={req.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <p><strong>Student:</strong> {req.student_details?.first_name} {req.student_details?.last_name}</p>
            <p><strong>Document:</strong> {req.document_type === 'Scolarite' ? 'Attestation de Scolarité' : 'Attestation de Réussite'}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requested on {new Date(req.created_at).toLocaleDateString()}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-success" style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleValidation('document', req.id, 'Validated')}>Approve & Generate</button>
              <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleValidation('document', req.id, 'Rejected')}>Reject</button>
            </div>
          </div>
        ))}
        {documentRequests.filter(r => r.status === 'Pending').length === 0 && <p style={{ color: 'var(--text-muted)' }}>No pending requests.</p>}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'notifications': return renderNotifications();
    case 'students': return renderStudents();
    case 'validations': return renderValidations();
    default: return renderOverview();
  }
}

export default AdminDashboard;

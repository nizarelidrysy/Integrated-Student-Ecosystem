import React, { useState, useEffect } from 'react';
import api from '../api';

function AdminDashboard({ activeTab, demoUser }) {
  const [notifications, setNotifications] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [newNotif, setNewNotif] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/portal/notifications/').then(res => setNotifications(res.data));
    api.get('/portal/absences/').then(res => setAbsences(res.data));
    api.get('/portal/document-requests/').then(res => setDocumentRequests(res.data));
    api.get('/accounts/users/').then(res => {
      setStudents(res.data.filter(u => u.role === 'student'));
    });
  };

  const handleSendNotif = (e) => {
    e.preventDefault();
    if (!demoUser) return;
    
    // In a real scenario, this sends to all users or selected ones
    api.post('/portal/notifications/', {
      ...newNotif,
      sender: demoUser.id,
      recipients: students.map(s => s.id)
    }).then(() => {
      setNewNotif({ title: '', content: '' });
      fetchData();
    });
  };

  const handleDeleteStudent = (id) => {
    if(window.confirm('Are you sure you want to delete this student?')) {
      api.delete(`/accounts/users/${id}/`).then(() => {
        fetchData();
      });
    }
  };

  const handleValidation = (type, id, status) => {
    const endpoint = type === 'absence' ? `/portal/absences/${id}/` : `/portal/document-requests/${id}/`;
    const payload = type === 'absence' ? { justification_status: status } : { status: status };
    
    api.patch(endpoint, payload).then(() => {
      fetchData();
    });
  };

  const renderOverview = () => (
    <div className="grid-cards">
      <div className="glass-panel" style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
        <div style={{width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amjad&style=circle&mouth=smile,default&eyebrows=default&eyes=default" alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div>
          <h3 style={{marginBottom: '0.5rem'}}>Admin Control Center</h3>
          <p><strong>Name:</strong> {demoUser?.first_name} {demoUser?.last_name}</p>
          <p><strong>Matricule:</strong> <span className="badge badge-info">{demoUser?.matricule}</span></p>
          <p><strong>Service:</strong> {demoUser?.admin_profile?.service}</p>
          <p style={{marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
            Managing {students.length} Students | {documentRequests.filter(r => r.status === 'Pending').length} Docs Pending | {absences.filter(a => a.justification_status === 'Pending').length} Absences Pending
          </p>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="grid-cards">
      <div className="glass-panel">
        <h2>Global Announcement</h2>
        <form onSubmit={handleSendNotif} style={{marginTop: '1.5rem'}}>
          <div className="input-group">
            <label className="input-label">Title</label>
            <input type="text" className="input-field" value={newNotif.title} onChange={e => setNewNotif({...newNotif, title: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Content</label>
            <textarea className="input-field" rows={4} value={newNotif.content} onChange={e => setNewNotif({...newNotif, content: e.target.value})} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Broadcast to All</button>
        </form>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="glass-panel">
      <h2>Student Directory</h2>
      <div className="table-container" style={{marginTop: '1.5rem'}}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Major</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.student_profile?.numero_etudiant}</td>
                <td>{s.first_name} {s.last_name}</td>
                <td>{s.student_profile?.filiere}</td>
                <td>{s.student_profile?.annee_etude}</td>
                <td>
                  <button className="btn btn-danger" style={{padding: '0.2rem 0.5rem', fontSize: '0.75rem'}} onClick={() => handleDeleteStudent(s.id)}>Delete</button>
                </td>
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
        <h2>Absence Justifications</h2>
        <div style={{marginTop: '1.5rem'}}>
          {absences.filter(a => a.justification_status === 'Pending' && a.justification_text).map(a => (
            <div key={a.id} style={{padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem'}}>
              <p><strong>Student:</strong> {a.student_details?.first_name} {a.student_details?.last_name}</p>
              <p><strong>Date:</strong> {a.date_seance} | <strong>Subject:</strong> {a.subject}</p>
              <p style={{margin: '0.5rem 0', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)'}}>
                "{a.justification_text}"
              </p>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button className="btn btn-success" style={{padding: '0.3rem 0.6rem'}} onClick={() => handleValidation('absence', a.id, 'Validated')}>Approve</button>
                <button className="btn btn-danger" style={{padding: '0.3rem 0.6rem'}} onClick={() => handleValidation('absence', a.id, 'Rejected')}>Reject</button>
              </div>
            </div>
          ))}
          {absences.filter(a => a.justification_status === 'Pending' && a.justification_text).length === 0 && <p className="text-muted">No pending justifications.</p>}
        </div>
      </div>

      <div className="glass-panel">
        <h2>Document Requests</h2>
        <div style={{marginTop: '1.5rem'}}>
          {documentRequests.filter(r => r.status === 'Pending').map(req => (
            <div key={req.id} style={{padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem'}}>
              <p><strong>Student:</strong> {req.student_details?.first_name} {req.student_details?.last_name}</p>
              <p><strong>Document:</strong> {req.document_type === 'Scolarite' ? 'Attestation de Scolarité' : 'Attestation de Réussite'}</p>
              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Requested on {new Date(req.created_at).toLocaleDateString()}</p>
              <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                <button className="btn btn-success" style={{padding: '0.3rem 0.6rem'}} onClick={() => handleValidation('document', req.id, 'Validated')}>Approve & Generate</button>
                <button className="btn btn-danger" style={{padding: '0.3rem 0.6rem'}} onClick={() => handleValidation('document', req.id, 'Rejected')}>Reject</button>
              </div>
            </div>
          ))}
          {documentRequests.filter(r => r.status === 'Pending').length === 0 && <p className="text-muted">No pending requests.</p>}
        </div>
      </div>
    </div>
  );

  switch(activeTab) {
    case 'notifications': return renderNotifications();
    case 'students': return renderStudents();
    case 'validations': return renderValidations();
    default: return renderOverview();
  }
}

export default AdminDashboard;

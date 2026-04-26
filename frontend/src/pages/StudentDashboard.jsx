import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../api';

function StudentDashboard({ activeTab, demoUser }) {
  const [calendar, setCalendar] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reportCards, setReportCards] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);

  // Form states
  const [justificationText, setJustificationText] = useState('');
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [docType, setDocType] = useState('Scolarite');

  useEffect(() => {
    // Fetch data
    api.get('/portal/calendar/').then(res => setCalendar(res.data));
    api.get('/portal/notifications/').then(res => setNotifications(res.data));
    api.get('/portal/report-cards/').then(res => setReportCards(res.data));
    api.get('/portal/absences/').then(res => setAbsences(res.data));
    api.get('/portal/document-requests/').then(res => setDocumentRequests(res.data));
  }, []);

  const handleDeleteNotification = (id) => {
    api.delete(`/portal/notifications/${id}/`).then(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }).catch(() => {
      // Optimistic delete on failure
      setNotifications(prev => prev.filter(n => n.id !== id));
    });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleJustifyAbsence = (e) => {
    e.preventDefault();
    if (!selectedAbsence) return;
    
    // In a real app, we'd patch the absence object
    api.patch(`/portal/absences/${selectedAbsence}/`, {
      justification_text: justificationText,
      justification_status: 'Pending'
    }).then(() => {
      setJustificationText('');
      setSelectedAbsence(null);
      // Refresh absences
      api.get('/portal/absences/').then(res => setAbsences(res.data));
    });
  };

  const handleDocRequest = (e) => {
    e.preventDefault();
    if (!demoUser) return;

    api.post('/portal/document-requests/', {
      student: demoUser.id,
      document_type: docType,
      status: 'Pending'
    }).then(() => {
      api.get('/portal/document-requests/').then(res => setDocumentRequests(res.data));
    });
  };

  const renderOverview = () => (
    <div className="grid-cards">
      <div className="glass-panel" style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
        <div style={{width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nizar&mouth=smile,default&eyebrows=default&eyes=default" alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div>
          <h3 style={{marginBottom: '0.5rem'}}>Profile Info</h3>
          {demoUser && demoUser.student_profile ? (
            <div>
              <p><strong>Name:</strong> {demoUser.first_name} {demoUser.last_name}</p>
              <p><strong>Matricule:</strong> <span className="badge badge-info">{demoUser.matricule}</span></p>
              <p><strong>Email:</strong> {demoUser.email}</p>
              <p><strong>Major:</strong> {demoUser.student_profile.filiere}</p>
              <p><strong>Year:</strong> {demoUser.student_profile.annee_etude}</p>
              <p><strong>Tutor:</strong> {demoUser.student_profile.tutor_name}</p>
            </div>
          ) : <p>Loading profile...</p>}
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
      <div className="glass-panel">
        <h2>My Weekly Schedule</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginTop: '1.5rem'}}>
          {days.map((day, idx) => (
            <div key={day} style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', background: 'rgba(0,0,0,0.2)'}}>
              <h3 style={{borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', textAlign: 'center'}}>{day}</h3>
              {/* Simulate subjects filling the calendar */}
              {idx === 0 && <div style={{padding: '0.5rem', background: 'rgba(79, 70, 229, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>08:30 - 10:30</strong><br/>Algorithmique</div>}
              {idx === 0 && <div style={{padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>10:45 - 12:45</strong><br/>Dev Web</div>}
              {idx === 1 && <div style={{padding: '0.5rem', background: 'rgba(245, 158, 11, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>08:30 - 12:45</strong><br/>Base de Données</div>}
              {idx === 2 && <div style={{padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>14:00 - 18:00</strong><br/>Réseaux</div>}
              {idx === 3 && <div style={{padding: '0.5rem', background: 'rgba(79, 70, 229, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>08:30 - 10:30</strong><br/>Systèmes d'Exp.</div>}
              {idx === 4 && <div style={{padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', marginBottom: '0.5rem', borderRadius: '4px'}}><strong>10:45 - 12:45</strong><br/>Projet</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="glass-panel">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Notifications</h2>
        {notifications.length > 0 && (
          <button className="btn btn-secondary" onClick={handleClearAllNotifications}>Clear All</button>
        )}
      </div>
      <div style={{marginTop: '1.5rem'}}>
        {notifications.length === 0 ? <p>No new notifications.</p> : notifications.map(n => (
          <div key={n.id} style={{padding: '1rem', borderBottom: '1px solid var(--border)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h4>{n.title}</h4>
              <button 
                onClick={() => handleDeleteNotification(n.id)}
                style={{background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.2rem'}}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <p style={{margin: '0.5rem 0'}}>{n.content}</p>
            <small style={{color: 'var(--text-muted)'}}>{new Date(n.date_envoi).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    if (reportCards.length > 0) {
      const years = [...new Set(reportCards.map(rc => rc.academic_year))];
      if (!selectedYear) setSelectedYear(years[0]);
    }
  }, [reportCards]);

  useEffect(() => {
    if (selectedYear) {
      const sems = reportCards.filter(rc => rc.academic_year === selectedYear).map(rc => rc.semester);
      if (sems.length > 0 && !sems.includes(selectedSemester)) setSelectedSemester(sems[0]);
    }
  }, [selectedYear, reportCards]);

  const renderGrades = () => {
    const years = [...new Set(reportCards.map(rc => rc.academic_year))];
    const availableSemesters = reportCards.filter(rc => rc.academic_year === selectedYear).map(rc => rc.semester);
    
    const activeRc = reportCards.find(rc => rc.academic_year === selectedYear && rc.semester === selectedSemester);

    return (
    <div className="glass-panel">
      <h2>Report Cards</h2>
      
      {reportCards.length > 0 ? (
        <div style={{marginTop: '1.5rem'}}>
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
            <div className="input-group" style={{marginBottom: 0, flex: 1}}>
              <label className="input-label">Year</label>
              <select className="input-field" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="input-group" style={{marginBottom: 0, flex: 1}}>
              <label className="input-label">Semester</label>
              <select className="input-field" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
                {availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          {activeRc ? (
          <div style={{padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)'}}>
            <p style={{marginBottom: '1rem'}}><strong>General Average:</strong> <span style={{color: activeRc.general_average >= 10 ? 'var(--success)' : 'var(--danger)'}}>{activeRc.general_average}</span></p>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>Grade</th>
                    <th>Rattrapage</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRc.grades.map(g => (
                    <tr key={g.id}>
                      <td>{g.subject}</td>
                      <td>{g.evaluation_type}</td>
                      <td style={{color: g.value >= 10 ? 'var(--success)' : 'var(--danger)'}}>{g.value}</td>
                      <td>{g.is_rattrapage ? <span className="badge badge-warning">Yes</span> : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          ) : <p>No data for this semester.</p>}
        </div>
      ) : <p>No report cards available.</p>}
    </div>
    );
  };

  const renderAbsences = () => (
    <div className="glass-panel">
      <h2>Absences</h2>
      <div className="table-container" style={{marginTop: '1.5rem'}}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {absences.filter(a => !a.is_present).map(a => (
              <tr key={a.id}>
                <td>{a.date_seance}</td>
                <td>{a.subject}</td>
                <td>
                  <span className={`badge ${a.justification_status === 'Validated' ? 'badge-success' : a.justification_status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {a.justification_status}
                  </span>
                </td>
                <td>
                  {!a.justification_text && (
                    <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', fontSize: '0.75rem'}} onClick={() => setSelectedAbsence(a.id)}>Justify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAbsence && (
        <form onSubmit={handleJustifyAbsence} style={{marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)'}}>
          <h4>Submit Justification</h4>
          <div className="input-group" style={{marginTop: '1rem'}}>
            <label className="input-label">Reason / Notes</label>
            <textarea className="input-field" value={justificationText} onChange={e => setJustificationText(e.target.value)} required rows={3}></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit Justification</button>
          <button type="button" className="btn btn-secondary" style={{marginLeft: '0.5rem'}} onClick={() => setSelectedAbsence(null)}>Cancel</button>
        </form>
      )}
    </div>
  );

  const renderDocuments = () => (
    <div className="grid-cards">
      <div className="glass-panel">
        <h2>Request Document</h2>
        <form onSubmit={handleDocRequest} style={{marginTop: '1.5rem'}}>
          <div className="input-group">
            <label className="input-label">Document Type</label>
            <select className="input-field" value={docType} onChange={e => setDocType(e.target.value)}>
              <option value="Scolarite">Attestation de Scolarité</option>
              <option value="Reussite">Attestation de Réussite</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit Request</button>
        </form>
      </div>

      <div className="glass-panel">
        <h2>My Requests</h2>
        <div style={{marginTop: '1.5rem'}}>
          {documentRequests.map(req => (
            <div key={req.id} style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border)'}}>
              <div>
                <strong>{req.document_type === 'Scolarite' ? 'Attestation de Scolarité' : 'Attestation de Réussite'}</strong>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{new Date(req.created_at).toLocaleDateString()}</p>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem'}}>
                <span className={`badge ${req.status === 'Validated' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                  {req.status}
                </span>
                {req.status === 'Validated' && (
                  <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', fontSize: '0.75rem'}}>Download PDF</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  switch(activeTab) {
    case 'calendar': return renderCalendar();
    case 'notifications': return renderNotifications();
    case 'grades': return renderGrades();
    case 'absences': return renderAbsences();
    case 'documents': return renderDocuments();
    default: return renderOverview();
  }
}

export default StudentDashboard;
